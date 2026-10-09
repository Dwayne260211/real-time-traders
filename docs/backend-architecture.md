# Backend architecture (recommended, not built yet)

Status, October 2026: the live site is a static preview on GitHub Pages. Accounts, logins, payments, subscriptions, password reset, listings, job posting, quoting and online enquiries do **not** work yet, and the site says so wherever they appear. Nothing in this repo holds an API key, secret or live billing setting. This document describes how to add the backend safely when the client is ready.

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
