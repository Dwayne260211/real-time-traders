# Real Time Traders: homepage

Plain HTML + CSS + vanilla JS. No framework, no build step. Open `index.html` in a browser, or upload the folder to any host.

```
index.html        page markup (all sections, inline SVG icon sprite at top of <body>)
css/style.css     all styles, mobile-first; colour tokens in :root at the top
js/main.js        mobile menu, tabs (marketplace, jobs, hire, services), donate carousel, wishlist hearts, quote form,
                  post-a-job form checks, membership gating, Join/Login modal mockup
images/           logo files, favicons, photos cropped from the original mockup
screenshots/      headless-Chrome renders (desktop 1920 / mobile 390)
```

## Business model (v3)
The site has three main sections ("pillars"), and the 24/7 services sit alongside them:

| Section | What it covers | On the page |
|---|---|---|
| **Marketplace** | Buy and sell: everyday goods, scrap & recycling, vehicles, antiques, donations | `#marketplace`: category tabs and product cards with Buy (members) and Sell an item (members) |
| **Jobs & Tenders** | An Airtasker-style board. Post a job and receive quotes, or browse jobs and quote. Find a Tradie is part of this section. | `#jobs`, with tabs Browse jobs (filter + example job cards with Quote now), Post a job (form) and Find a Tradie, followed by "How it works" for job posters and for workers |
| **Hire** | Kennards-style hire: tool hire, plant hire (including portable toilets, fencing, excavators, skips, sheds, water carts) and trailer hire | `#hire`, with tabs Tool / Plant & Portable Toilets / Trailer. Hire requests are open to everyone, with no membership needed |
| Services | Precious metal scrapping 24/7 (we come to you), vehicle, towing and home services | `#services` tabs, unchanged |

The nav, hero copy, quick links, footer, quote-form dropdown and FAQ all follow this structure.

## Membership (v3): suggested, to be confirmed
| Tier | Price | Suggested features |
|---|---|---|
| Guest | Free, no account | Browse everything, request hire and service quotes, call the hotline. No buying, selling, posting or quoting. |
| Basic | `$__ /month` | Buy, sell (up to [N] active listings), message buyers and sellers, saved searches and alerts |
| Bronze | `$__ /month` | Everything in Basic, plus post jobs and receive quotes, quote on jobs ([N]/month), up to [N] listings, donate and request in Community |
| Silver (shown as "Recommended") | `$__ /month` | Everything in Bronze, plus more listings and quotes, [N] featured listings a month, verified badge, hire booking priority, member hire discount [__%] |
| Gold | `$__ /month` | Everything in Silver, plus unlimited listings and quotes (TBC), business profile/storefront, analytics, top placement, priority support, team access ([N] users) |

- **Every price, limit ([N]), discount ([__%]) and the split of features between tiers is a placeholder.** Nothing on the page states a real price or a real popularity figure. Silver is highlighted with a "Recommended" badge, which is a design choice and does not claim it is the most popular tier.
- **Members-only buttons:** guests see a lock icon and a "Basic membership or higher" (or "Bronze…") tooltip. Clicking one opens the Join modal with a message explaining why.
  - Buy, Sell an item, + Listing: Basic or higher
  - Post a job, Quote now: Bronze or higher, tooltip "Bronze membership or higher". This follows the suggested ladder. If posting and quoting should be open at Basic, change `data-tier`/`data-tip` on those buttons in `index.html` and update the table.
  - Request hire, Get a quote, Call: open to everyone
- The comparison table under the tier cards scrolls sideways on phones, and the first column stays fixed.

### Accounts and payments need a backend
The Join/Login modal and every Join button are **mockups only**. They do not create accounts, log anyone in, take payments or store anything. The "Preview as member" switch in the modal just removes the locks in the browser, so you can see what members would see. Real memberships need a backend before launch, either a marketplace platform (e.g. Sharetribe, or WordPress + a membership/marketplace plugin) or a custom build. That backend has to handle:
- sign-up, login, password reset and email verification
- recurring subscription billing (e.g. Stripe Billing) and tier upgrades/downgrades/cancellation
- server-side checks of what each tier can do (the front-end locks are cosmetic only)
- listings, job posts, quotes, messaging and moderation, stored in a database
- terms, privacy policy and payment/refund rules

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
- Hotline `(025) 3686 25 16` and `contact@demolink.com` (the `tel:` links use `02536862516`)
- Service area/suburbs, address, hours for non-scrapping services, and the list of accepted metals
- Trailer types, sizes and prices (all show "Price on request"), plus the trailer images (icons for now)
- Tool Hire range (power tools, concrete & compaction, pressure washers, generators, ladders & scaffold, air compressors): the types, availability, hire periods, deposits and prices are all placeholders ("Price on request"), and the cards use icons instead of photos
- Plant Hire range (portable toilets, site fencing, mini excavators & bobcats, skip bins, site sheds, water carts): the types, delivery area, operator/licence requirements, toilet servicing and prices are all placeholders ("Price on request"), and the cards use icons instead of photos
- Product, antique and donation cards ("Product Name Here", $399.00, "Location Here", etc.), the blog posts and the "Product Name / A healthy leap ahead" promo, all from the old mockup
- The testimonial is a labelled placeholder. Replace it with a real review or remove it.
- The "10% OFF" subscribe offer (from the mockup)
- The FAQ answers marked [Placeholder], including the new membership and jobs & tenders answers
- Membership prices (`$__ /month`), limits `[N]`, discounts `[__%]` and the Bronze/Silver/Gold feature split (suggested, to be confirmed)
- Job cards in Jobs & Tenders are labelled **Example**: titles, suburbs, "Budget: Placeholder", "X quotes" and "Posted X days ago" are placeholders
- Post a job form, Join/Login modal and Join buttons are front-end only (see "Accounts and payments need a backend")
- Forms (quote, post a job, job filter, tradie search, site search, subscribe, join/login) are front-end only. Connect them to email, a booking tool, or a backend.
