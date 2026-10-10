# Backend architecture

Status, October 2026: the live site is a static preview on GitHub Pages. Accounts, logins, payments, subscriptions, password reset, listings, job posting, quoting and online enquiries do **not** work yet, and the site says so wherever they appear. Nothing in this repo holds an API key, secret or live billing setting. This document describes how to add the backend safely when the client is ready.

**Update, October 2026:** the **equipment hire system** is now built on Supabase and Stripe (code in `supabase/` and `js/hire-*.js`). It stays switched off until the owner connects a Supabase project. See the [Equipment hire system](#equipment-hire-system-built) section below and the owner guide `docs/hire-system-setup.md`. Everything else in this document (memberships, marketplace, jobs) is still a recommendation and hasn't been built.

## Goals

- Real member accounts with the tiers already published (Guest, Free account, Basic, Bronze, Silver, Gold). Prices and limits must match `membership.html` exactly.
- Safe payments for memberships (monthly and yearly) and job connection fees, with no card data touching our servers.
- A working enquiry form that delivers to a confirmed business email address.
- Keep the static front end (HTML/CSS/vanilla JS) and GitHub Pages hosting, and add a small serverless API next to it.

## Recommended stack

| Need | Recommendation | Why |
|---|---|---|
| Auth | A managed auth provider: Supabase Auth, Clerk or Auth0 | Handles password hashing, email verification, password reset, rate limiting and MFA. Don't build auth by hand. |
| Database | Postgres (Supabase, Neon or similar) with row-level security | Listings, jobs, quotes, profiles and membership state. |
| API | Serverless functions: Cloudflare Workers, Netlify Functions or Vercel Functions | Small, cheap and separate from the static site. |
| Payments | Stripe Checkout + Stripe Billing + Customer Portal | Hosted checkout keeps us out of PCI scope. The Customer Portal handles upgrades, downgrades, cancellations and card updates. |
| Enquiry form (quick win) | Formspree or Web3Forms, or a serverless function that sends via Postmark/Resend | Needs a confirmed business email first. |
| File uploads (listing photos) | Supabase Storage or Cloudflare R2, with signed upload URLs | Size and type limits enforced on the server. |

## Roles and permissions

| Role | Can do |
|---|---|
| Guest (no account) | Browse everything, request quotes for services and hire (by phone for now). |
| Free account ($0) | Post up to 5 open jobs, receive quotes, message workers about their jobs. Pays the connection fee when assigning a job. Cannot buy, sell or quote. |
| Basic ($4.99/mo or $49.90/yr) | Free account rights + connection fee waived, buy, sell (10 active listings), message buyers and sellers. |
| Bronze ($19.99/mo) | Basic + quote on jobs (20 quotes/mo), 30 listings, worker profile. |
| Silver ($39.99/mo) | Bronze + 60 quotes/mo, 100 listings, 2 featured listings/mo, verified badge, 5% hire discount. |
| Gold ($79.99/mo) | Silver + unlimited listings and quotes (fair use), 10 featured/mo, storefront, 10% hire discount, up to 5 team users. |
| Staff / admin | Moderate listings and jobs, handle disputes, manage hire bookings. Separate role, MFA required. |

Rules:
- Enforce every limit on the server (database policies or API checks), never only in the browser. The current front-end "locks" are a preview only.
- Store the member's tier from Stripe webhooks (see below), not from anything the browser sends.
- Worker service fees (Level 1 20%, Level 2 18.5% at $880+ in 30 days, Level 3 14.9% at $2,650+, Level 4 12.5% at $5,300+) and connection fees ($9.95 to $59.95 by price band, waived for Basic and up) are calculated on the server.

## Payments flow (Stripe)

1. The member picks a tier on `membership.html` and presses Join.
2. The browser calls `POST /api/checkout` with the tier and billing period only (never a price).
3. The function looks up the matching Stripe Price ID from server config, creates a Checkout Session in `subscription` mode, and returns its URL.
4. Stripe hosts the payment page. On success the member returns to a thank-you page.
5. Stripe sends webhooks to `POST /api/stripe-webhook`. The function verifies the signature with the webhook signing secret, then updates the member's tier in the database. Events to handle: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
6. Members manage or cancel through the Stripe Customer Portal (`POST /api/billing-portal`).

Connection fees: a one-off Checkout Session in `payment` mode when a free account accepts a quote.
Payouts to workers (minus the service fee) need Stripe Connect. That is a bigger piece of work, with identity checks, so plan it as a second phase.

Not GST registered: no GST is added. If the business registers for GST later, update the Stripe prices and tax settings and the site copy together.

## Endpoints (suggested)

| Endpoint | Purpose |
|---|---|
| `POST /api/enquiry` | Contact form. Validates input, checks a honeypot field and a Turnstile/hCaptcha token, rate-limits by IP, and emails the business. |
| `POST /api/checkout` | Creates a Stripe Checkout Session for a tier. Auth required. |
| `POST /api/billing-portal` | Opens the Stripe Customer Portal. Auth required. |
| `POST /api/stripe-webhook` | Receives Stripe events. Verifies the signature. No auth header (Stripe signs it instead). |
| `GET/POST /api/listings`, `/api/jobs`, `/api/quotes` | CRUD with tier limits enforced. |

## Secrets and configuration

Keep every secret in the hosting provider's environment variables. Never commit them, and never put them in front-end JavaScript.

```
STRIPE_SECRET_KEY=          # sk_live_... / sk_test_...
STRIPE_WEBHOOK_SECRET=      # whsec_...
STRIPE_PRICE_BASIC_MONTHLY= # price_...  (one per tier and period)
AUTH_PROVIDER_SECRET=
DATABASE_URL=
ENQUIRY_TO_EMAIL=           # the confirmed business email
EMAIL_API_KEY=              # Postmark / Resend
TURNSTILE_SECRET_KEY=
```

Only publishable values (Stripe publishable key, auth client ID, Turnstile site key) may appear in the front end.

## Security checklist

- HTTPS only; set HSTS on any custom domain.
- CORS on the API limited to the site's origin.
- Validate and length-limit every input on the server. Escape output.
- Rate-limit login, sign-up, password reset and enquiry endpoints.
- Use test mode in Stripe until terms, refunds and cancellation policy are published.
- Log webhook failures and alert on them.
- Privacy policy and terms of use published before collecting personal data (Australian Privacy Principles).

## Quickest path to a working enquiry form

1. Confirm the business email address.
2. Create a Formspree or Web3Forms form that delivers to it (free tiers are enough to start).
3. Add the form back to `contact.html` with `action` pointing at that endpoint, a honeypot field and a spam check, and an honest success message only after the service returns 200.
4. Test end to end, then remove the "Online enquiries are coming soon" notice.

## Equipment hire system (built)

Status: built and tested, but not connected. `js/hire-config.js` is empty, so the live pages show honest "coming soon / call us" states and make no requests. Owner steps are in `docs/hire-system-setup.md`.

### Components

| Part | Where | Notes |
|---|---|---|
| Catalogue | `hire.html`, `js/hire-catalogue.js` | Filters: Cleaning, Gardening, Power tools, General, Plant & portable toilets, Trailers. Shows published items only. Old `#tool`, `#plant`, `#trailer` links still work. |
| Item page | `hire-item.html?id=<uuid>`, `js/hire-item.js` | Gallery, rates, terms ("Terms to be confirmed" when blank), live availability, booking request, Stripe Checkout redirect when payments are on. `noindex`. |
| Customer bookings | `my-bookings.html`, `js/my-bookings.js` | Magic-link sign-in. Lists the customer's own bookings, lets them pay (when live) and cancel. `noindex`. |
| Admin | `admin.html`, `js/hire-admin.js` | Equipment and rates, publish switch, photos, bookings, maintenance blocks, condition reports with private photos, settings. `noindex, nofollow`, not in the sitemap, disallowed in `robots.txt`. Access enforced by RLS. |
| Shared browser code | `js/hire-common.js`, `js/vendor/supabase-js-2.117.3.min.js` | supabase-js is loaded only when configured. The config loader refuses `service_role` / `sb_secret_` keys. |
| Database | `supabase/migrations/20261010000000_hire_system.sql` | Tables, functions, RLS, storage buckets. |
| Edge Functions (Deno) | `supabase/functions/*` | `create-checkout-session`, `stripe-webhook`, `send-confirmation`, `cancel-booking`, shared code in `_shared/`. |
| Tests | `supabase/tests/*.sql`, `supabase/functions/tests/handlers_test.ts` | SQL assertions (rolled back) and function tests with Stripe and email mocked. |

### Data model

- `hire_categories`: the six categories. These are example categories, not confirmed inventory.
- `equipment` has `is_published` (default false) and `enquiry_only`.
- `equipment_photos` live in the public bucket `equipment-photos`, with admin-only writes, up to 5 MB, JPEG/PNG/WebP.
- `equipment_rates` hold daily, weekend and weekly rates in cents, all nullable.
- `hire_settings` is a single row. Every policy field is nullable with **no default**. `payments_live` defaults to false. `pricing_rule` is null until the owner approves one.
- `bookings`:
  - `reference`, an equipment name snapshot, customer details, and inclusive `start_date`–`end_date` (`hire_days` is generated).
  - The price snapshot: `price_breakdown`, `hire_total_cents`, `deposit_cents` and `discount_percent`.
  - `status`: pending / confirmed / cancelled / completed.
  - `payment_status`: unpaid / checkout_open / paid / paid_conflict / refund_pending / refunded / partially_refunded.
  - Stripe ids, and `cancel_requested_at`.
- `maintenance_blocks`, and `condition_reports` with `condition_report_photos` (in the private bucket `condition-photos`, viewed through signed URLs).
- `stripe_events` (webhook idempotency) and `email_log` (one email of each kind per booking).

### Double-booking guard

Every period that makes an item unavailable is a row in `equipment_holds`:

| Hold kind | Created when | Removed when |
|---|---|---|
| `booking` | A booking becomes confirmed or completed (trigger) | It's cancelled |
| `maintenance` | A maintenance block is added (trigger) | The block is removed |
| `checkout` | A customer opens Stripe Checkout | It expires |

The rule itself is `EXCLUDE USING gist (equipment_id WITH =, period WITH &&)` on an inclusive `daterange` (needs `btree_gist`). The database therefore physically refuses two overlapping holds, whatever the browser does. Admins confirming a clashing booking get "Those dates clash…".

Checkout holds expire 5 minutes after the Stripe session's `expires_at`. Expired holds are purged before every check. If a payment still arrives for dates that were taken meanwhile, `confirm_paid_booking` marks it `paid_conflict` and alerts the admin. It never double-books.

### Pricing

`calculate_hire_price` is immutable and runs on the server; the browser never sends a price.

- `exact_period`:
  - Saturday→Sunday with a weekend rate: the weekend rate.
  - Whole weeks with a weekly rate: the weekly rate.
  - Otherwise: daily × days.
- `customer_choice`:
  - Daily, weekend (Saturday–Sunday only) or weekly (rounded up).
- A missing rate means "price on request".
- With `pricing_rule` null, the site shows estimates only and online payment is refused. **The owner must choose and approve a rule.**
- Member discount (Silver 5%, Gold 10%): the admin sets `discount_percent` per booking. It's applied to the hire amount at checkout. Memberships aren't connected yet, so it isn't automatic.

### Access control (RLS)

| Who | Can |
|---|---|
| Anyone (anon key) | Read categories, **published** equipment with its photos and rates, and settings. Call `check_availability`, `get_unavailable_periods` and `quote_hire`, which return dates only and never customer data. |
| Signed-in customer | `request_booking`: pending only, max 5 pending per user, no past dates, no enquiry-only items, refuses unavailable dates. Read their own bookings. Can't update bookings directly. |
| Admin (`user_roles.role = 'admin'`) | Everything above plus all CRUD, storage writes and condition photos. Nobody can grant themselves admin. |
| Service role (Edge Functions only) | `begin_checkout`, `attach_checkout_session`, `release_checkout`, `confirm_paid_booking`, `decide_cancellation`, `record_refund`, `claim_email` and `record_stripe_event`. `EXECUTE` is revoked from `public`, `anon` and `authenticated`. |

### Payments flow (hire)

1. The customer requests dates, and `request_booking` creates a pending booking.
2. If `payments_live` and `pricing_rule` are both set, the browser calls `create-checkout-session` with only the booking id.
3. The function re-prices on the server, places a checkout hold and creates a Stripe Checkout Session:
   - `payment` mode, AUD, with an idempotency key and `receipt_email`;
   - the deposit as a separate line when it's collected online.
4. `stripe-webhook` verifies the `Stripe-Signature` (HMAC-SHA256, 5-minute tolerance) and ignores duplicate events. Then:
   - on `checkout.session.completed` or `async_payment_succeeded` it calls `confirm_paid_booking`, which confirms the booking or marks it `paid_conflict`;
   - on `expired` or `async_payment_failed` it releases the hold.
5. Switches: a test key needs `PAYMENTS_LIVE=true` **or** the admin switch. A live key (`sk_live_`) needs **both**.
6. `cancel-booking`:
   - An unpaid request is cancelled at once, and any open Checkout Session is expired.
   - When the owner has set auto-refund terms and the notice is long enough, the booking is cancelled and a Stripe refund is made for the set %.
   - Otherwise it goes to admin review (`cancel_requested_at`). With no terms, there are no automatic refunds.
7. `send-confirmation` is provider-agnostic (`EMAIL_PROVIDER=resend` today) and de-duplicated through `email_log`. If no provider is set it returns `{sent:false, reason:"email_not_configured"}`, and the UI says so instead of claiming an email went out.

### Hire secrets (Edge Function env only)

```
STRIPE_SECRET_KEY=        # sk_test_... while testing; sk_live_... only when going live
STRIPE_WEBHOOK_SECRET=    # whsec_...
PAYMENTS_LIVE=            # "true" only when going live
SITE_URL=                 # https://realtimetradersbrisbane.au
ALLOWED_ORIGINS=          # https://realtimetradersbrisbane.au,https://www.realtimetradersbrisbane.au,https://dwayne260211.github.io
EMAIL_PROVIDER= EMAIL_API_KEY= EMAIL_FROM= EMAIL_REPLY_TO= ADMIN_NOTIFY_EMAIL=
# SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are injected by Supabase.
```

The browser only ever gets the Supabase URL and the public anon key, from `js/hire-config.js`.
