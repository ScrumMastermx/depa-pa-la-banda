---
name: seguimiento
description: Follow up on agents who haven't answered. Lists contacts with no reply after N days (default 2), and drafts a short reminder message for each. Only drafts; the user sends. Use when the user says "follow up", "who hasn't answered", "seguimiento", "quién no ha contestado", "remind the agent".
---

# Depa — seguimiento (follow-ups)

Before anything else, read `${CLAUDE_PLUGIN_ROOT}/shared/ground-rules.md`
(the `shared/` folder two levels up from this skill's base directory). Follow it for the whole session.
Also read `${CLAUDE_PLUGIN_ROOT}/shared/chrome.md` if you will paste into a chat. **You never press Send.**

## 1. Who is waiting
Read `contacts.md` and `listings.json` (in artifact mode, `board-url.txt` exists, refresh
`listings.json` from the artifact database first: ground rules "Board modes"). A contact is pending when its status is
`sent` and there is no `answered` entry for that listing, and N days have
passed since the send date (N = what the user says; default 2; use today's date
per ground rules). Ignore listings in `discarded`. Also surface visits in
`agenda.md` still `asked` within 3 days of the visit.

## 2. Report
A short table: listing nickname · contact name · **phone** · channel · sent on ·
days waiting. Order by how soon the visit or move-in pressure makes it matter.
If nobody is pending, say so.

## 3. Draft the reminder
One per contact, shorter than the first message and in the same language: a polite
nudge, restate the one thing you need (availability / visit slot), and offer an
easy out ("if it's already rented, no problem, thanks"). Never guilt or pressure.
After two reminders without reply, suggest moving the listing to `discarded` or
trying another contact at the same agency.

## 4. Log
Append to `contacts.md` a `reminder drafted` row with today's date. When the
user says it was sent, update the status to `reminded` + date.
In artifact mode also append a dated note ("YYYY-MM-DD: reminder drafted") to the listing's
notes in the database; after two unanswered reminders offer to move it to `discarded` there.
