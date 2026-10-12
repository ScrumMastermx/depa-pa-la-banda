---
name: requisitos
description: Explain rental requirements and negotiation in plain language, with checklists. Guarantor vs legal policy vs extra deposit vs promissory notes, documents to prepare, contract red flags, pet deposits, what to inspect on a visit, and when NOT to pay or sign. Use when the user says "requirements", "what do I need to rent", "requisitos", "aval", "póliza jurídica", "contract", "contrato", "what to check on the visit".
---

# Depa — requisitos (requirements and negotiation)

Before anything else, read `${CLAUDE_PLUGIN_ROOT}/shared/ground-rules.md`
(the `shared/` folder two levels up from this skill's base directory). Follow it for the whole session.

This is education, not legal advice. Say once, at the end, that local rules
differ and that a local lawyer, tenant association or consumer authority can
confirm. Adapt every item to the user's country and city (ask if unknown); the
terms below are common in Mexico and Latin America, so explain the local
equivalent when it differs. Never invent a legal rule: if unsure, say so.

## 1. Pick what the user needs
Answer the question they asked; offer the rest. Read `criteria.yaml` for their
guarantee options, pets and move-in date so the advice is theirs.

## 2. Guarantee options (explain, then compare for THEIR case)
- **Guarantor** (*aval / fiador / obligado solidario*): a person, often required
  to own property in the same city, who answers for the rent if the tenant
  doesn't pay. Heavy for the guarantor; many people cannot offer one in a new city.
- **Legal policy** (*póliza jurídica*): a company vets the tenant and backs the
  landlord, for a fee (often a fraction of one month's rent up to about a month;
  say "ask for the current price"). Check who pays, what it covers, whether the
  company is real and whether the landlord accepts it.
- **Extra deposit**: more months upfront instead of a guarantor. Ask how many,
  where it is held, and the conditions for getting it back.
- **Promissory notes** (*pagarés*): signed IOUs some landlords ask for. Flag
  them: they can be enforced separately from the contract. Ask the user not to
  sign any until a lawyer reviewed them.
- Compare briefly: cost, speed, risk, what the landlord usually accepts. One
  recommendation for the user's situation.

## 3. Documents (prepare, share only when ready)
Typical: ID, proof of income (payslips or bank statements), employment letter,
references, sometimes tax ID. Rules: share **after** a visit and a serious
interest, only with a named agent/owner, redact what is not needed (account
numbers, other people's data), mark copies "for rental application only, date".
Never send documents to someone who only wants them before showing the place.

## 4. Contract red flags
Check, line by line, and ask for a copy BEFORE the day of signing:
- Names, ID numbers and address match the owner and the property; ask for proof
  of ownership or authorization to rent.
- Rent, maintenance, deposit, increases (how and when), contract length, renewal.
- Penalties for leaving early; who pays repairs; who pays the legal policy.
- Clauses allowing entry without notice, forfeiting the whole deposit, or
  unlimited rent increases.
- Inventory of furniture/appliances annexed and signed; condition photos dated.
- Receipts: you receive a receipt for every payment, with date and amount.

## 5. Pets, kids, furnished
Pet deposit or fee: ask whether it is refundable, per pet or total, and the building
rules (size, breed, common areas). Get the pet approval in writing. Kids: window
guards, balcony height, pool, elevator, neighbors' noise tolerance.

## 6. Inspection checklist for a visit
Water pressure (hot and cold, at the same time), drains, leaks and damp stains,
smell; noise at that hour (street, neighbors, bars, building works); natural
light and which way windows face; phone signal and internet options; elevator
works and stairs; parking access (size of the spot, ramp, gate, visitors); lock
and door quality; electrical outlets and breaker; gas; appliances really work
(run the washer, open the fridge); closets; security (doorman, cameras,
lighting at night); building condition and common areas; the street at night
if you can. Take dated photos and videos.

## 7. Negotiation
Ask: price, deposit months, who pays maintenance, the move-in date, a longer
contract in exchange for a lower rent, repairs before move-in in writing. Use
comparable listings from `listings.json` as evidence. Never negotiate by
sharing the user's maximum budget.

## 8. Don't sign or pay until you're ready
- Do not pay a "reservation", "booking" or deposit before you have seen the
  place, seen the contract and verified the owner or agency exists.
- Never transfer money to a personal account you cannot match to the owner on
  the contract. Prefer methods with a receipt.
- If anyone pushes ("other people are coming tonight"), that is pressure, not a
  reason. It is fine to walk away. Offer the user a one-line reply to buy time:
  "Thanks, I'll review the contract and confirm tomorrow."
