# Member accounts: setup guide (Supabase + Google)

The member pages (`login.html`, `join.html`, `portal.html`) use the **same Supabase project** as the hire system and staff sign-in:

- Project URL: `https://qcfszkrwctwsllcivxwo.supabase.co`
- Public (anon) key: already in `js/hire-config.js`. Nothing new goes in the website code.

The code is ready, but four things have to be done by hand in the Supabase dashboard and Google Cloud. Until they're done, the pages load but:

- Sign-ups won't get a profile row until the database migration is applied (step 4). Sign-in still works.
- "Continue with Google" shows "Google sign-in isn't switched on yet" until step 2 is done.
- Email links (confirm email, sign-in link, password reset) only come back to the member pages once their addresses are on the redirect list (step 3).

Never paste the **service_role** key, the Google **client secret**, or any Stripe secret into the website files. The Google client secret goes in the Supabase dashboard only.

---

## 1. Email sign-in (Supabase → Authentication → Sign In / Providers → Email)

1. Keep **Email** enabled. It's already on for staff and hire customers.
2. Decide on **Confirm email**:
   - **On (recommended):** after "Create account", the page says "Check your email: we've sent a confirmation link". The link opens `portal.html` signed in.
   - **Off:** the member goes straight to `portal.html` after "Create account".
   The page detects which one is in use automatically. No code change is needed either way.
3. Leave **Allow new users to sign up** on (Authentication → Sign In / Providers → "User Signups"). If it's off, `join.html` will say new accounts can't be created online.
4. For real volumes, set up **custom SMTP** (Authentication → Emails → SMTP Settings). Supabase's built-in sender is rate-limited (a few emails an hour) and is meant for testing.
5. Optional: under Authentication → Emails, edit the "Confirm signup", "Magic Link" and "Reset Password" templates so they say Real Time Traders.

## 2. Google sign-in

### 2a. Google Cloud (https://console.cloud.google.com)

1. Create a project (or pick one), e.g. "Real Time Traders".
2. **APIs & Services → OAuth consent screen** (Google Auth Platform → Branding):
   - User type: **External**.
   - App name: Real Time Traders. Support email: your email.
   - Authorised domains: add `supabase.co`, `github.io` and, when the custom domain is live, `realtimetradersbrisbane.au`.
   - Scopes: the defaults (`openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`) are all that's needed.
   - Publish the app ("In production"). While it's in "Testing", only the test users you list can sign in.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type: **Web application**. Name: "Supabase member sign-in".
   - **Authorised JavaScript origins**:
     - `https://dwayne260211.github.io`
     - `https://realtimetradersbrisbane.au` (add when the custom domain is live)
   - **Authorised redirect URIs**. This must be exactly the Supabase callback, not a page on the website:
     - `https://qcfszkrwctwsllcivxwo.supabase.co/auth/v1/callback`
   - Click **Create**, then copy the **Client ID** and **Client secret**.

### 2b. Supabase (Authentication → Sign In / Providers → Google)

1. Turn **Enable Sign in with Google** on.
2. Paste the **Client ID** into "Client IDs" and the **Client secret** into "Client Secret (for OAuth)".
3. Check that the "Callback URL (for OAuth)" shown there is `https://qcfszkrwctwsllcivxwo.supabase.co/auth/v1/callback`. It must match the redirect URI in Google exactly.
4. Save.

How it flows: the website's button sends people to Google, then Google sends them to the Supabase callback above, and Supabase sends them on to `portal.html` (step 3 allow-list). People who sign in with Google for the first time get an account and a profile automatically. Their name comes from Google.

## 3. Site URL and redirect allow-list (Supabase → Authentication → URL Configuration)

1. **Site URL:** keep `https://dwayne260211.github.io/real-time-traders/`. Change it to `https://realtimetradersbrisbane.au/` only when the custom domain is live.
2. **Redirect URLs:** keep the existing hire/admin entries and **add**:
   - `https://dwayne260211.github.io/real-time-traders/portal.html` (Google sign-in, email confirmation, email sign-in links)
   - `https://dwayne260211.github.io/real-time-traders/login.html` (member password resets)
   - When the custom domain is live, also add:
     - `https://realtimetradersbrisbane.au/portal.html`
     - `https://realtimetradersbrisbane.au/login.html`

If a URL isn't on this list, Supabase falls back to the Site URL (the home page). The home page then passes the link to the **staff** sign-in page, which signs out anyone who isn't an admin. So a missing entry shows up as "This account doesn't have admin access".

## 4. Apply the database migration

File: `supabase/migrations/20261010120000_member_profiles.sql`. It only **adds** things: a `public.profiles` table, a sign-up trigger, and security rules. It doesn't change any hire table, function or rule, and it's safe to run more than once.

Pick one way to run it:

- **SQL Editor (simplest):** Supabase → SQL Editor → New query. Paste the whole file and click **Run**. It should finish with "Success. No rows returned".
- **CLI:** `supabase link --project-ref qcfszkrwctwsllcivxwo`, then `supabase db push`. The hire migration is already applied, so only the new file runs. If the CLI says the hire migration isn't recorded, use the SQL Editor instead rather than re-running the hire migration.

What it does:

- Every new account gets a `profiles` row with name, email, `membership_tier = 'free'` and `requested_tier` (the tier picked on `join.html`).
- Existing accounts (staff and hire customers) get a profile row too.
- Members can read only their own profile and can change only their own name. They **cannot** change their tier. Paid tiers stay `free` until billing is built. Then the Stripe webhook (service role) will set `membership_tier`.
- Until billing exists, you can set a member's tier by hand in the SQL Editor:
  `update public.profiles set membership_tier = 'silver' where email = 'someone@example.com';`

Check it worked: Table Editor → `profiles` shows one row per user under Authentication → Users.

## 5. Quick test after setup

1. Open `join.html` and create an account with your own email. Either you'll be asked to confirm (then click the link) or you'll go straight to the portal.
2. On `portal.html`, check that your email and name show at the top and the plan says "Free account". If you picked a paid tier, there's a note about billing.
3. Sign out. You should land on `login.html` with "You're signed out".
4. Try "Forgot password?". The email link should open `login.html` with a "Choose a new password" form.
5. Try "Continue with Google". It should go to Google and back to `portal.html`.
6. Staff check: `admin-login.html` still signs admins in to `admin.html` as before.

## For developers

- Code: `js/member-auth.js` handles Supabase. `js/member-portal.js` does the form checks and preview fallback. The client comes from `window.RTTHire.client()` in `js/hire-common.js`.
- `js/main.js` no longer forwards auth links on `login.html`, `join.html` and `portal.html` to `admin-login.html`. Those pages finish their own links. Every other page behaves as before.
- Database tests (throwaway local Postgres only):

```bash
createdb rtt_test
psql -v ON_ERROR_STOP=1 -d rtt_test -f supabase/tests/00_local_supabase_stub.sql \
  -f supabase/migrations/20261010000000_hire_system.sql \
  -f supabase/migrations/20261010120000_member_profiles.sql \
  -f supabase/tests/member_profiles_test.sql -f supabase/tests/hire_system_test.sql
```
