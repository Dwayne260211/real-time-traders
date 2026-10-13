-- Paid memberships (Stripe subscriptions). Tier/status are written ONLY by the stripe-webhook
-- Edge Function (service role) through apply_membership(); members can never set their own tier.

alter table public.profiles
  add column if not exists subscription_status text,
  add column if not exists current_period_end timestamptz,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists stripe_subscription_id text,
  add column if not exists stripe_price_id text;

-- Public, badge-only copy of the tier (null = no badge). Readable by everyone via pp_read.
alter table public.public_profiles add column if not exists member_tier text
  check (member_tier in ('basic','bronze','silver','gold'));

alter table public.marketplace_listings
  add column if not exists featured boolean not null default false,
  add column if not exists featured_at timestamptz;
create index if not exists ml_featured_idx on public.marketplace_listings (featured desc, created_at desc) where status = 'active';

-- Members may only edit their name on profiles; tier/billing columns are server-only.
revoke insert, update on public.profiles from anon, authenticated;
grant update (full_name, updated_at) on public.profiles to authenticated;
revoke update (member_tier) on public.public_profiles from anon, authenticated;
revoke insert (member_tier) on public.public_profiles from anon, authenticated;
revoke update (featured, featured_at) on public.marketplace_listings from anon, authenticated;
revoke insert (featured, featured_at) on public.marketplace_listings from anon, authenticated;

create or replace function public.listing_cap(p_tier text) returns int
language sql immutable as $$
  select case coalesce(p_tier, 'free')
    when 'gold' then null          -- unlimited (fair use)
    when 'silver' then 100
    when 'bronze' then 30
    else 10 end                    -- free and basic
$$;

create or replace function public.featured_allowance(p_tier text) returns int
language sql immutable as $$
  select case p_tier when 'gold' then 10 when 'silver' then 2 else 0 end
$$;

-- Belt and braces on top of column grants: only the service role / admins change these.
create or replace function public.public_profiles_before_write() returns trigger
language plpgsql security invoker set search_path = public as $$
begin
  new.updated_at := now();
  if new.avatar_path is not null and split_part(new.avatar_path, '/', 1) <> new.id::text then
    raise exception 'bad_avatar_path';
  end if;
  if current_user not in ('postgres','service_role','supabase_admin') then
    new.member_tier := case when tg_op = 'UPDATE' then old.member_tier else null end;
  end if;
  if tg_op = 'UPDATE' and old.id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) then
    if new.avatar_path is not null and new.avatar_path is distinct from old.avatar_path then raise exception 'not_allowed'; end if;
  end if;
  return new;
end $$;

create or replace function public.ml_before_write() returns trigger
language plpgsql security invoker set search_path = public as $$
declare n int; cap int; tier text; adm boolean := public.is_admin();
begin
  if tg_op = 'INSERT' then
    if (auth.uid() is null or new.owner <> auth.uid()) and not adm then raise exception 'not_allowed'; end if;
    if not adm then new.status := 'pending'; new.removed_reason := null; end if;
    if current_user not in ('postgres','service_role','supabase_admin') then new.featured := false; new.featured_at := null; end if;
  else
    new.owner := old.owner; new.created_at := old.created_at;
    if current_user not in ('postgres','service_role','supabase_admin')
       and coalesce(current_setting('rtt.featured_ok', true), '') <> '1' then
      new.featured := old.featured; new.featured_at := old.featured_at;
    end if;
    if not adm then
      new.removed_reason := old.removed_reason;
      if (new.title, new.description, new.category, new.price_cents, new.condition, new.suburb, new.contact_pref, new.photos)
         is distinct from (old.title, old.description, old.category, old.price_cents, old.condition, old.suburb, old.contact_pref, old.photos) then
        new.status := 'pending';
      elsif new.status is distinct from old.status then
        if not ((old.status = 'active' and new.status = 'sold') or (old.status = 'sold' and new.status = 'active')) then
          new.status := old.status;
        end if;
      end if;
    end if;
  end if;
  if new.status not in ('active','pending') then new.featured := false; end if;
  new.updated_at := now();
  if new.status in ('active','pending') and (tg_op = 'INSERT' or old.status not in ('active','pending')) then
    select membership_tier into tier from public.profiles where id = new.owner;
    cap := public.listing_cap(tier);
    if cap is not null then
      select count(*) into n from public.marketplace_listings
        where owner = new.owner and status in ('active','pending') and id <> new.id;
      if n >= cap then
        raise exception 'listing_limit_reached'
          using hint = format('Your plan allows up to %s active or pending listings. Upgrade on the Membership page for more.', cap);
      end if;
    end if;
  end if;
  return new;
end $$;

-- Owner marks/unmarks one of their active listings as Featured (Silver: 2/month, Gold: 10/month).
create or replace function public.set_listing_featured(p_listing_id uuid, p_featured boolean) returns boolean
language plpgsql security definer set search_path = public as $$
declare l public.marketplace_listings; tier text; used int; allow int;
begin
  select * into l from public.marketplace_listings where id = p_listing_id for update;
  if l.id is null or l.owner <> auth.uid() then raise exception 'not_allowed'; end if;
  if p_featured then
    if l.status <> 'active' then raise exception 'listing_not_active' using hint = 'Only live listings can be featured.'; end if;
    select membership_tier into tier from public.profiles where id = auth.uid();
    allow := public.featured_allowance(tier);
    if allow = 0 then raise exception 'featured_not_included' using hint = 'Featured listings come with Silver and Gold memberships.'; end if;
    if not l.featured then
      select count(*) into used from public.marketplace_listings
        where owner = auth.uid() and featured_at >= date_trunc('month', now() at time zone 'Australia/Brisbane') at time zone 'Australia/Brisbane';
      if used >= allow then raise exception 'featured_limit_reached' using hint = format('Your plan includes %s featured listings a month.', allow); end if;
    end if;
  end if;
  perform set_config('rtt.featured_ok', '1', true);
  update public.marketplace_listings
     set featured = p_featured, featured_at = case when p_featured and not l.featured then now() else featured_at end
   where id = p_listing_id;
  perform set_config('rtt.featured_ok', '', true);
  return p_featured;
end $$;
revoke all on function public.set_listing_featured(uuid, boolean) from public, anon;
grant execute on function public.set_listing_featured(uuid, boolean) to authenticated;

-- Called only by the stripe-webhook Edge Function (service role).
create or replace function public.apply_membership(
  p_user_id uuid, p_tier text, p_status text, p_period_end timestamptz,
  p_cancel_at_period_end boolean, p_subscription_id text, p_price_id text
) returns text
language plpgsql security definer set search_path = public as $$
declare eff text;
begin
  if p_tier is not null and p_tier not in ('basic','bronze','silver','gold') then raise exception 'bad_tier'; end if;
  -- A newer subscription replaces an older one; ignore stale events for a different, ended subscription.
  if exists (select 1 from public.profiles where id = p_user_id and stripe_subscription_id is not null
             and stripe_subscription_id <> p_subscription_id and subscription_status in ('active','trialing','past_due')
             and p_status not in ('active','trialing','past_due')) then
    return 'ignored_stale';
  end if;
  eff := case when p_status in ('active','trialing','past_due') then p_tier else 'free' end;
  if not exists (select 1 from auth.users where id = p_user_id) then raise exception 'unknown_user'; end if;
  -- profiles rows are not created at signup for every member, so create one on first subscription.
  insert into public.profiles (id, email, membership_tier, subscription_status, current_period_end,
                               cancel_at_period_end, stripe_subscription_id, stripe_price_id)
  select u.id, u.email, eff, p_status, p_period_end, coalesce(p_cancel_at_period_end, false), p_subscription_id, p_price_id
    from auth.users u where u.id = p_user_id
  on conflict (id) do update set membership_tier = excluded.membership_tier, subscription_status = excluded.subscription_status,
         current_period_end = excluded.current_period_end, cancel_at_period_end = excluded.cancel_at_period_end,
         stripe_subscription_id = excluded.stripe_subscription_id, stripe_price_id = excluded.stripe_price_id, updated_at = now();
  update public.public_profiles set member_tier = nullif(eff, 'free') where id = p_user_id;
  if public.featured_allowance(eff) = 0 then
    update public.marketplace_listings set featured = false where owner = p_user_id and featured;
  end if;
  return eff;
end $$;
revoke all on function public.apply_membership(uuid, text, text, timestamptz, boolean, text, text) from public, anon, authenticated;
grant execute on function public.apply_membership(uuid, text, text, timestamptz, boolean, text, text) to service_role;

create or replace function public.mark_membership_payment_failed(p_user_id uuid) returns void
language sql security definer set search_path = public as $$
  update public.profiles set subscription_status = 'past_due', updated_at = now() where id = p_user_id;
$$;
revoke all on function public.mark_membership_payment_failed(uuid) from public, anon, authenticated;
grant execute on function public.mark_membership_payment_failed(uuid) to service_role;
