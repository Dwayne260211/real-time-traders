# Equipment hire system: owner setup guide

This guide is for the owner of Real Time Traders. It covers switching on the hire system built into the website: the catalogue, item pages, booking requests, customer accounts, online payments and the admin page.

## Where things stand right now

The code is built and tested, but **it isn't connected to anything yet**. While `js/hire-config.js` is empty, the live site:

- shows the hire categories with the honest message "Equipment coming soon. Call us to ask about hire.";
- makes no network requests, shows no prices or availability, and takes no bookings or payments;
- shows "Online bookings aren't switched on yet" on `my-bookings.html`. `admin.html` sends visitors to `admin-login.html`, which says sign-in will work once Supabase is connected.

Nothing is advertised as available until **you** add an item, give it photos and prices, and tick **Published** on the admin page.

The local test runs used made-up items labelled "LOCAL TEST". Those exist only on the developer's machine. They aren't in the repo and never reach the live site.

## What you'll need

| Item | Cost to start | Used for |
|---|---|---|
| Supabase project (supabase.com) | Free tier is enough to start | Database, customer sign-in (email magic links), photo storage, server functions |
| Stripe account (stripe.com) | No monthly fee; per-transaction fees | Online card payments, refunds, payment receipts |
| Email sending service, e.g. Resend (resend.com) | Free tier to start | Booking emails to customers and to you |
| A business email address | | "From" and "reply to" on booking emails, plus admin alerts |
| The Supabase CLI on a computer | Free | Running the database setup and deploying the functions |

## 1. Create the Supabase project

1. Sign up at supabase.com and create a project. Pick the **Sydney** region and save the database password somewhere safe.
2. Go to **Project Settings → API** and note three values:
   - **Project URL**, e.g. `https://abcd1234.supabase.co`. This is public.
   - **anon / publishable key**. This is public and safe in the browser.
   - **service_role / secret key**. This is SECRET. It goes only into function secrets (step 6). Never put it in the website or in git.

## 2. Create the database (migrations)

On a computer with the Supabase CLI installed, inside a checkout of this repo:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push        # runs supabase/migrations/20261010000000_hire_system.sql
```

The migration creates all of the following:

- the tables: equipment, photos, rates, settings, bookings, maintenance blocks, condition reports, email and Stripe logs;
- the six categories (Cleaning, Gardening, Power tools, General, Plant & portable toilets, Trailers);
- the double-booking guard;
- the security rules (row-level security);
- two storage buckets: `equipment-photos`, which is public, and `condition-photos`, which is private.

It creates **no** equipment, prices or terms.

## 3. Sign-in settings (Supabase → Authentication)

1. **URL Configuration**:
   - Set **Site URL** to `https://dwayne260211.github.io/real-time-traders/` (or your custom domain later).
   - Add these to **Redirect URLs**:
     - `https://dwayne260211.github.io/real-time-traders/my-bookings.html`
     - `https://dwayne260211.github.io/real-time-traders/hire-item.html*`
     - `https://dwayne260211.github.io/real-time-traders/admin.html`
     - `https://dwayne260211.github.io/real-time-traders/admin-login.html` (staff email links and password resets land here)
2. **Providers → Email**:
   - Keep Email enabled. Customers sign in with a one-time link, so there are no passwords to manage.
   - For real volumes, set up **custom SMTP** under Authentication → Emails, using your email provider. Supabase's built-in sender is rate-limited and meant for testing.

## 4. Connect the website (public config)

Edit `js/hire-config.js` and fill in the two **public** values:

```js
window.RTT_HIRE_CONFIG = {
  supabaseUrl: "https://abcd1234.supabase.co",
  supabaseAnonKey: "<anon / publishable key>"
};
```

Commit and push. GitHub Pages updates in a minute or two.

The pages refuse to start if a secret key (`service_role` or `sb_secret_…`) is pasted here by mistake. Even so, check twice before committing.

## 5. Make yourself an admin (create the first admin user)

Staff sign in at **`admin-login.html`**. There's also a small "Admin" link at the bottom of every page. It uses Supabase Auth with email and password, has a "Forgot password?" reset and an optional email sign-in link. After sign-in the page asks the database `public.is_admin()`:
- Admins are sent to `admin.html`.
- Anyone else sees "This account doesn't have admin access" and is signed out.

`admin.html` sends signed-out visitors back to `admin-login.html`. That redirect is only for convenience: **the real protection is row-level security**, so only accounts in `public.user_roles` with role `admin` can read or change admin data.

To create the first admin:

1. **Create the user.** In Supabase, go to **Authentication → Users → Add user → Create new user**.
   - Enter your business email and a strong password, and tick **Auto Confirm User**.
   - Or click **Send invitation** and set the password from the email.
   - Never put a password in the website code or in git.
2. **Give it the admin role.** Open **SQL Editor** and run (with your email):

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'you@yourbusiness.com.au'
on conflict do nothing;
```

3. **Sign in.** Open `https://dwayne260211.github.io/real-time-traders/admin-login.html` and sign in with that email and password. You'll land on `admin.html` with the Equipment, Bookings, Maintenance, Condition reports and Settings tabs.
4. **More staff.**
   - Repeat steps 1 and 2 for each person.
   - To remove someone's access, run `delete from public.user_roles where user_id = (select id from auth.users where email = '...');`. You can also delete the user under Authentication → Users.

Notes:
- **Forgot password** sends Supabase's reset email. The link brings the person back to `admin-login.html`, where they choose a new password. For this to work, `admin-login.html` must be in **Redirect URLs** (step 3).
- **Password rules** (minimum length and so on) are set in Supabase under **Authentication → Providers → Email** (and Auth settings). The website doesn't check passwords itself.
- Until `js/hire-config.js` is filled in, `admin-login.html` shows "Admin sign-in will work once the Supabase project is connected" with the form disabled. Nothing can be signed in to.
- `admin.html` and `admin-login.html` are marked `noindex`, aren't in the sitemap and are disallowed in `robots.txt`.

## 6. Deploy the server functions and set secrets

```bash
supabase functions deploy create-checkout-session
supabase functions deploy cancel-booking
supabase functions deploy send-confirmation
supabase functions deploy stripe-webhook --no-verify-jwt
```

Set the secrets. They live only in Supabase, never in git:

```bash
supabase secrets set \
  SITE_URL=https://dwayne260211.github.io/real-time-traders \
  ALLOWED_ORIGINS=https://dwayne260211.github.io \
  STRIPE_SECRET_KEY=sk_test_... \
  STRIPE_WEBHOOK_SECRET=whsec_... \
  EMAIL_PROVIDER=resend \
  EMAIL_API_KEY=re_... \
  EMAIL_FROM="Real Time Traders <bookings@yourdomain.com.au>" \
  EMAIL_REPLY_TO=you@yourdomain.com.au \
  ADMIN_NOTIFY_EMAIL=you@yourdomain.com.au
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are provided to functions automatically.

Leave `PAYMENTS_LIVE` unset until step 9.

| Secret | Required | Notes |
|---|---|---|
| `SITE_URL` | Yes | Where Stripe sends customers back to |
| `ALLOWED_ORIGINS` | Yes | Comma-separated website origins allowed to call the functions |
| `STRIPE_SECRET_KEY` | For payments | `sk_test_…` while testing, `sk_live_…` only when going live |
| `STRIPE_WEBHOOK_SECRET` | For payments | From the webhook endpoint (step 7) |
| `PAYMENTS_LIVE` | For live payments | `true` only when you go live (step 9) |
| `EMAIL_PROVIDER` | For emails | `resend` (supported now). Unset means no emails, and the site says so |
| `EMAIL_API_KEY`, `EMAIL_FROM` | For emails | `EMAIL_FROM` must be on a domain verified with the provider |
| `EMAIL_REPLY_TO`, `ADMIN_NOTIFY_EMAIL` | Optional | Customer replies go to `EMAIL_REPLY_TO`. `ADMIN_NOTIFY_EMAIL` gets new-request, cancellation-review and payment-clash alerts |

## 7. Stripe

1. Create a Stripe account. Stay in **Test mode** until everything has been tried end to end.
2. Go to **Developers → API keys**, copy the **secret** test key (`sk_test_…`) and put it in `STRIPE_SECRET_KEY`. The website itself never needs a Stripe key.
3. Go to **Developers → Webhooks → Add endpoint** and set it up:
   - URL: `https://<your-project-ref>.supabase.co/functions/v1/stripe-webhook`
   - Events:
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`
     - `checkout.session.async_payment_failed`
     - `checkout.session.expired`
   - Copy the **signing secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET`.
4. Go to **Settings → Business → Customer emails** and turn on **Successful payments** (receipts) and **Refunds**. Stripe sends the payment receipt, so the site doesn't send its own.
5. You are not registered for GST, so don't turn on Stripe Tax and don't add GST. All prices are in AUD.

## 8. Fill in your settings (admin.html → Settings)

Every policy starts **blank**. Customers see "Terms to be confirmed" until you fill it in. Nothing is made up for you.

| Setting | What it does | Until you set it |
|---|---|---|
| **Pricing rule** (needs your approval, see below) | How a hire's total is worked out from your daily, weekend and weekly rates | Customers see an estimate. Online payment is refused |
| Security deposit amount | Shown on item pages. Added to the online payment if you choose "collect online" | "Terms to be confirmed" |
| Collect deposit online? | Yes adds a "Security deposit" line to Stripe Checkout. No means you collect it at pickup | Not collected online |
| Deposit terms | When and how the deposit is returned | "Terms to be confirmed" |
| ID requirements | E.g. driver licence at pickup | "Terms to be confirmed" |
| Pickup options / Delivery available / Delivery options | What customers can choose | "Terms to be confirmed"; the delivery choice is hidden |
| Late return policy | Shown on item pages and in emails | "Terms to be confirmed" |
| Damage policy | Shown on item pages and in emails | "Terms to be confirmed" |
| Cancellation terms (text) | Shown to customers | "Terms to be confirmed" |
| Auto-refund: minimum hours' notice + refund % | Customer cancels at least that many hours before the start: refunded that % of what they paid, automatically through Stripe. The % applies to the whole amount paid, including any deposit collected online | Every cancellation of a confirmed or paid booking goes to you for review |
| Accept online card payments | Second switch for payments (step 9) | Off |

### Pricing rule: choose one (owner approval needed)

The developer has **not** picked a rule for you. The two options built in are:

1. **Exact period** (`exact_period`). The total depends on the dates chosen:
   - Saturday to Sunday, and the item has a weekend rate: the weekend rate.
   - A hire of whole weeks (7, 14, 21… days), and the item has a weekly rate: weekly rate × weeks.
   - Anything else: daily rate × days.
   - Hire days are counted inclusively (Mon–Wed = 3 days).
   - An item with no matching rate shows "price on request" and can't be paid online.
2. **Customer chooses the rate** (`customer_choice`). The customer picks daily, weekend or weekly:
   - Weekend is only offered for Saturday–Sunday.
   - Weekly charges whole weeks, rounded up (e.g. 9 days = 2 weeks).

Member discounts (Silver 5%, Gold 10%) are **not** applied automatically, because memberships aren't connected yet. On a booking in admin, set "Member discount %" before the customer pays. The discount is applied to the hire amount at Stripe Checkout, not to the deposit.

## 9. Test, then go live

**Test mode**

Keep `sk_test_…` set. Then:

1. Pick a pricing rule.
2. Tick "Accept online card payments". With a test key, that switch alone allows test payments.
3. Add one item with photos and rates, and publish it.
4. Book it with your own email. Pay with Stripe's test card `4242 4242 4242 4242`.
5. Check that:
   - the booking shows **Confirmed / Paid** on `my-bookings.html` and in admin;
   - the dates are blocked for other customers;
   - you received the emails.
6. Try a cancellation.

**Going live**

1. Publish your hire terms: deposit, ID, late return, damage and cancellation.
2. Switch Stripe to live mode, create the **live** webhook endpoint (same URL and events), and get the live `whsec_…`.
3. Run `supabase secrets set STRIPE_SECRET_KEY=sk_live_... STRIPE_WEBHOOK_SECRET=whsec_... PAYMENTS_LIVE=true`.
4. In admin → Settings, keep **Accept online card payments** ticked.

A live key only works when **both** `PAYMENTS_LIVE=true` and the admin switch are on. To pause payments at any time, untick the admin switch. Customers can still send booking requests, which you confirm by phone or email.

## 10. Day-to-day use

- **Add equipment** (Equipment tab):
  - Enter the name, category, summary, description, specs, rates and photos. Add alt text for each photo.
  - Leave **Published** unticked until it's right.
  - Tick **Enquiry only** for things customers should call about, e.g. portable toilets or trailers. They're shown without online booking.
- **Bookings**:
  - Customers send requests (status **Pending**). If payments are on, they pay, and the booking confirms itself once Stripe confirms payment.
  - Otherwise, call or email the customer, then set **Confirmed**. The customer is emailed if email is set up; if not, the page tells you to contact them yourself.
  - A confirmed booking blocks those dates. The database refuses two confirmed bookings that overlap.
- **Payment clash**: if two people somehow pay for the same dates, the second is marked "Paid, but the dates clash" and you get an alert. Move the booking or refund it in Stripe. It is never double-booked.
- **Maintenance**: block dates when an item is being serviced. Customers see those dates as unavailable.
- **Condition reports**: record condition before hire and on return, with private photos that only admins can see.
- **Refunds**:
  - Automatic refunds happen only under your auto-refund terms.
  - Anything else goes to review. Refund in the Stripe dashboard, then set the booking's status.

## What's still yours to provide

- Supabase project, Stripe account and email provider (steps 1–7).
- Real inventory: items, descriptions, specs, photos and prices.
- Approval of a pricing rule.
- Policies: deposit amount and terms, ID requirements, pickup and delivery, late return, damage, cancellation and refund terms.
- A privacy policy and hire terms page before taking real bookings (Australian Privacy Principles).
- Optional: a custom domain. Once you have one, update `SITE_URL`, `ALLOWED_ORIGINS`, the Supabase redirect URLs and `robots.txt`.

## For developers

- Architecture and security model: `docs/backend-architecture.md` ("Equipment hire system" section).
- Database tests (plain Postgres 15+ with `btree_gist`/`pgcrypto`; the stub fakes Supabase's auth and storage schemas). Run them against a throwaway local database only:

```bash
createdb rtt_test
psql -v ON_ERROR_STOP=1 -d rtt_test -f supabase/tests/00_local_supabase_stub.sql \
  -f supabase/migrations/20261010000000_hire_system.sql -f supabase/tests/hire_system_test.sql
```

- Function tests (Stripe and email mocked, no network): `deno test supabase/functions/tests/handlers_test.ts`
