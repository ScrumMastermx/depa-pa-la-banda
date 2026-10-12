---
name: tablero
description: Publish or refresh the kanban board. Default is a private claude.ai Artifact with a shared database that the user and their partner can both edit and that Claude reads and writes; fallback is a local board.html (connect-folder in Chrome/Edge, or localStorage plus Export/Import JSON). Also applies stage and note changes the user dictates or imports. Use when the user says "board", "kanban", "tablero", "show my listings", "muéstrame los depas", "update the board", "share the board with my partner".
---

# Depa — tablero (board)

Before anything else, read `${CLAUDE_PLUGIN_ROOT}/shared/ground-rules.md`
(the `shared/` folder two levels up from this skill's base directory), including
its section "Board modes". Follow it for the whole session.

There are two modes. Pick once, then keep using the same one:

| Mode | When | Source of truth | Template |
|---|---|---|---|
| **artifact** (default) | the `Artifact` tool is in your tool list | the artifact database, collection `depas` | `${CLAUDE_PLUGIN_ROOT}/skills/tablero/assets/board-artifact.html` |
| **local** | no `Artifact` tool, or the user prefers a file | `listings.json` | `${CLAUDE_PLUGIN_ROOT}/skills/tablero/assets/board-template.html` |

If `board-url.txt` exists in the hunt folder, the hunt is already in artifact mode:
go to section 2 (refresh), never create a second artifact.

## 0. Read the hunt
Read `criteria.yaml` (missing → `/depa:setup`) and `listings.json`. Build this
config object from `criteria.yaml` (omit keys you do not have):
`{"lang": language, "title": "Depa <City>", "city": city, "referenceLabel": reference_point.label,
"budgetMax": budget.max_total_monthly, "currency": budget.currency, "bedroomsMin": bedrooms_min,
"maxCommute": max_commute_min, "collection": "depas", "built": <now, ISO time>}`.
The title is a 2-4 word name, for example "Depa Monterrey", and it never changes
between republishes.

## 1. Artifact mode: first publish
1. Load the `artifact-capabilities` and `artifact-design` skills with the Skill tool
   and follow their page contract (no `<html>`/`<head>`/`<body>`, themed tokens,
   phone width, `capabilities`). Do not guess the `window.claude` API. The template
   already follows it; the skills give the current publish rules.
2. Read `board-artifact.html` from the plugin. Replace the single marker
   `/*__DEPA_CONFIG__*/{}` with the config JSON (escape `<` as `<`) and
   `__DEPA_TITLE__` with the title. Do not put listings in the page: they live in
   the database. Write the result to `board-artifact.html` in the hunt folder.
3. Publish it with the `Artifact` tool: `file_path` = that file,
   `capabilities: {"db": {}, "user": {}}`, `icon: "home"`, and a one-sentence
   `description` such as "Shared apartment-hunt board". Do not pass `url` the first time.
4. Save the returned URL: write it as one line to `board-url.txt`, and append to
   the hunt folder's `CLAUDE.md`: "The shared board is the artifact at <URL>
   (see board-url.txt). Update that URL; never create a second board. Stages and
   notes live in its database (collection depas)."
5. Seed the database with the `ArtifactData` tool (a separate tool; load it first if
   it is deferred). First `list` collection `depas` to see what exists. For every
   listing in `listings.json` that is not there, write one document with
   `set`, `collection: "depas"`, `doc_id` = the listing `id`, `data` = the listing
   plus `createdAt`, `updatedAt` (now) and `updatedBy: "claude"`. Use `batch`,
   at most 50 writes per batch. A doc id may only contain letters, digits and
   `_ - . ~ : @ +`; if an id has other characters, slugify it and update
   `listings.json` to the same id.
6. Verify once: `list` the collection and check the count equals the number of
   listings. Do not publish again to "test".
7. Give the user the link and say it plainly:
   - "Open it from claude.ai. Drag cards between stages, edit notes, discard: it all
     saves to the shared database, and I see the same data."
   - **To share with your partner:** open the artifact on claude.ai, use Share, and
     invite them by email as an **Editor** (or **Contributor** if the menu offers it).
     Viewers and Commenters can look but cannot move cards or save notes. Avoid
     turning on a public link if your partner is outside your organization: a person
     invited from outside only keeps edit rights while there is no public link.
   - "From now on, tell me in chat what changed or just use the board; either way
     we see the same list."

## 2. Artifact mode: every later run
1. **Refresh the mirror.** `list` collection `depas` with `out_dir` (a scratch
   folder, up to 1000 per page, follow `next_cursor`), read the files, and rewrite
   `listings.json` as `{"listings": [...]}` from the documents (drop nothing, keep
   every field). Tell the user in one line how many listings and which stages changed
   since last time.
2. **Push local-only listings.** Any listing in `listings.json` with no document
   (found offline or by hand) is written with `set` in a `batch` (≤50).
3. **Republish only if needed**: the template changed (plugin updated) or the
   criteria changed. Rebuild `board-artifact.html` as in 1.2 and call `Artifact`
   with `file_path` and `url` from `board-url.txt` (no `icon`; omit `capabilities`
   so the stored ones are kept). The database is untouched by a republish.
4. Open the link for the user (`Artifact` with `action: "open"`) only when asked.

## 3. Applying changes (artifact mode)
When the user says "move Blue Door to finalist" or "note: agent confirmed Saturday":
find the document by `nickname` (ambiguous → ask), `get` it for its `version`, then
`update` with `if_version`: `{"stage": ...}` and/or `notes` with a new line
`YYYY-MM-DD: text` appended to the existing notes, plus `updatedAt` and
`updatedBy: "claude"`. If the write is refused because the version moved, re-read
and redo it; the user or their partner edited meanwhile. Show a one-line summary.
`/depa:buscar` adds new listings as documents with stage `suggested` (batch).

## 4. Local mode
1. Read the template `board-template.html`. Replace `/*__DEPA_DATA__*/[]` with the
   JSON array stored under `listings` (escape `<` as `<`), `/*__DEPA_CONFIG__*/{}`
   with the config JSON, `__DEPA_LANG__` with `en` or `es` and `__DEPA_TITLE__` with
   the title. Write `board.html` in the hunt folder.
2. Before overwriting an existing `board.html`, ask whether the user has
   unexported changes (see below) and tell them to export first. Changes saved in
   the browser from before the rebuild are ignored by design: `listings.json` wins.
3. Tell the user to open `board.html` in the browser. Offer to open it only if
   Chrome is connected; never open it inside someone else's tab.
4. How changes are saved, in plain words:
   - **Chrome or Edge (best):** click **Connect folder** and pick the hunt folder
     (File System Access API). The board reads and writes `listings.json` directly,
     and re-reads it before each save so edits made by Claude in the meantime are
     not lost. The browser asks for permission each new session (**Reconnect folder**).
   - **Any browser:** changes are kept in that browser (localStorage) so a reload
     does not lose them. They do not reach the folder by themselves: click
     **Export JSON**, save it as `board-export.json` in the hunt folder and tell
     me; or just tell me in chat ("move Blue Door to finalist").
   - **Import JSON** loads an export (stage and notes by `id`; unknown ids are added).
5. Applying a `board-export.json` or dictated changes: update only `stage` and
   `notes` (and add unknown listings), match by `id`, never delete a listing, show a
   one-line summary, then rebuild `board.html`. Unknown id or ambiguous nickname → ask.
   A listing moved to *discarded* keeps its record forever so it is never suggested again.

## 5. What the board shows
Eight columns: suggested · to review · contacted · visit scheduled · visited ·
finalist · "peor es abajo de un puente" (last resort) · discarded, labelled in the
hunt language. Cards show the photo, nickname, total rent (rent + maintenance),
bedrooms, commute minutes (colored against `max_commute_min`), scam flags, the latest
note and a link to the listing. Search ignores accents and case; sort by newest
(default), shortest commute or lowest price; "only those that fit" hides listings over
budget or under the bedroom minimum. A side sheet edits the fields and adds dated
notes; a viewer without edit rights sees the board read-only.

## 6. Stage ids
`suggested`, `to_review`, `contacted`, `visit_scheduled`, `visited`,
`finalist`, `last_resort`, `discarded`. Use exactly these in documents and in the JSON.
