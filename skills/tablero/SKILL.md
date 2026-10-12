---
name: tablero
description: Generate or refresh board.html, a single self-contained local kanban board built from listings.json, with stages from suggested to finalist, accent-insensitive search, sorting and JSON export/import. Also applies stage changes the user dictates or imports. Use when the user says "board", "kanban", "tablero", "show my listings", "muéstrame los depas", "update the board".
---

# Depa — tablero (board)

Before anything else, read `${CLAUDE_PLUGIN_ROOT}/shared/ground-rules.md`
(the `shared/` folder two levels up from this skill's base directory). Follow it for the whole session.

## 1. Build or refresh
1. Read `listings.json` (missing → `/depa:setup`).
2. Read the template `${CLAUDE_PLUGIN_ROOT}/skills/tablero/assets/board-template.html`.
3. Replace the single marker `/*__DEPA_DATA__*/[]` with the JSON array stored
   under `listings` (valid JSON, escape `</script>` as `<\/script>`), and the
   marker `__DEPA_LANG__` with `en` or `es` from `criteria.yaml`.
4. Write the result to `board.html` in the hunt folder. Do not change anything
   else in the template.
5. Tell the user to open `board.html` in their browser (double-click, or
   "File → Open"). Offer to open it for them only if Chrome is connected; never
   open it inside someone else's tab.

## 2. What the board does
Eight columns: suggested · to review · contacted · visit scheduled · visited ·
finalist · "peor es abajo de un puente" (last resort) · discarded. Cards show the
photo (from the listing's photo URL), nickname, rent + maintenance (and total
when known), bedrooms, approx. commute, flags, notes and a link to the listing.
Search ignores accents and case. Sort by newest (default), price or distance.

## 3. Saving stage changes
A web page cannot write to disk. So the board keeps changes in the browser and
offers two ways to make them permanent. Say this to the user plainly:
- **Easiest:** tell me in chat ("move Blue Door to finalist, discard Roof
  Garden") and I update `listings.json` and rebuild the board.
- **Or:** click **Export JSON** on the board, save the file into the hunt folder
  (as `board-export.json`), and tell me. I merge it into `listings.json`
  (stage and notes only; I never delete listings) and rebuild.
**Import JSON** on the board loads a previous export, for example after a rebuild.

## 4. Applying changes
When the user dictates changes or points to `board-export.json`: update only
`stage` and `notes`, match by `id`, show a one-line summary of what moved, then
rebuild `board.html`. Unknown id or ambiguous nickname → ask. A listing moved to
*discarded* keeps its record forever so it is never suggested again.

## 5. Stage ids
`suggested`, `to_review`, `contacted`, `visit_scheduled`, `visited`,
`finalist`, `last_resort`, `discarded`. Use exactly these in the JSON.
