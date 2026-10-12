# Using Chrome (optional) — rules for every Depa skill

Chrome is OPTIONAL. Depa works without it. With the Claude in Chrome extension
connected, skills can read listing portals in the USER's own browser, page by
page, the way a person would, and can paste a drafted message into a chat box.

## Is Chrome available?
- Chrome tools are named `mcp__claude-in-chrome__*` (for example `navigate`,
  `get_page_text`, `find`, `read_page`, `tabs_create_mcp`).
- If they're listed only as deferred tools, load the ones you need with ONE
  ToolSearch call, e.g.
  `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__find,mcp__claude-in-chrome__read_page`
  (add `form_input` and `computer` only when pasting a draft into a chat box).
- If no such tools exist, Chrome isn't connected. Don't nag. Mention once,
  briefly, that connecting Chrome lets you browse portals the way the user would
  (see the README), and continue with web search only.

## How to use it politely
- Call `tabs_context_mcp` first. Work in a NEW tab (`tabs_create_mcp`); never
  take over a tab the user already has open.
- Read pages with `get_page_text` or `read_page` before clicking anything.
- One page at a time. Wait a few seconds between pages. Stop after the number of
  pages the user agreed to (default: 3 result pages per portal per run).
- Sort by newest when the portal offers it. Open a listing only when it passes
  the hard filters from the result card.
- Never click anything that triggers a browser alert/confirm dialog; it freezes
  the session.
- If a page needs a login, shows a CAPTCHA, a "verify you're human" check, a rate
  limit or any bot challenge: STOP on that site, tell the user which site and
  why, and move on to another source. Never try to get around it.
- If the same action fails 2-3 times, stop and tell the user what happened.
- Close tabs you opened when you're done.

## Hard limits (never break these)
- **Never press Send, Submit, Enviar, Contact or any button that transmits a
  message or form.** You may open a chat and paste a draft into the text box;
  the user reads it and presses send themselves.
- Never log in, create accounts, accept terms or enter passwords for the user.
- Never write site-specific scrapers or scripts (JavaScript injected to harvest
  pages, API replays, headless crawlers). You read what a person would see.
- Never enter payment, ID or bank data anywhere.
- Only type text that comes from a draft the user approved in this session.
