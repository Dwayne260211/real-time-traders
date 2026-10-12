-- Member accounts: profile rows + saved card summaries (Stripe SetupIntents).
-- Never stores raw card data: only the Stripe customer id and a card summary (brand, last4, expiry).

-- ---------- member_profiles: one row per auth user ----------
create table if not exists public.member_profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text check (full_name is null or char_length(full_name) <= 120),
  phone      text check (phone is null or char_length(phone) <= 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.member_profiles enable row level security;

drop policy if exists "member_profiles: read own" on public.member_profiles;
create policy "member_profiles: read own" on public.member_profiles
  for select to authenticated using (id = auth.uid());
drop policy if exists "member_profiles: insert own" on public.member_profiles;
create policy "member_profiles: insert own" on public.member_profiles
  for insert to authenticated with check (id = auth.uid());
drop policy if exists "member_profiles: update own" on public.member_profiles;
create policy "member_profiles: update own" on public.member_profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
grant select, insert, update (full_name, phone, updated_at) on public.member_profiles to authenticated;

-- Create the profile automatically when someone signs up (email or Google).
create or replace function public.handle_new_member()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.member_profiles (id, full_name)
  values (new.id, nullif(left(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), 120), ''))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created_member on auth.users;
create trigger on_auth_user_created_member after insert on auth.users
  for each row execute function public.handle_new_member();

-- Backfill accounts created before this migration.
insert into public.member_profiles (id, full_name)
select u.id, nullif(left(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', ''), 120), '')
from auth.users u on conflict (id) do nothing;

-- ---------- member_stripe_customers: user -> Stripe customer (service role only) ----------
create table if not exists public.member_stripe_customers (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at         timestamptz not null default now()
);
alter table public.member_stripe_customers enable row level security;
-- No policies: only the service role (Edge Functions) can read or write.

-- ---------- member_payment_methods: card summary only ----------
create table if not exists public.member_payment_methods (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id       text not null,
  stripe_payment_method_id text not null unique,
  brand                    text,
  last4                    text check (last4 is null or last4 ~ '^[0-9]{4}$'),
  exp_month                smallint check (exp_month is null or exp_month between 1 and 12),
  exp_year                 smallint,
  livemode                 boolean not null default false,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index if not exists member_payment_methods_user_idx on public.member_payment_methods (user_id);
alter table public.member_payment_methods enable row level security;

drop policy if exists "member_payment_methods: read own" on public.member_payment_methods;
create policy "member_payment_methods: read own" on public.member_payment_methods
  for select to authenticated using (user_id = auth.uid());
-- No insert/update/delete policies: writes happen only through the service role
-- (stripe-webhook, remove-payment-method Edge Functions).
revoke insert, update, delete on public.member_payment_methods from anon, authenticated;
grant select on public.member_payment_methods to authenticated;
