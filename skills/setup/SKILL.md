---
name: setup
description: First-time setup for Depa pa la Banda. Interviews the user (English or Spanish) about their apartment search and creates a private hunt folder with criteria.yaml, listings.json, contacts.md and agenda.md. Use when the user says "setup", "start", "empezar", "configurar", "I need an apartment", "busco depa", "busco departamento", or when any other Depa skill finds no criteria.yaml.
---

# Depa — setup

Before anything else, read `${CLAUDE_PLUGIN_ROOT}/shared/ground-rules.md`
(the `shared/` folder two levels up from this skill's base directory). Follow it for the whole session.

## Goal
Leave the user with a working folder in the current directory:
`criteria.yaml`, `listings.json` (empty), `contacts.md`, `agenda.md`, and a
short `CLAUDE.md` that says "this is a Depa hunt folder; use /depa:* skills and
follow the ground rules". Then tell them what to do next.

The user may not be technical. Ask one thing at a time, in plain words. Never
show a wall of questions; group them in 3-4 short rounds.

## Step 0 — Language and folder
1. Greet in BOTH languages, one line each, ask which they prefer:
   "Hi! I'll help you find an apartment. English or Spanish?" /
   "¡Hola! Te ayudo a encontrar depa. ¿Inglés o español?" Use only that language after.
2. Check the current working directory:
   - If `criteria.yaml` exists: setup was done before. Ask whether to update it
     or start over. Never overwrite without a yes.
   - If the folder looks like a code project or has unrelated files (`package.json`,
     `.git`, `src/`), warn them: this kit works best in its own empty folder
     (for example "Depa" in Documents). Stop and let them do it.
   - Otherwise continue here.

## Step 1 — The interview (rounds)
Round 1, where and how much:
- City (and country), and a reference point they want to be close to: office,
  school, a family member. Ask for the address or the nearest landmark. Store it
  only in `criteria.yaml`; never in web searches (ground rule 4).
- Maximum **total** monthly budget, INCLUDING maintenance/HOA fees (in Mexico:
  *mantenimiento*), and the currency. Ask whether utilities (water, electricity,
  internet, gas) are inside that number or on top.
- Bedrooms (minimum, and whether more is a bonus).

Round 2, who is moving in:
- Parking: needed yes/no, how many cars.
- Pets: type, size, how many ("one small dog"). Many buildings refuse or charge extra.
- Kids: how many and ages (affects floors, safety, schools, nap times for visits).
- Furnished: `yes` / `semi` (appliances only) / `either` / `unfurnished_if_cheap`.
  For the last one, ask: "unfurnished is ok only if it is cheaper AND it comes with
  these appliances:" and collect the list (e.g. fridge, stove, washer). Save it as
  `required_appliances`.

Round 3, where:
- Neighborhoods they like (`accepted`), and ones to avoid (`excluded`) with a
  one-line reason each if they have it. It's fine to be empty: offer to research
  neighborhoods later.
- Acceptable commute to the reference point (max minutes, and by what: walk,
  transit, car).

Round 4, when and how:
- Move-in date (exact or "between X and Y").
- Visit trip dates, if they live elsewhere and will travel to visit (arrival,
  departure, hours they are free each day). Skip if they live there already.
- Guarantee options they can offer: a **guarantor** (*aval/fiador*, usually a
  property owner in that city), a **legal policy** (*póliza jurídica*, paid to a
  company), an **extra deposit**, or none. Explain each in one line; the details
  live in `/depa:requisitos`. Do not push them to pick.

## Step 2 — Write the files
Today's date per ground rules. `criteria.yaml`:

```yaml
language: en            # en | es
created: YYYY-MM-DD
city: ""
country: ""
reference_point:
  label: ""             # "office", "school"...
  address: ""
max_commute_min: 0
commute_mode: transit   # walk | transit | car
budget:
  currency: ""
  max_total_monthly: 0  # rent + maintenance
  includes_utilities: false
bedrooms_min: 0
parking: { needed: false, spots: 0 }
pets: []                # - { type: dog, size: small, count: 1 }
kids: []                # - { age: 3 }
furnished: either       # yes | semi | either | unfurnished_if_cheap
required_appliances: [] # used when furnished != yes
neighborhoods:
  accepted: []
  excluded: []          # - { name: "", reason: "" }
move_in: ""
visit_trip: { arrive: "", depart: "", free_hours: "", blocked: [] }
guarantee_options: []   # guarantor | legal_policy | extra_deposit
notes: ""
```

`listings.json`: `{ "listings": [] }`.
`contacts.md`: heading plus a table `| Date | Listing | Contact | Phone | Channel | What | Status |`.
`agenda.md`: heading plus "No visits planned yet".

## Step 3 — Close
Show a 6-line summary of the criteria and ask "Anything wrong or missing?". Fix
it. Then say the next step: `/depa:buscar` to find the first listings. Mention
once that connecting Claude in Chrome lets Depa browse portals the way they would
(see the README) and that it is optional.
