#!/usr/bin/env bash
# Offline smoke test: no Claude login, no network. Validates the plugin's shape.
#   - plugin.json / marketplace.json parse and agree
#   - every skill has frontmatter name + description, and the name matches its folder
#   - no broken relative links in Markdown files
#   - fixtures parse and are fictional-looking (fake phone pattern)
#   - the board template renders with fixture data and its script is valid JS (if node exists)
set -uo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
FIX="$REPO/tests/fixtures"
fail=0
check() { if eval "$2"; then echo "  PASS $1"; else echo "  FAIL $1"; fail=1; fi; }

echo "== manifests"
check "plugin.json parses"      'python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$REPO/.claude-plugin/plugin.json"'
check "marketplace.json parses" 'python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$REPO/.claude-plugin/marketplace.json"'
check "plugin name is depa"     'python3 -c "import json,sys; sys.exit(json.load(open(sys.argv[1]))[\"name\"]!=\"depa\")" "$REPO/.claude-plugin/plugin.json"'
check "marketplace lists depa"  'python3 -c "import json,sys; sys.exit(\"depa\" not in [p[\"name\"] for p in json.load(open(sys.argv[1]))[\"plugins\"]])" "$REPO/.claude-plugin/marketplace.json"'
check "versions match"          'python3 - "$REPO" <<PY
import json,sys
r=sys.argv[1]
a=json.load(open(r+"/.claude-plugin/plugin.json"))["version"]
b=json.load(open(r+"/.claude-plugin/marketplace.json"))["metadata"]["version"]
sys.exit(a!=b)
PY'

echo "== skills"
for f in "$REPO"/skills/*/SKILL.md; do
  d=$(basename "$(dirname "$f")")
  check "$d: frontmatter name matches folder" 'python3 - "$f" "$d" <<PY
import re,sys
t=open(sys.argv[1]).read()
m=re.match(r"---\n(.*?)\n---\n",t,re.S)
sys.exit(0 if m and re.search(r"^name: "+sys.argv[2]+r"$",m.group(1),re.M) else 1)
PY'
  check "$d: has description" 'python3 - "$f" <<PY
import re,sys
t=open(sys.argv[1]).read()
m=re.match(r"---\n(.*?)\n---\n",t,re.S)
sys.exit(0 if m and re.search(r"^description: \S.{20,}",m.group(1),re.M) else 1)
PY'
  check "$d: reads ground rules" 'grep -q "shared/ground-rules.md" "$f"'
done
check "all 7 skills present" '[[ $(ls -d "$REPO"/skills/*/ | wc -l) -eq 7 ]]'

echo "== links"
check "no broken relative links in .md files" 'python3 - "$REPO" <<PY
import os,re,sys
root=sys.argv[1]; bad=[]
for dp,dn,fn in os.walk(root):
    dn[:]=[d for d in dn if d not in (".git","out")]
    for f in fn:
        if not f.endswith(".md"): continue
        p=os.path.join(dp,f); t=open(p,encoding="utf-8").read()
        t=re.sub(r"\`\`\`.*?\`\`\`","",t,flags=re.S)
        for m in re.finditer(r"\]\(([^)\s]+)\)",t):
            u=m.group(1)
            if re.match(r"(https?:|mailto:|#)",u): continue
            u=u.split("#")[0]
            if u and not os.path.exists(os.path.normpath(os.path.join(dp,u))): bad.append((p,u))
for b in bad: print("   broken:",b)
sys.exit(1 if bad else 0)
PY'
check "referenced shared files exist" '[[ -f "$REPO/shared/ground-rules.md" && -f "$REPO/shared/chrome.md" ]]'

echo "== fixtures"
check "listings fixture parses"      'python3 -c "import json,sys; json.load(open(sys.argv[1]))" "$FIX/listings-sample.json"'
check "stages are valid"             'python3 - "$FIX/listings-sample.json" <<PY
import json,sys
ok={"suggested","to_review","contacted","visit_scheduled","visited","finalist","last_resort","discarded"}
sys.exit(0 if all(l["stage"] in ok for l in json.load(open(sys.argv[1]))["listings"]) else 1)
PY'
check "fixture phones are fake (55 0000 xxxx)" '! grep -hoE "\"contact_phone\": \"[^\"]*\"" "$FIX/listings-sample.json" | grep -qvE "55 0000 [0-9]{4}"'
check "criteria fixture has required keys" 'for k in city budget bedrooms_min pets furnished neighborhoods move_in visit_trip guarantee_options; do grep -q "^$k:" "$FIX/criteria-sample.yaml" || exit 1; done'

echo "== board templates (local + artifact)"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/depa-smoke.XXXXXX")"
python3 - "$REPO" "$TMP" <<'PY'
import json,sys
r,t=sys.argv[1:3]
data=json.load(open(r+"/tests/fixtures/listings-sample.json"))["listings"]
cfg=json.dumps({"lang":"en","title":"Depa Sampleville","budgetMax":30000,"currency":"MXN","bedroomsMin":2})
def fill(tpl):
    return (tpl.replace("/*__DEPA_DATA__*/[]",json.dumps(data).replace("<","\\u003c"))
               .replace("/*__DEPA_CONFIG__*/{}",cfg).replace("__DEPA_LANG__","en").replace("__DEPA_TITLE__","Depa Sampleville"))
for src,dst in (("board-template.html","board.html"),("board-artifact.html","board-artifact.html")):
    open(t+"/"+dst,"w",encoding="utf-8").write(fill(open(r+"/skills/tablero/assets/"+src,encoding="utf-8").read()))
PY
check "local template has data + config markers"    'grep -q "__DEPA_DATA__" "$REPO/skills/tablero/assets/board-template.html" && grep -q "__DEPA_CONFIG__" "$REPO/skills/tablero/assets/board-template.html"'
check "artifact template has config marker, no data"  'grep -q "__DEPA_CONFIG__" "$REPO/skills/tablero/assets/board-artifact.html" && ! grep -q "__DEPA_DATA__" "$REPO/skills/tablero/assets/board-artifact.html"'
check "rendered boards have no leftover markers" '! grep -q "__DEPA_" "$TMP/board.html" "$TMP/board-artifact.html"'
check "rendered local board contains fixture listing" 'grep -q "Blue Door" "$TMP/board.html"'
check "boards use no external scripts"  '! grep -qE "<script[^>]+src=" "$TMP/board.html" "$TMP/board-artifact.html"'
check "artifact page declares no html/head/body wrapper (tool adds it)" '! grep -qiE "<(!doctype|html[ >]|head[ >]|body[ >])" "$REPO/skills/tablero/assets/board-artifact.html"'
check "artifact page starts with <title>" 'head -1 "$REPO/skills/tablero/assets/board-artifact.html" | grep -q "^<title>"'
check "artifact page uses claude.use db + user, no window.claude.db" 'grep -q "claude.use(\"db\")" "$REPO/skills/tablero/assets/board-artifact.html" && grep -q "claude.use(\"user\")" "$REPO/skills/tablero/assets/board-artifact.html" && ! grep -q "window.claude.db" "$REPO/skills/tablero/assets/board-artifact.html"'
check "artifact page has dark-mode tokens + explicit body background" 'grep -q "prefers-color-scheme: dark" "$REPO/skills/tablero/assets/board-artifact.html" && grep -q "body { margin: 0; background: var(--bg)" "$REPO/skills/tablero/assets/board-artifact.html"'
check "artifact page needs no innerHTML (untrusted shared data)" '! grep -q "innerHTML" "$REPO/skills/tablero/assets/board-artifact.html"'
if command -v node >/dev/null 2>&1; then
  for b in board board-artifact; do
    check "$b script is valid JS" 'python3 -c "
import re,sys
h=open(sys.argv[1]).read()
open(sys.argv[2],\"w\").write(re.search(r\"<script>(.*?)</script>\",h,re.S).group(1))" "$TMP/$b.html" "$TMP/$b.js" && node --check "$TMP/$b.js"'
  done
  check "board behavior tests (DOM shim, mocked localStorage / folder / window.claude db)" 'node "$REPO/tests/board-test.js" "$REPO" > "$TMP/board-test.out" 2>&1; cat "$TMP/board-test.out" | sed "s/^/    /"; ! grep -q FAIL "$TMP/board-test.out" && grep -q "checks passed" "$TMP/board-test.out"'
else echo "  SKIP board script syntax and behavior tests (node not installed)"; fi
check "schema doc lists every fixture listing field" 'python3 - "$REPO" <<PY
import json,sys
r=sys.argv[1]
doc=open(r+"/shared/ground-rules.md").read()
keys=set()
for l in json.load(open(r+"/tests/fixtures/listings-sample.json"))["listings"]: keys|=set(l)
miss=[k for k in sorted(keys) if "\""+k+"\"" not in doc]
print("   missing:",miss) if miss else None
sys.exit(1 if miss else 0)
PY'
check "SKILL tablero documents both modes" 'grep -q "board-artifact.html" "$REPO/skills/tablero/SKILL.md" && grep -q "ArtifactData" "$REPO/skills/tablero/SKILL.md" && grep -q "File System Access" "$REPO/skills/tablero/SKILL.md"'
rm -rf "$TMP"

echo
[[ $fail -eq 0 ]] && echo "ALL PASSED" || echo "FAILURES"
exit $fail
