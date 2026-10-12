---
name: buscar
description: Find new apartment listings that match criteria.yaml using web search and, if Claude in Chrome is connected, the user's own browser reading portals page by page like a person, newest first. Applies hard filters, dedupes against listings.json, flags likely scams, estimates distance to the reference point, gives each listing a nickname and saves it as suggested. Use when the user says "find", "search", "buscar", "busca depas", "new listings", "hay algo nuevo".
---

# Depa — buscar (find)

Before anything else, read `${CLAUDE_PLUGIN_ROOT}/shared/ground-rules.md`
(the `shared/` folder two levels up from this skill's base directory). Follow it for the whole session.
Also read `${CLAUDE_PLUGIN_ROOT}/shared/chrome.md`. Its limits are absolute:
**no scrapers, no bypassing bot protection, stop at any challenge.**

## 1. Load context
Read `criteria.yaml` (missing → `/depa:setup`) and `listings.json`. Tell the user
in one line what you will search for (city, budget, bedrooms, key constraints)
and that it takes a few minutes. If they gave a portal, start there.

## 2. Find sources
- Web search for the city's main rental portals and classified sites (search
  terms per ground rule 4: city, neighborhood, bedrooms, "pets allowed",
  "for rent" / "renta"). Use the portals the user names first. Do not invent a
  portal list from memory; confirm each one loads.
- Search each accepted neighborhood separately when the list is short.
- With Chrome connected: open each portal in a NEW tab, set the filters the
  portal offers (rent, bedrooms, neighborhood), **sort by newest**, and read the
  result pages one by one (default 3 pages per portal). Same rules as a person
  browsing: pauses between pages, no rapid reloads.
- If a site shows a CAPTCHA, login wall, "unusual traffic" or any challenge:
  stop on that site, tell the user (site name + what you saw) and move on. Never
  attempt to solve or bypass it.
- Without Chrome: WebSearch/WebFetch only. Many portals load by JavaScript and
  won't read; say which ones and give the user the link to open themselves.

## 3. Hard filters (drop silently, count them)
Drop a listing when it breaks any of: total monthly over budget (rent +
maintenance; if maintenance is unknown keep it but mark `maintenance: ?` and
`total: ?`), fewer bedrooms than the minimum, neighborhood in `excluded`, pets
explicitly forbidden when the user has pets, no parking when parking is
needed, furnished status incompatible with `furnished` (for
`unfurnished_if_cheap`: allow unfurnished only if it lists the required
appliances AND is cheaper than the furnished median you have seen). Unknown
(`?`) is not a violation: keep and ask later via `/depa:mensajes`.
Report the count dropped and the top reason, e.g. "Dropped 14: 9 over budget, 3 excluded area, 2 no pets."

## 4. Dedupe
Against every listing already in `listings.json`, any stage, discarded included.
It is a repost when it shares ANY of: the same street address (normalize
accents, "Av."/"Avenida", numbers), the same photos, the same agency AND the
same price and size. Reposts are not added. If the repost changed the price,
add a note to the existing listing ("price now X, was Y on date").

## 5. Scam check
Add a short reason to `scam_flags` and tell the user, for any of:
- price far below what comparable listings in that area show (say the
  comparison, e.g. "about half of the other 2-bedrooms in this area");
- "direct deal / brand new / owner abroad" language with an absurd price;
- pressure to pay a deposit, "reservation" or "booking" fee before a visit,
  or asking for ID photos or money by transfer, gift card or crypto first;
- the owner can't show the place in person, or only talks off-platform;
- photos that look like stock images or appear on other listings with other addresses.
A flag is a warning, not proof. Never call someone a scammer; say "looks like a
scam pattern because ...". Keep flagged listings but put them at the bottom.

## 6. Distance
For each kept listing estimate distance and time to `reference_point` using the
user's `commute_mode`. Say "approx." and how (straight line, or a route you
read in maps). If you can't estimate, write `?`. Drop listings clearly over
`max_commute_min` only when your estimate is solid; otherwise keep and mark it.

## 7. Nickname, save, report
- Give each new listing a short memorable nickname that is NOT a real name
  (e.g. "Blue Door", "Roof Garden", "Corner Bakery") from a distinctive trait of
  the listing; unique within `listings.json`.
- Append to `listings.json` (shape in ground rules) with `stage: "suggested"`,
  `found_on` today, and `?` for every unknown. Keep the source URL.
- Report: how many new, how many dropped (with reasons), then the new ones as a
  short list: nickname · neighborhood · rent + maintenance · bedrooms · approx.
  commute · flags. Include agent phone if the listing shows one.
- Finish with: "Run `/depa:tablero` to see them on your board, or tell me which
  ones to move to *to review* or *discarded*."
