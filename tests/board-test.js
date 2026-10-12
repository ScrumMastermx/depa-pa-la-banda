// Offline functional test for both board templates, using a tiny DOM shim (no jsdom, no network).
//   node tests/board-test.js <repo-root>
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), assert = require("assert");
const REPO = path.resolve(process.argv[2] || path.join(__dirname, ".."));
const FIX = JSON.parse(fs.readFileSync(path.join(REPO, "tests/fixtures/listings-sample.json"), "utf8")).listings;
const tick = () => new Promise((r) => setTimeout(r, 5));
const settle = async () => { for (let i = 0; i < 6; i++) await tick(); };

// ---- DOM shim: elements are created on demand by id; dynamic children are built by the page's own script ----
class TextNode { constructor(t) { this.nodeType = 3; this.textContent = String(t); } }
class El {
  constructor(tag) {
    this.tagName = tag; this.children = []; this.attrs = {}; this.className = ""; this.dataset = {}; this.listeners = {};
    this.value = ""; this.checked = false; this.hidden = false; this.style = {}; this._text = ""; this.disabled = false;
    const self = this;
    this.classList = {
      add: (c) => { if (!self.classList.contains(c)) self.className = (self.className + " " + c).trim(); },
      remove: (c) => { self.className = self.className.split(/\s+/).filter((x) => x && x !== c).join(" "); },
      contains: (c) => self.className.split(/\s+/).includes(c)
    };
  }
  get childNodes() { return this.children; }
  get textContent() { return this._text + this.children.map((c) => c.textContent).join(""); }
  set textContent(v) { this.children = []; this._text = String(v); }
  append(...n) { for (const x of n) this.children.push(typeof x === "string" ? new TextNode(x) : x); }
  appendChild(n) { this.children.push(n); return n; }
  replaceChildren(...n) { this.children = []; this._text = ""; this.append(...n); }
  setAttribute(k, v) { this.attrs[k] = v; }
  addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); }
  focus() {}
  click() { return this.dispatch("click"); }
  dispatch(type, extra) {
    const e = Object.assign({ type, target: this, key: "", stopPropagation() {}, preventDefault() {}, dataTransfer: { _d: {}, setData(k, v) { this._d[k] = v; }, getData(k) { return this._d[k]; } } }, extra);
    for (const f of this.listeners[type] || []) f(e);
    if (typeof this["on" + type] === "function") return this["on" + type](e);
  }
}
const walk = (n, f, out = []) => { if (n.nodeType === 3) return out; if (f(n)) out.push(n); for (const c of n.children) walk(c, f, out); return out; };

function makeEnv(extraWindow = {}, storage = {}) {
  const ids = {};
  const doc = new El("document");
  doc.documentElement = { lang: "en" };
  doc.getElementById = (id) => (ids[id] = ids[id] || Object.assign(new El("x"), { id }));
  doc.createElement = (t) => new El(t);
  doc.createTextNode = (t) => new TextNode(t);
  const ls = { getItem: (k) => (k in storage ? storage[k] : null), setItem: (k, v) => { storage[k] = String(v); } };
  const window = Object.assign({}, extraWindow);
  return { doc, ids, storage, ctx: vm.createContext({ document: doc, window, localStorage: ls, setTimeout, console, URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} }, Blob: class { constructor(p) { this.parts = p; } } }) };
}
function page(file, repl) {
  let h = fs.readFileSync(path.join(REPO, "skills/tablero/assets", file), "utf8");
  for (const [k, v] of Object.entries(repl)) h = h.split(k).join(v);
  assert(!/__DEPA_/.test(h), file + ": leftover markers");
  return h.match(/<script>([\s\S]*?)<\/script>/)[1];
}
const CONFIG = { lang: "en", title: "Depa Sampleville", city: "Sampleville", referenceLabel: "office", budgetMax: 30000, currency: "MXN", bedroomsMin: 2, maxCommute: 40, built: "2026-01-01T00:00:00.000Z" };
const BASE = { "/*__DEPA_CONFIG__*/{}": JSON.stringify(CONFIG), "__DEPA_LANG__": "en", "__DEPA_TITLE__": "Depa Sampleville" };
const localRepl = (data) => Object.assign({ "/*__DEPA_DATA__*/[]": JSON.stringify(data).replace(/</g, "\\u003c") }, BASE);

const cards = (env) => walk(env.ids.board, (n) => n.className.split(/\s+/).includes("card"));
const names = (root) => walk(root, (n) => n.tagName === "h3").map((h) => h.textContent);
const col = (env, stage) => env.ids.board.children.find((c) => c.dataset.stage === stage);
const cardByName = (env, nm) => cards(env).find((c) => names(c)[0] === nm);
async function moveCard(env, nm, stage) {
  const sel = walk(cardByName(env, nm), (n) => /move-select/.test(n.className))[0];
  sel.value = stage; sel.dispatch("change"); await settle();
}
let passed = 0;
const ok = (name, fn) => Promise.resolve().then(fn).then(() => { passed++; console.log("  PASS " + name); }, (e) => { console.log("  FAIL " + name + ": " + e.message); process.exitCode = 1; });

(async () => {
  console.log("== local board (board-template.html)");
  const local = page("board-template.html", localRepl(FIX));
  let env = makeEnv(); vm.runInContext(local, env.ctx); await settle();
  await ok("renders all fixture cards in the right columns", () => {
    assert.strictEqual(cards(env).length, 3);
    assert.deepStrictEqual(names(col(env, "suggested")), ["Blue Door"]);
    assert.deepStrictEqual(names(col(env, "finalist")), ["Café Corner"]);
    assert.strictEqual(env.ids.board.children.length, 8);
  });
  await ok("page title and criteria line come from config", () => {
    assert.strictEqual(env.ids.boardTitle.textContent, "Depa Sampleville");
    assert(/MXN 30,000/.test(env.ids.criteriaLine.textContent) && /office/.test(env.ids.criteriaLine.textContent));
  });
  await ok("stage change re-renders and persists in localStorage", async () => {
    await moveCard(env, "Blue Door", "contacted");
    assert.deepStrictEqual(names(col(env, "contacted")), ["Blue Door"]);
    const st = JSON.parse(env.storage["depa-board-state"]);
    assert.strictEqual(st.over["1"].stage, "contacted");
  });
  await ok("persisted stage survives a reload (same storage)", async () => {
    const env2 = makeEnv({}, env.storage); vm.runInContext(local, env2.ctx); await settle();
    assert.deepStrictEqual(names(col(env2, "contacted")), ["Blue Door"]);
  });
  await ok("storage older than the build is ignored", async () => {
    const stale = { "depa-board-state": JSON.stringify({ over: { 1: { stage: "visited", updatedAt: "2025-01-01T00:00:00.000Z" } }, added: [] }) };
    const env2 = makeEnv({}, stale); vm.runInContext(local, env2.ctx); await settle();
    assert.deepStrictEqual(names(col(env2, "suggested")), ["Blue Door"]);
  });
  await ok("search is accent-insensitive", () => {
    env.ids.search.value = "cafe"; env.ids.search.dispatch("input");
    assert.deepStrictEqual(cards(env).map((c) => names(c)[0]), ["Café Corner"]);
    env.ids.search.value = ""; env.ids.search.dispatch("input");
    assert.strictEqual(cards(env).length, 3);
  });
  await ok("sort newest / shortest commute / lowest price reorders a column", async () => {
    await moveCard(env, "Café Corner", "to_review");
    await moveCard(env, "Blue Door", "to_review");
    const order = () => names(col(env, "to_review"));
    env.ids.sort.value = "new"; env.ids.sort.dispatch("change");
    assert.deepStrictEqual(order(), ["Café Corner", "Roof Garden", "Blue Door"]);
    env.ids.sort.value = "near"; env.ids.sort.dispatch("change");
    assert.deepStrictEqual(order(), ["Blue Door", "Café Corner", "Roof Garden"]);
    env.ids.sort.value = "cheap"; env.ids.sort.dispatch("change");
    assert.strictEqual(order()[0], "Roof Garden");
  });
  await ok("add + edit through the sheet persists a new listing and a dated note", async () => {
    env.ids.addBtn.click(); env.ids["f-nickname"].value = "Green Gate"; env.ids["f-price"].value = "15000"; env.ids["f-maintenance"].value = "1000"; env.ids["f-bedrooms"].value = "2";
    env.ids.saveBtn.click(); await settle();
    const g = JSON.parse(env.storage["depa-board-state"]).added[0];
    assert.strictEqual(g.nickname, "Green Gate"); assert.strictEqual(g.total, 16000); assert.strictEqual(g.stage, "to_review");
    cardByName(env, "Green Gate").dispatch("click");
    env.ids["f-addnote"].value = "called, no answer"; env.ids.saveBtn.click(); await settle();
    assert(/^\d{4}-\d\d-\d\d: called, no answer$/m.test(JSON.parse(env.storage["depa-board-state"]).added[0].notes));
  });
  await ok("import JSON applies stage/notes by id and rejects bad files", async () => {
    env.ids.importFile.dispatch("change", { target: { files: [{ text: async () => JSON.stringify({ listings: [{ id: "2", stage: "discarded", notes: "gone" }] }) }], value: "x" } }); await settle();
    assert.deepStrictEqual(names(col(env, "discarded")), ["Roof Garden"]);
    assert(/Imported: 1/.test(env.ids.notice.textContent));
    env.ids.importFile.dispatch("change", { target: { files: [{ text: async () => "{nope" }], value: "x" } }); await settle();
    assert(/not a valid/.test(env.ids.notice.textContent));
  });
  await ok("connect folder reads listings.json and writes stage changes back", async () => {
    let file = JSON.stringify({ listings: FIX, keep: "me" });
    const handle = { getFile: async () => ({ text: async () => file }), createWritable: async () => { let buf = ""; return { write: async (s) => { buf += s; }, close: async () => { file = buf; } }; } };
    const e3 = makeEnv({ showDirectoryPicker: async () => ({ getFileHandle: async () => handle }) });
    vm.runInContext(local, e3.ctx); await settle();
    assert.strictEqual(e3.ids.connectBtn.hidden, false);
    e3.ids.connectBtn.click(); await settle();
    assert.deepStrictEqual(names(col(e3, "suggested")), ["Blue Door"]);
    await moveCard(e3, "Blue Door", "visited");
    const saved = JSON.parse(file);
    assert.strictEqual(saved.listings.find((l) => l.id === "1").stage, "visited");
    assert.strictEqual(saved.keep, "me"); assert.strictEqual(saved.listings.length, 3);
    assert.strictEqual(saved.listings.find((l) => l.id === "1").contact_phone, "55 0000 0000");
    assert.deepStrictEqual(names(col(e3, "visited")), ["Blue Door"]);
  });
  await ok("without File System Access the connect button stays hidden", () => {
    const e4 = makeEnv(); vm.runInContext(local, e4.ctx); assert.strictEqual(e4.ids.connectBtn.hidden, true);
  });

  console.log("== artifact board (board-artifact.html)");
  const art = page("board-artifact.html", BASE);
  function mockClaude({ docs, canWrite = true }) {
    const store = new Map(docs.map((d) => [String(d.id), Object.assign({}, d)])), calls = [], subs = [];
    const snapDocs = () => [...store.entries()].map(([id, data]) => ({ id, data: () => data }));
    const notify = () => subs.forEach((s) => s({ docs: snapDocs() }));
    const db = {
      doc: (p) => {
        const id = p.split("/")[1];
        return {
          update: async (patch) => { calls.push({ op: "update", path: p, patch }); if (!store.has(id)) throw { code: "invalid_argument" }; store.set(id, Object.assign({}, store.get(id), patch)); notify(); },
          set: async (data) => { calls.push({ op: "set", path: p, data }); store.set(id, data); notify(); }
        };
      },
      collection: (c) => ({ onSnapshot: (next) => { calls.push({ op: "subscribe", path: c }); subs.push(next); next({ docs: snapDocs() }); return () => {}; } })
    };
    const user = { id: async () => "u_test", can: async () => canWrite, isOwner: async () => true, canEdit: async () => canWrite };
    return { claude: { use: async (n) => (n === "db" ? db : n === "user" ? user : null) }, calls, store };
  }
  const withIds = FIX.map((d) => Object.assign({}, d, { createdAt: d.found_on + "T00:00:00Z" }));
  let m = mockClaude({ docs: withIds }); env = makeEnv({ claude: m.claude }); vm.runInContext(art, env.ctx); await settle();
  await ok("artifact: subscribes to the depas collection and renders docs by stage", () => {
    assert(m.calls.some((c) => c.op === "subscribe" && c.path === "depas"));
    assert.strictEqual(cards(env).length, 3);
    assert.deepStrictEqual(names(col(env, "finalist")), ["Café Corner"]);
  });
  await ok("artifact: moving a card calls db update on depas/<id> with the new stage", async () => {
    await moveCard(env, "Blue Door", "visit_scheduled");
    const u = m.calls.find((c) => c.op === "update");
    assert.strictEqual(u.path, "depas/1"); assert.strictEqual(u.patch.stage, "visit_scheduled");
    assert.strictEqual(u.patch.updatedBy, "u_test"); assert(u.patch.updatedAt);
    assert.deepStrictEqual(names(col(env, "visit_scheduled")), ["Blue Door"]);
  });
  await ok("artifact: sheet edit with dated note updates notes and total", async () => {
    cardByName(env, "Roof Garden").dispatch("click");
    env.ids["f-addnote"].value = "asked for visit slot"; env.ids["f-price"].value = "9500"; env.ids["f-maintenance"].value = "";
    env.ids.saveBtn.click(); await settle();
    const u = m.calls.filter((c) => c.op === "update").pop();
    assert.strictEqual(u.path, "depas/2"); assert(/asked for visit slot/.test(u.patch.notes)); assert.strictEqual(u.patch.price, 9500); assert.strictEqual(u.patch.total, "?");
  });
  await ok("artifact: adding a listing sets a new depas/<id> doc with listings.json fields", async () => {
    env.ids.addBtn.click(); env.ids["f-nickname"].value = "Green Gate"; env.ids.saveBtn.click(); await settle();
    const s = m.calls.find((c) => c.op === "set");
    assert(/^depas\/m/.test(s.path));
    for (const k of ["id", "nickname", "title", "url", "source", "price", "currency", "stage", "scam_flags", "notes", "found_on", "createdAt", "updatedAt"]) assert(k in s.data, "missing " + k);
  });
  await ok("artifact: search works on db docs", () => {
    env.ids.search.value = "CAFE"; env.ids.search.dispatch("input");
    assert.deepStrictEqual(cards(env).map((c) => names(c)[0]), ["Café Corner"]);
  });
  m = mockClaude({ docs: withIds, canWrite: false }); env = makeEnv({ claude: m.claude }); vm.runInContext(art, env.ctx); await settle();
  await ok("artifact: read-only viewers get no edit controls", () => {
    assert.strictEqual(env.ids.addBtn.hidden, true);
    assert.strictEqual(walk(env.ids.board, (n) => /move-select/.test(n.className)).length, 0);
    assert(/view the board/.test(env.ids.notice.textContent));
  });
  m = mockClaude({ docs: [] }); env = makeEnv({ claude: m.claude }); vm.runInContext(art, env.ctx); await settle();
  await ok("artifact: empty database shows a designed empty state", () => {
    assert(/No listings yet/.test(env.ids.board.children[0].textContent));
  });
  env = makeEnv({}); vm.runInContext(art, env.ctx); await settle();
  await ok("artifact: opened outside claude.ai it explains instead of crashing", () => {
    assert(/Open this page from claude.ai/.test(env.ids.notice.textContent));
  });
  console.log("board-test: " + passed + " checks passed" + (process.exitCode ? " (WITH FAILURES)" : ""));
})();
