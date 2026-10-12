# Getting started (no technical experience needed)

[Español](GUIA-INICIO.md)

This takes about 10 minutes, including your first setup conversation.

## 1. Get Claude with Claude Code
1. Sign up at [claude.ai](https://claude.ai) and choose a paid plan that
   includes Claude Code (Pro is enough to start).
2. Download the **Claude desktop app** for Mac or Windows from
   [claude.com/download](https://claude.com/download) and sign in.
3. In the app, open the **Code** tab. That's Claude Code.
4. On Windows, also install [Git for Windows](https://git-scm.com/download/win)
   (click Next through the installer). Claude Code uses it to run small commands.

> Already use a terminal? Install Claude Code from
> [claude.com/claude-code](https://claude.com/claude-code) and run `claude`
> inside your folder. The steps below are the same.

## 2. Make your apartment-hunt folder
1. Create a new, empty folder, for example **Documents → Depa**.
2. In the Code tab, choose **that folder** as the folder to work in.

Why a separate folder: everything Depa writes (your criteria, the listings, your
contacts, your agenda) goes there, and only there.

## 3. Install Depa
Type this line in the chat box and press Enter:

```
/plugin marketplace add ScrumMastermx/depa-pa-la-banda
```

Then this one:

```
/plugin install depa@depa-pa-la-banda
```

Restart the session if Claude asks you to.

## 4. Your first conversation
Type:

```
/depa:setup
```

Claude asks you short questions: city, the place you want to be close to,
your **maximum total budget including maintenance fees**, bedrooms, pets, kids,
furnished or not, neighborhoods, dates and how you can guarantee the rent. Answer
what you know; "I don't know" is fine.

## 5. Find places and keep track
1. `/depa:buscar` finds new listings and tells you which ones look like scams.
2. `/depa:tablero` publishes your board as a private claude.ai page (or builds a local `board.html` if your Claude Code can't publish pages) and gives you the link.
3. `/depa:mensajes` writes the messages to agents. **You copy and send them yourself.**
4. `/depa:agenda` plans your visits; `/depa:requisitos` explains what agents will ask
   and what to check in person; `/depa:seguimiento` reminds you who hasn't answered.

## Moving cards on the board
**Shared board (default).** Drag a card to another column, use its "Move to..." menu, or open it to edit
notes. Everything saves to a shared database; Claude sees the same data. To add your partner, open the board on
claude.ai, click Share and invite them by email as **Editor** (or Contributor). Viewers and Commenters can look but not
edit. You can also just tell Claude ("move Blue Door to finalist").

**Local `board.html` (fallback).** In Chrome or Edge click **Connect folder**, choose your hunt folder, and
changes are written straight to `listings.json`. In other browsers changes stay in that browser; click **Export JSON**,
save the file in your folder and say "import the board".

## Optional: connect Chrome
Install the [Claude in Chrome](https://claude.com/chrome) extension and sign in.
Depa can then read listing portals in your own browser, page by page, like you
would. It stops if a site asks you to log in or prove you are human; you do that
yourself. It never presses Send for you.

## Safety in one minute
- Never pay a "reservation" before seeing the place and the contract.
- Never send your ID or bank data to someone who has not shown you the place.
- If something is pushed with urgency, slow down. Ask `/depa:requisitos`.
