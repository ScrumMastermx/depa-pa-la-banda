---
name: mensajes
description: Draft WhatsApp or email messages to rental agents or owners that ask the missing questions (pets, kids, furnished details, parking, maintenance included, guarantee requirements, move-in date, visit slot). Only drafts; the user sends. Logs every draft in contacts.md. Use when the user says "message", "write to the agent", "draft", "mensaje", "escríbele al agente", "preguntas para el agente", "contact".
---

# Depa — mensajes (messages)

Before anything else, read `${CLAUDE_PLUGIN_ROOT}/shared/ground-rules.md`
(the `shared/` folder two levels up from this skill's base directory). Follow it for the whole session.
Also read `${CLAUDE_PLUGIN_ROOT}/shared/chrome.md`. **You never press Send.**

## 1. Pick the listings
Use the listings the user names, else all in stage `to_review`; if there are none,
offer the `suggested` ones and ask which. Read `criteria.yaml`,
`listings.json` and `contacts.md` (skip anyone already messaged unless asked;
that is `/depa:seguimiento`).

## 2. Work out the missing questions
For each listing, ask only what is still `?` or unclear, from this list:
- Is it still available? Can I visit on <slot from the visit trip / agenda>?
- Is maintenance (*mantenimiento*) included in the rent, and how much is it?
  Anything else monthly (water, gas, internet, parking)?
- Pets: allowed for <type, size>? Extra deposit or monthly fee?
- Kids: any building rule or restriction? (only if relevant)
- Furnished: what exactly is included? Washer, fridge, stove, water heater,
  closets, beds, curtains, A/C? In what condition?
- Parking: included? How many spots? Covered? Visitors?
- Guarantee: what do they require (guarantor, legal policy, extra deposit)?
  Do they accept the options in `guarantee_options`? Who pays the policy?
- Move-in: is <date> possible? Minimum contract length?
- Deposit: how many months, and when is it paid (never "before visiting")?
Never ask for or offer money, ID or financial data in the first message
(ground rule 1).

## 3. Write the draft
- Language: the listing's (usually local). If unsure, ask the user. Add a
  translation for the user below the draft when it differs from the chat language.
- Short: greeting, who they are in one line (no employer, no surname unless the
  user wants), the listing reference (title or link), at most 6 questions, one per
  line, then the visit request. WhatsApp: no long paragraphs, no emoji.
- Tone: polite, direct, adult. Example (WhatsApp, Spanish):

  > Hola, buenas tardes. Vi el depa de 2 recámaras en <colonia> (<link>). ¿Sigue disponible?
  > Tengo unas preguntas:
  > 1. ¿El mantenimiento está incluido en la renta? ¿De cuánto es?
  > 2. ¿Aceptan <mascota: p. ej. un gato / un perro pequeño>?
  > 3. ¿Qué incluye el amueblado (lavadora, refrigerador, estufa)?
  > 4. ¿Qué requisitos piden para el contrato (aval, póliza jurídica, depósito)?
  > ¿Podría verlo el <día> a las <hora>? Gracias.

If the listing shows no contact name or phone (common: the portal hides it
behind its own chat/form), draft the text for the portal's message box, write
`phone: ?` and tell the user to open the listing link and paste it there.

## 4. Deliver
- Show each draft with the contact name AND phone (ground rule 6) and say
  "Copy this and send it from your own phone/email." One draft per listing.
- With Chrome connected and the user asking for it: open the chat in a new tab,
  paste the draft into the message box, then STOP and say "Draft is pasted; read
  it and press send yourself." Do not click Send, do not press Enter in the box.
  If a login or verification appears, stop and tell the user.

## 5. Log
Append to `contacts.md`: date (today), listing nickname, contact name, phone,
channel, "asked: pets, maintenance, ...", status `drafted`. When the user later
says they sent it, set `sent` + date; when they paste a reply, set `answered`,
copy the facts into `listings.json` (replace `?`; mark source "agent reply
YYYY-MM-DD") and move the listing to `contacted`.
