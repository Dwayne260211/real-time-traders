# Real Time Traders: website

A multi-page static site built with plain HTML, CSS and vanilla JS. There's no framework and no build step. Open `index.html` in a browser, or upload the folder to any host. All links are relative, so it works under GitHub Pages at `/real-time-traders/`.

Live site: https://dwayne260211.github.io/real-time-traders/

```
index.html        overview: hero, three pillars, service teasers, membership teaser, how it works, why choose us
marketplace.html  categories, Featured / Antiques & Rare Finds / Donate tabs (#featured #rare #donate), trending, promo
jobs.html         Jobs & Tenders: Browse jobs / Post a job / Find a Tradie tabs (#browse #post #tradie), how it works
hire.html         Tool / Plant & Portable Toilets / Trailer hire tabs (#tool #plant #trailer)
services.html     Precious Metal Scrapping 24/7 / Vehicle / Towing / Home tabs (#scrap #vehicle #towing #home)
membership.html   tier cards, comparison table, how it works
community.html    community help & donations, Just Landing (blog), testimonial
contact.html      quote/contact form (#quote), hotline, director, FAQ (#faq)
css/style.css     all styles, mobile-first; colour tokens in :root at the top
js/main.js        menu, tabs (+ opening a tab from the URL hash), carousel, hearts, quote form + ?service= prefill,
                  post-a-job checks, membership locks, Join/Login modal mockup, member preview (kept across pages)
images/           logo files, favicons, photos cropped from the original mockup
screenshots/      headless-Chrome renders: desktop.png / mobile.png (home page), <page>-desktop.png (1920) and
                  <page>-mobile.png (390) for the other pages, mobile-viewport.png
docs/             pricing-research.md (competitor pricing, sources, rationale)
```

### How the pages fit together
- Every page shares the same top bar, header, nav, subscribe bar, footer, sticky mobile call bar and Join/Login modal. These are copied into each HTML file, so if you edit them by hand, change every page. The current page is highlighted in the nav (`aria-current="page"`), and Hire and Services highlight their dropdown.
- **Deep links open tabs.** For example, `hire.html#plant` opens the Plant tab and `jobs.html#post` opens Post a job. Clicking a tab updates the URL, so it can be shared.
- **Book / Hire / Request buttons** link to `contact.html?service=<name>#quote`. The contact page pre-selects that service in the form (and pre-fills the details for Find a Tradie trades).
- The "Preview as member" demo switch is remembered while you move between pages (sessionStorage, this browser tab only).

## Business model (v3)
The site has three main sections ("pillars"), and the 24/7 services sit alongside them:

| Section | What it covers | On the page |
|---|---|---|
| **Marketplace** | Buy and sell: everyday goods, scrap & recycling, vehicles, antiques, donations | `#marketplace`: category tabs and product cards with Buy (members) and Sell an item (members) |
| **Jobs & Tenders** | An Airtasker-style board. Post a job and receive quotes, or browse jobs and quote. Find a Tradie is part of this section. | `#jobs`, with tabs Browse jobs (filter + example job cards with Quote now), Post a job (form) and Find a Tradie, followed by "How it works" for job posters and for workers |
| **Hire** | Kennards-style hire: tool hire, plant hire (including portable toilets, fencing, excavators, skips, sheds, water carts) and trailer hire | `#hire`, with tabs Tool / Plant & Portable Toilets / Trailer. Hire requests are open to everyone, with no membership needed |
| Services | Precious metal scrapping 24/7 (we come to you), vehicle, towing and home services | `#services` tabs, unchanged |

The nav, hero copy, quick links, footer, quote-form dropdown and FAQ all follow this structure.

## Membership (v4): introductory pricing, AUD inc. GST
| Tier | Monthly | Annual (2 months free) | What's included |
|---|---|---|---|
| Guest | Free | Free | Browse everything, request hire and service quotes, call the hotline. No buying, selling, posting or quoting. |
| Basic | $4.99 | $49.90 | Buy, sell up to 10 active listings, **post jobs** (up to 5 open), messaging, saved searches and alerts |
| Bronze | $19.99 | $199.90 | Everything in Basic, plus **quote on jobs & tenders (20/month)**, 30 listings, unlimited open jobs (fair use), worker/tradie profile, Community donate and request |
| Silver ("Recommended") | $39.99 | $399.90 | Everything in Bronze, plus 60 quotes/month, 100 listings, 2 featured listings/month, verified badge, hire booking priority, 5% off hire |
| Gold | $79.99 | $799.90 | Everything in Silver, plus unlimited quotes and listings (fair use), 10 featured listings/month with top placement, business profile/storefront, analytics, 10% off hire, priority support, up to 5 team users |

- The competitor research (with sources and dates) and the pricing rationale are in [`docs/pricing-research.md`](docs/pricing-research.md).
- On the page, the yellow "placeholders" banner is replaced by a small "Introductory pricing, inc. GST" note. The note under the table says "pricing and features may change" and explains that unlimited means fair use. Silver's "Recommended" badge is a design choice and does not claim it is the most popular tier.
- **Members-only buttons:** guests see a lock icon and a tooltip. Clicking opens the Join modal with that tier preselected.
  - Buy, Sell an item, + Listing, **Post a job**: "Basic membership or higher"
  - Quote now (jobs & tenders): "Bronze membership or higher"
  - Request hire, Get a quote, Call: open to everyone
- The comparison table scrolls sideways on phones, and the first column stays fixed.
- Still to confirm before launch: cancellation, refund and pro-rata terms (placeholder in the FAQ), fair-use limits, and the margin on member hire discounts.

## Job fees (Jobs & Tenders): same as Airtasker, checked 9 Oct 2026
Shown in the "Job fees" block on `jobs.html#fees`, a short note and two table rows on `membership.html`, and FAQ entries on `contact.html`.

| Who | Fee | When |
|---|---|---|
| Job poster | Connection fee by accepted quote price: under $50 $9.95, $50–99.99 $14.95, $100–149.99 $19.95, $150–199.99 $29.95, $200–249.99 $39.95, $250–299.99 $49.95, $300+ $59.95 (inc. GST). **Waived for Basic, Bronze, Silver and Gold members.** Posting needs Basic, so members never pay it. | Once, when a quote is accepted and the job assigned |
| Worker/tradie | Service fee by level: Level 1 (under $880 earned in the last 30 days) 20%, Level 2 ($880+) 18.5%, Level 3 ($2,650+) 14.9%, Level 4 ($5,300+) 12.5%. All **+ GST**, and the completion rate over the last 20 jobs must also meet the level | On jobs won, deducted at payout |
| Marketplace / hire | No extra fees beyond membership | n/a |

Sources and caveats are in `docs/pricing-research.md`. The exact completion-rate % for each level isn't published by Airtasker and is still to be decided. Taking fees requires the payments backend.

### Accounts and payments need a backend
The Join/Login modal and every Join button are **mockups only**. They do not create accounts, log anyone in, take payments or store anything. The "Preview as member" switch in the modal just removes the locks in the browser, so you can see what members would see. Real memberships need a backend before launch, either a marketplace platform (e.g. Sharetribe, or WordPress + a membership/marketplace plugin) or a custom build. That backend has to handle:
- sign-up, login, password reset and email verification
- recurring subscription billing (e.g. Stripe Billing) and tier upgrades/downgrades/cancellation
- server-side checks of what each tier can do (the front-end locks are cosmetic only)
- listings, job posts, quotes, messaging and moderation, stored in a database
- terms, privacy policy and payment/refund rules

## Contact details (live)
- Hotline: **0422 909 739** (24/7). All `tel:` links use `tel:+61422909739`. The number is set once at the top of the generator (`HOT` / `TEL`).
- Director: **John Carter**, shown in the footer and the contact section.

## Brand (v2 logo colourway)
Colours were sampled from `images/logo-source-v2.png`:

| Token | Hex | Use |
|---|---|---|
| navy | `#011839` | the "REAL"/"TRADERS" lettering: top bar, subscribe bar, headings, outline buttons |
| royal blue | `#015DD9` | the bars: links, icons, eyebrows (5.9:1 on white) |
| red | `#DD0302` | the bars/"TIME": main buttons, active tabs, Book/Hire buttons (white text 5.1:1); hover `#B30201` |
| yellow | `#FDD323` | the glow/rules: small accents only (24/7 badge, phone number and "10% OFF" on navy, step icons, Placeholder tag); always navy text on yellow (12.2:1) |
| surfaces | `#F2F4F8`, blue tint `#E8F0FD`, muted text `#5D6675` | |

Every text/background pair meets WCAG AA (4.5:1 or better). The font is Inter (Google Fonts).

The logo files `logo-lockup.png` (horizontal, header/footer), `logo-full.png` (stacked) and `logo-icon.png` (icon only), plus `favicon-*.png`, `favicon.ico` and `apple-touch-icon.png`, are transparent cut-outs of the v2 logo. Use them on light backgrounds, because the navy lettering disappears on dark ones. The previous orange/charcoal logo set is kept, unused, in `images/logo-orange/`. The original orange donation category icon is in `images/legacy/`.

## Before going live: placeholders to replace
- `contact@demolink.com` and the street address
- Service area/suburbs, address, hours for non-scrapping services, and the list of accepted metals
- Trailer types, sizes and prices (all show "Price on request"), plus the trailer images (icons for now)
- Tool Hire range (power tools, concrete & compaction, pressure washers, generators, ladders & scaffold, air compressors): the types, availability, hire periods, deposits and prices are all placeholders ("Price on request"), and the cards use icons instead of photos
- Plant Hire range (portable toilets, site fencing, mini excavators & bobcats, skip bins, site sheds, water carts): the types, delivery area, operator/licence requirements, toilet servicing and prices are all placeholders ("Price on request"), and the cards use icons instead of photos
- Product, antique and donation cards ("Product Name Here", $399.00, "Location Here", etc.), the blog posts and the "Product Name / A healthy leap ahead" promo, all from the old mockup
- The testimonial is a labelled placeholder. Replace it with a real review or remove it.
- The "10% OFF" subscribe offer (from the mockup)
- The FAQ answers marked [Placeholder], including jobs & tenders fees and membership cancellation terms
- Membership cancellation/refund terms (FAQ placeholder). Prices and limits are now set (see above), but re-check them against competitors before launch
- Job cards in Jobs & Tenders are labelled **Example**: titles, suburbs, "Budget: Placeholder", "X quotes" and "Posted X days ago" are placeholders
- Post a job form, Join/Login modal and Join buttons are front-end only (see "Accounts and payments need a backend")
- Forms (quote, post a job, job filter, tradie search, site search, subscribe, join/login) are front-end only. Connect them to email, a booking tool, or a backend.
