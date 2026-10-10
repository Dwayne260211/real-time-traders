# Real Time Traders

Static website for **Real Time Traders Pty Ltd** (ABN 54 642 170 438, ACN 642 170 438), Brisbane, QLD. One platform with three parts: a **Marketplace**, **Jobs & Tenders** (Airtasker-style) and **Hire** (tools, plant including portable toilets, and trailers), plus scrap metal pickup (we come to you to collect it). Phone hours Mon–Fri 5am–9pm, Sat–Sun 7am–4pm.

Live preview: https://dwayne260211.github.io/real-time-traders/

> This is a preview. The equipment hire system is built but switched off until the owner connects Supabase and Stripe (see `docs/hire-system-setup.md`). Accounts, payments, subscriptions, listings, job posting, quoting and online enquiries are not live yet, and the site labels them that way. Visitors are directed to the call buttons. See `docs/backend-architecture.md` for the plan.

## Files

```
index.html        home: hero, at-a-glance strip, three pillars, services, membership teaser, how it works
marketplace.html  categories and sample listings (labelled "Sample listing"): featured, antiques & rare finds, donated items
jobs.html         Jobs & Tenders: example jobs, post a job (preview), Find a Tradie, job fees (#fees)
hire.html         equipment hire catalogue: Cleaning, Gardening, Power tools, General, Plant & portable toilets, Trailers
hire-item.html    one hire item (?id=): photos, rates, terms, availability, booking request (noindex)
my-bookings.html  customer sign-in (email link) and their hire bookings (noindex)
login.html        member sign-in: email + password, email link, reset, Google (Supabase Auth; noindex)
join.html         create a member account with tier picker (Supabase signUp; noindex)
portal.html       members portal (needs sign-in): profile, tier, own hire bookings, settings (noindex)
admin.html        hire admin: equipment, bookings, maintenance, condition reports, settings (noindex, not in sitemap)
admin-login.html  staff sign-in (Supabase email + password, reset, email link); admins go to admin.html (noindex, not in sitemap, disallowed in robots.txt)
post.html         how to post a listing / job (online posting coming soon)
services.html     scrap metal pickup (we come to you), vehicle services, towing & car removal, home services
membership.html   tiers and comparison table (introductory pricing, AUD)
community.html    donating and asking for help
contact.html      call card, company details, FAQ
css/style.css     all styles, mobile-first; colour tokens in :root
js/main.js        menu, tabs, carousel, header search routing, preview gating and the Join/Login preview modal
js/hire-*.js      hire system front end; js/hire-config.js holds the PUBLIC Supabase URL + anon key (empty = switched off)
js/my-bookings.js customer bookings page
js/member-portal.js form checks for login/join/portal (preview messages if Supabase isn't configured)
js/member-auth.js member sign-in/sign-up/portal with Supabase Auth; setup steps in docs/member-auth-setup.md
js/vendor/        supabase-js (MIT), loaded only when the hire system is configured
supabase/         hire system database migration, Edge Functions (Stripe checkout/webhook, email, cancellation) and tests
images/           logo v2 (logo-lockup-560.png/.webp used on the site), photos with .webp versions, og-image.jpg
images/logo-orange/  the earlier orange logo set (not used)
docs/             pricing-research.md, backend-architecture.md, hire-system-setup.md (owner guide for switching on hire)
sitemap.xml, robots.txt
```

No build step. Edit the HTML directly. The header, footer, call strip and Join/Login modal are repeated on every page, so change them on all eight main pages. The four hire pages (`hire.html`, `hire-item.html`, `my-bookings.html`, `admin.html`) share the same header and footer.

## Contact

The phone number is only used behind the **Call us** / **Call now** buttons (`tel:` links). The client doesn't want it shown as visible text, so don't add it to page copy. There is no confirmed email address yet, so none is published.

Director: John Carter. No street address is published; the site shows "Brisbane, QLD". Phone hours: Mon–Fri 5am–9pm, Sat–Sun 7am–4pm (Brisbane time). Do not claim 24/7.

## Pricing (do not change without the client)

Introductory pricing, AUD. Not registered for GST, so no GST is shown or charged.

| Tier | Price | Key limits |
|---|---|---|
| Guest | Free, no account | Browse, request quotes |
| Free account | $0 | Post up to 5 jobs; pays the connection fee; can't buy, sell or quote |
| Basic | $4.99/mo ($49.90/yr) | Connection fee waived, 10 listings, buy and sell |
| Bronze | $19.99/mo | 30 listings, 20 quotes/mo |
| Silver (Recommended) | $39.99/mo | 100 listings, 60 quotes, 2 featured/mo, 5% hire discount, verified badge |
| Gold | $79.99/mo | Unlimited listings and quotes (fair use), 10 featured/mo, 10% hire discount, storefront, 5 users |

Job fees (same as Airtasker):
- Worker service fee: Level 1 20%, Level 2 18.5% ($880+ earned in 30 days), Level 3 14.9% ($2,650+), Level 4 12.5% ($5,300+).
- Connection fee for free accounts: $9.95 / $14.95 / $19.95 / $29.95 / $39.95 / $49.95 / $59.95 by accepted quote price band; waived for Basic and above.
- Examples: on a $200 job the worker keeps $160; a free account accepting a $180 quote pays $209.95.

Research behind these numbers: `docs/pricing-research.md`.

## Brand

| Token | Hex | Use |
|---|---|---|
| red | `#DD0302` | primary calls to action |
| royal blue | `#015DD9` | links, icons, eyebrows |
| navy | `#011839` | headings, dark sections, top bar |
| yellow | `#FDD323` | small accents on navy only |
| background | `#F2F4F8` | soft section background |

All text colours meet WCAG 2.2 AA contrast. Yellow is never used for text on white.

## Before going live

- Connect an enquiry service and a confirmed email (see `docs/backend-architecture.md`).
- Build accounts and Stripe billing in test mode first; publish terms, privacy, cancellation and refund policies.
- Replace sample listings and example jobs with real data, and stock photos with real photos.
- Confirm the service area, hire range and pricing, and the accepted scrap materials.
- Hire: follow `docs/hire-system-setup.md` (Supabase, Stripe, email, inventory, prices, terms, pricing-rule approval).

## Deploying

GitHub Pages builds from `main` (root). `.nojekyll` is present so files are served as-is. Push a normal commit to `main` and Pages redeploys in a minute or two.


## Chat assistant
`js/chat.js` is a client-side, rules-based assistant (no external services). See `docs/chat-assistant.md`.

## Hire range
`hire.html` renders `data/hire-items.json` (148 generic items with rates, plus the owner's DeWalt kit pinned first) with search, category filters and a Light / Heavy toggle. See `docs/hire-catalogue.md` (how to edit) and `docs/hire-rates-research.md` (rate sources and smoothing).

Contact email: itsreallymejohnnyc@gmail.com (mailto links on the contact page, in the footer, the homepage "Talk to us" block and the chat assistant).
