# Depa pa la Banda

**English** · [Español](#español)

> **About the name:** in Mexican Spanish, *depa* is short for *departamento*, an
> apartment, and *la banda* means "the crew, your people". *Depa pa la banda* is
> roughly **"apartments for the crew"**. It is a free kit for anyone who has to
> find a place to live, in any city, and wants a calm, organized, scam-aware way
> to do it.

A free apartment-hunt kit that runs inside [Claude Code](https://claude.com/claude-code).
It works for any city or country (Mexico City, Madrid, Bogotá, Lisbon, Austin...)
in **English and Spanish**.

| Command | What it does |
|---|---|
| `/depa:setup` | Interviews you (city, budget including maintenance fees, bedrooms, pets, kids, furnished or not, neighborhoods, dates, guarantee options) and builds your private hunt folder. Start here. |
| `/depa:buscar` | Finds new listings: web search and, with Chrome connected, your own browser reading portals page by page like a person, newest first. Filters by your criteria, skips reposts, flags likely scams, estimates the commute and gives each place a nickname. |
| `/depa:tablero` | Builds `board.html`, a local kanban board: suggested, to review, contacted, visit scheduled, visited, finalist, last resort, discarded. Search, sort, export/import. |
| `/depa:mensajes` | Drafts WhatsApp or email messages to agents with the questions you still need answered. **It only drafts; you press send.** |
| `/depa:agenda` | Plans your visit trip: grouped by area, realistic travel times, buffers, blocked times (lunch, nap), confirmation status, optional map. |
| `/depa:requisitos` | Plain-language guide to guarantor vs legal policy vs extra deposit, documents, contract red flags, pet deposits, a visit inspection checklist and "don't pay or sign yet" advice. |
| `/depa:seguimiento` | Who hasn't answered in a few days, plus a polite reminder draft for each. |

## What you need
- A paid Claude plan that includes Claude Code (Pro, Max, Team or Enterprise).
- The **Claude desktop app** (Mac or Windows) or Claude Code in a terminal.
  It does **not** work on claude.ai in the browser (web sessions can't install plugins).
- Nothing else: no API keys, no coding.
- **Optional:** the [Claude in Chrome](https://claude.com/chrome) extension. With it,
  Depa can read listing portals in your own browser, the way you would.

## Install (2 minutes)
**Not technical? Follow the step-by-step guide: [docs/GETTING-STARTED.md](docs/GETTING-STARTED.md).**

Create an empty folder (for example `Documents/Depa`), open it in Claude Code and
type these two lines in the chat box, one at a time:

```
/plugin marketplace add OWNER/depa-pa-la-banda
/plugin install depa@depa-pa-la-banda
```

Then type:

```
/depa:setup
```

## Your data stays yours
- Your criteria, budget, listings, contacts and agenda are saved **only in the folder
  you chose, on your computer**. Nothing is uploaded to this project.
- Like anything you do in Claude Code, your conversation is processed by Claude.
  See Anthropic's privacy policy if you have questions about that.
- Web searches send search terms (city, neighborhood, bedrooms), never your name,
  employer, phone or the exact address of your office or school.
- Don't run Depa inside a copy of this repository. Use your own folder.

## What it never does
- **Never sends a message, submits a form, pays or signs.** It drafts; you act.
  With Chrome it may paste a draft into a chat box and stop.
- Never shares your ID, payslips or bank data with anyone.
- Never invents a listing fact: unknown is written as `?` and becomes a question for the agent.
- No scrapers and no bypassing of CAPTCHAs or bot protection. If a site shows a
  challenge, Depa stops and tells you.

## Honest limits
- **Search sees part of the market.** Many portals load with JavaScript or ask you to
  log in; Depa tells you which ones to open yourself.
- Scam flags are warnings, not proof. Distances and times are approximations.
- It is a helper, not a lawyer, notary or real-estate agent. Confirm contract and
  legal questions locally.

## Credits
Built on Claude Code by Anthropic and modeled on its sibling plugin
*Chambas pa la Banda*. Full details: [CREDITS.md](CREDITS.md). Not affiliated with Anthropic.

## License
MIT, see [LICENSE](LICENSE). Use it, share it, improve it.

## Contributing
Found a bug, or a rental trick for your city that would have helped you? Open an
issue. Suggestions in Spanish are welcome.

**Tests** (offline, no login needed): `tests/run-smoke.sh` validates the manifests,
every skill's frontmatter, relative links, the fictional fixtures and the board template.

---

## Español

> **Sobre el nombre:** *depa* es "departamento" y *la banda* es la raza, tu gente.
> *Depa pa la banda*: departamentos para la raza. Un kit gratuito para quien tiene
> que encontrar dónde vivir, en cualquier ciudad, de forma tranquila, ordenada y
> sin caer en fraudes.

Un kit gratuito para buscar depa que corre dentro de
[Claude Code](https://claude.com/claude-code). Sirve para cualquier ciudad o país,
en **español e inglés**.

| Comando | Qué hace |
|---|---|
| `/depa:setup` | Te entrevista (ciudad, presupuesto con mantenimiento incluido, recámaras, mascotas, hijos, amueblado o no, colonias, fechas, tipo de garantía) y arma tu carpeta privada. Empieza aquí. |
| `/depa:buscar` | Busca anuncios nuevos: búsqueda web y, con Chrome conectado, tu propio navegador leyendo portales página por página como lo harías tú, de lo más nuevo a lo más viejo. Filtra por tus criterios, descarta repetidos, avisa de posibles fraudes, estima el trayecto y le pone un apodo a cada depa. |
| `/depa:tablero` | Crea `board.html`, un tablero kanban local: sugeridos, por revisar, contactados, visita agendada, visitados, finalistas, "peor es abajo de un puente" y descartados. Búsqueda, orden, exportar/importar. |
| `/depa:mensajes` | Redacta mensajes de WhatsApp o correo para los agentes con las preguntas que te faltan. **Solo redacta; tú das enviar.** |
| `/depa:agenda` | Planea tu viaje de visitas: agrupadas por zona, tiempos de traslado realistas, colchones de tiempo, bloques (comida, siesta), estatus de confirmación y mapa opcional. |
| `/depa:requisitos` | Guía en lenguaje claro: aval vs póliza jurídica vs depósito extra, documentos, banderas rojas del contrato, depósito por mascota, lista para revisar el depa en la visita y "no pagues ni firmes todavía". |
| `/depa:seguimiento` | Quién no ha contestado en unos días y un recordatorio amable para cada uno. |

## Qué necesitas
- Un plan de pago de Claude que incluya Claude Code (Pro, Max, Team o Enterprise).
- La **app de escritorio de Claude** (Mac o Windows) o Claude Code en terminal.
  **No** funciona en claude.ai desde el navegador (ahí no se pueden instalar plugins).
- Nada más: ni API keys, ni programar.
- **Opcional:** la extensión [Claude in Chrome](https://claude.com/chrome). Con ella,
  Depa puede leer portales de anuncios en tu propio navegador, como lo harías tú.

## Instalación (2 minutos)
**¿No eres técnico? Sigue la guía paso a paso: [docs/GUIA-INICIO.md](docs/GUIA-INICIO.md).**

Crea una carpeta vacía (por ejemplo `Documentos/Depa`), ábrela en Claude Code y
escribe estas dos líneas en el chat, una por una:

```
/plugin marketplace add OWNER/depa-pa-la-banda
/plugin install depa@depa-pa-la-banda
```

Luego escribe:

```
/depa:setup
```

## Tus datos son tuyos
- Tus criterios, presupuesto, anuncios, contactos y agenda se guardan **solo en la
  carpeta que elegiste, en tu computadora**. Nada se sube a este proyecto.
- Como todo lo que haces en Claude Code, tu conversación la procesa Claude.
  Revisa la política de privacidad de Anthropic si tienes dudas.
- Las búsquedas web envían términos de búsqueda (ciudad, colonia, recámaras), nunca
  tu nombre, tu empleador, tu teléfono ni la dirección exacta de tu oficina o escuela.
- No uses Depa dentro de una copia de este repositorio. Usa tu propia carpeta.

## Lo que nunca hace
- **Nunca envía un mensaje, manda un formulario, paga ni firma.** Redacta; tú actúas.
  Con Chrome puede pegar el borrador en el chat y se detiene.
- Nunca comparte tu identificación, recibos de nómina ni datos bancarios con nadie.
- Nunca inventa datos de un anuncio: lo que no sabe se escribe `?` y se vuelve una
  pregunta para el agente.
- Nada de scrapers ni saltarse CAPTCHAs o protecciones anti-bots. Si un sitio muestra
  un reto, Depa se detiene y te avisa.

## Límites honestos
- **La búsqueda ve una parte del mercado.** Muchos portales cargan con JavaScript o
  piden iniciar sesión; Depa te dice cuáles abrir tú.
- Las alertas de fraude son avisos, no pruebas. Distancias y tiempos son aproximados.
- Es una ayuda, no un abogado, notario ni asesor inmobiliario. Confirma lo legal y el
  contrato con un profesional local.

## Créditos
Hecho sobre Claude Code de Anthropic y modelado según su plugin hermano *Chambas pa
la Banda*. Detalle: [CREDITS.md](CREDITS.md). No está afiliado a Anthropic.

## Licencia
MIT, ver [LICENSE](LICENSE). Úsalo, compártelo, mejóralo.
