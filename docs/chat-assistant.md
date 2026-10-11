# Chat assistant (automated)

`js/chat.js` adds the floating "Ask us" button and the **Real Time Traders assistant (automated)** panel to every page.
It is loaded with `defer` after `js/main.js` and has no dependencies.

## How it works now
- 100% client-side. No external services, no API keys, no cookies, and nothing typed is sent or stored anywhere.
- Opening it greets with "How can I help you today?" and shows topic chips: Buy & Sell, Hire equipment, Find a tradie, Post a job, Post a listing, Scrap metal pickup, Fees & membership, Contact & hours.
- Free text goes to a keyword matcher (`ENTRIES` in `js/chat.js`). Every answer uses only facts published on the site and links to the right page.
- "Do you hire X?" questions are checked against `data/hire-items.json` (the hire catalogue data). A match gets "Price on request: call us to check availability". If there's no match, it says it doesn't know.
- When nothing matches, it says honestly that it doesn't know and offers **Call us** (tel link with the phone hours) and the Contact page.
- It never claims to take bookings or messages, and it has no fake typing indicator.
- Phone hours and the "Open now / Closed" text come from `window.RTT_HOURS` / `window.RTT_openStatus` in `js/main.js` (Australia/Brisbane time).

## Editing answers
Edit the `ENTRIES` array in `js/chat.js`:
- `chip` is the label if it should show as a topic chip.
- `kw` holds lower-case keywords or phrases. Multi-word phrases score higher.
- `a` holds the answer paragraphs.
- `links` holds `[label, href]` pairs.
- `call: true` adds a Call us button and the hours.

Only put in facts that are already on the site: prices, fees, limits and hours. When a fact changes on the site, update it here too.

## Accessibility
- The launcher has `aria-expanded` and `aria-controls`.
- The panel is a non-modal `role="dialog"`, labelled by its heading.
- Focus moves to the input on open. Esc closes the panel and returns focus to the launcher.
- The conversation is a `role="log"` `aria-live="polite"` region.
- Every target is at least 44px and the colours meet AA.
- On phones the launcher sits inside the right-hand space reserved in the sticky call bar, so it never covers the bar, page buttons or hire booking buttons.

## Later: AI upgrade via a serverless function
If the owner wants real AI answers later:
1. Create a serverless function, for example a Supabase Edge Function, Cloudflare Worker, Netlify or Vercel function. It holds the AI provider key as a **server-side secret**. Never put the key in the site's JS. GitHub Pages is public.
2. Give the function a fixed system prompt built from the site facts (the `ENTRIES` text, the hire list and the hours). Tell the model to answer only from those facts, to say "I don't know, please call us" otherwise, and never to claim bookings or messages.
3. Add rate limiting, an origin allow-list (`realtimetradersbrisbane.au`, plus `dwayne260211.github.io` during the switch) and a max input length. Log nothing personal unless the privacy policy covers it.
4. In `js/chat.js`, keep the keyword matcher as the first step and offline fallback. Only call `fetch(FUNCTION_URL, { method: "POST", body: JSON.stringify({ q }) })` when there's no confident match, and show the reply as plain text with `textContent`.
5. Update the panel note ("Automated answers…") to say AI is used, and add that to the privacy information.
