# Changelog

## 0.2.0
- `/depa:tablero` now defaults to a **shared board**: a private claude.ai Artifact page with the `db` and `user`
  capabilities. Every listing is a document in the `depas` collection (same fields as `listings.json` plus
  `createdAt`, `updatedAt`, `updatedBy`). You and your partner move cards, edit notes and discard; Claude reads and
  writes the same rows with `ArtifactData`. The URL is kept in `board-url.txt` and the hunt `CLAUDE.md`.
- `/depa:buscar` uploads new finds as `suggested`; `/depa:mensajes`, `/depa:agenda` and `/depa:seguimiento` read stages
  and notes from the board and append dated notes. `listings.json` is a local mirror refreshed on every run.
- Local fallback upgraded: `board.html` can **Connect folder** (File System Access API, Chrome/Edge) to read and write
  `listings.json`, otherwise keeps changes in localStorage and offers Export/Import JSON.
- New board features: sort by newest / shortest commute / lowest price, "only those that fit", edit sheet, dated notes.
- Tests: DOM-shim behavior tests for both templates (`tests/board-test.js`) wired into `tests/run-smoke.sh`.

## 0.1.0
- First release.
