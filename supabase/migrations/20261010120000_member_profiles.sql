-- =====================================================================
-- Real Time Traders: member profiles
-- Supabase (PostgreSQL 15+) migration. Additive: does not change any
-- hire system table, function or policy. Safe to run more than once,
-- either with `supabase db push` or by pasting it into the SQL Editor.
--
-- One row per auth user, created by a trigger when someone signs up
-- (email + password, email link or Google). The name comes from the
-- sign-up metadata (full_name, or name from Google).
--
-- Billing is not live yet, so membership_tier always starts as 'free'.
-- The tier picked on join.html is kept in requested_tier. Members can
-- only change their own full_name: the tier columns are changed by the
-- owner (SQL editor) or, later, by the Stripe webhook (service role).
-- =====================================================================

create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text check (char_length(full_name) <= 120),
  email           text check (char_length(email) <= 254),
  membership_tier text not null default 'free'
                  check (membership_tier in ('free', 'basic', 'bronze', 'silver', 'gold')),
  requested_tier  text check (requested_tier in ('free', 'basic', 'bronze', 'silver', 'gold')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
comment on table public.profiles is 'Member profile, one per auth user. Created by the on_auth_user_created_profile trigger.';
comment on column public.profiles.membership_tier is 'Paid tier in force. Stays free until billing confirms a payment (never set from the browser).';
comment on column public.profiles.requested_tier is 'Tier chosen at sign-up (join.html). Not paid for yet.';

-- public.set_updated_at() and public.is_admin() come from the hire system migration
-- (20261010000000_hire_system.sql), which runs first.
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- New auth user -> profile row
-- ---------------------------------------------------------------------
create or replace function public.handle_new_member()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  v_name text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), '');
  v_tier text := lower(coalesce(new.raw_user_meta_data ->> 'requested_tier', 'free'));
begin
  if v_tier not in ('free', 'basic', 'bronze', 'silver', 'gold') then v_tier := 'free'; end if;
  insert into public.profiles (id, full_name, email, membership_tier, requested_tier)
  values (new.id, left(v_name, 120), left(new.email, 254), 'free', v_tier)
  on conflict (id) do nothing;
  return new;
exception when others then
  -- Never block a sign-up because of the profile row; it can be added later.
  raise warning 'handle_new_member: profile not created for %: %', new.id, sqlerrm;
  return new;
end;
$$;
revoke execute on function public.handle_new_member() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
  for each row execute function public.handle_new_member();

-- Keep the stored email in step when a member changes it.
create or replace function public.sync_member_email()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.profiles set email = left(new.email, 254) where id = new.id;
  return new;
end;
$$;
revoke execute on function public.sync_member_email() from public, anon, authenticated;

drop trigger if exists on_auth_user_email_changed_profile on auth.users;
create trigger on_auth_user_email_changed_profile after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.sync_member_email();

-- Profiles for people who signed up before this migration (e.g. hire admins and customers).
insert into public.profiles (id, full_name, email)
select u.id,
       left(nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', '')), ''), 120),
       left(u.email, 254)
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Belt and braces on top of RLS: the public role cannot touch profiles at all, and members
-- can only change their name (not their tier or email).
revoke all on public.profiles from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Members read and update their own profile; admins can read all.
drop policy if exists "members read own profile" on public.profiles;
create policy "members read own profile" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
drop policy if exists "members update own profile" on public.profiles;
create policy "members update own profile" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
