---
name: agenda
description: Build a visit itinerary for the user's trip dates. Groups listings by area, estimates realistic travel times, adds buffers and blocked times (lunch, kid nap), tracks confirmation status per visit, writes agenda.md and optionally a simple map.html with OpenStreetMap tiles. Use when the user says "agenda", "itinerary", "plan the visits", "organiza las visitas", "ruta de visitas".
---

# Depa — agenda (visit itinerary)

Before anything else, read `${CLAUDE_PLUGIN_ROOT}/shared/ground-rules.md`
(the `shared/` folder two levels up from this skill's base directory). Follow it for the whole session.

## 1. Inputs
Read `criteria.yaml` (`visit_trip`, kids, commute mode), `listings.json` and
`contacts.md`. Candidates: listings in `visit_scheduled`, `contacted` or
`to_review` that the user wants to see. Ask which, in one message, if unclear.
If trip dates or free hours are missing, ask. Blocked times (lunch, a child's
nap, a meeting) go in as fixed blocks; ask for them if `blocked` is empty and the
user has kids.

## 2. Plan
- Group by area so the user does not cross the city back and forth. One area per
  half-day when possible.
- Order inside an area by confirmed slots first (fixed), then by the shortest
  path. Never move a confirmed slot; propose changes only for unconfirmed ones.
- Travel times: realistic and labelled "approx.". Use the user's way of moving
  (transit, car, walking) and assume city traffic at the hour of the visit. When
  unsure add margin rather than squeeze.
- Buffers: 15 min per visit start, 30-45 min per visit (60 for finalists worth a
  careful look, see `/depa:requisitos` inspection list), plus the travel time.
  Add a margin before any blocked time.
- Leave a gap day or slack hour for the unexpected. Do not fill every minute.
- A visit with status `asked` or `unconfirmed` is marked clearly; list who must
  confirm and the agent's phone.
- Safety: remind the user to share the address with someone they trust and, for
  first visits, prefer daytime.

## 3. Write agenda.md
By day: date · time · listing nickname · address · contact name + phone ·
status (`confirmed` | `asked` | `to ask`) · approx. travel from the previous stop ·
what to check (top 3 open questions from `listings.json`). End with a "To confirm
today" list and a "Backup if someone cancels" list. Translate headings to the
user's language.

## 4. Optional map
Offer a map. If yes, write `map.html`: a single file using Leaflet from a CDN
(`https://unpkg.com/leaflet@1.9.4/dist/leaflet.js` and its CSS) and
OpenStreetMap tiles with the required attribution ("© OpenStreetMap
contributors"). One marker per visit with nickname, time and address, numbered by
visit order, colored per day. Coordinates only from the listing or from a place
the user confirmed; if unknown, skip the pin and list it under the map as "no
coordinates". Do not call geocoding services in bulk (OSM's public services
forbid it); ask the user for a few coordinates, or look up single places by hand.
Tell the user the map needs an internet connection.

## 5. After
Offer to draft confirmation messages for `asked` visits via `/depa:mensajes`, and
to update listing stages to `visit_scheduled` for confirmed ones.
