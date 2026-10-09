-- =====================================================================
-- Real Time Traders: equipment hire system
-- Supabase (PostgreSQL 15+) migration. Run once on a new project, either
-- with `supabase db push` or by pasting it into the SQL Editor.
--
-- Ships with NO equipment, NO prices and NO hire policies. Every policy
-- field in hire_settings is NULL until the owner fills it in, and
-- online payments are OFF (payments_live = false).
--
-- Overlaps are stopped by the DATABASE, not the browser: confirmed
-- bookings, maintenance blocks and short-lived checkout holds are all
-- rows in public.equipment_holds, which has an exclusion constraint
-- (btree_gist) on (equipment_id, period).
-- =====================================================================

create extension if not exists btree_gist with schema extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------
create table public.user_roles (
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);
comment on table public.user_roles is 'Who is a hire admin. Add rows from the SQL editor only (see docs/hire-system-setup.md).';

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles r
    where r.user_id = auth.uid() and r.role = 'admin'
  );
$$;

-- Brisbane "today" (no daylight saving), used for date rules.
create or replace function public.hire_today()
returns date language sql stable set search_path = ''
as $$ select (now() at time zone 'Australia/Brisbane')::date $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at := now(); return new; end $$;

-- ---------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------
-- Categories are structure, not inventory.
create table public.hire_categories (
  slug        text primary key check (slug ~ '^[a-z0-9-]+$'),
  name        text not null,
  description text,
  sort_order  int  not null default 0
);
insert into public.hire_categories (slug, name, description, sort_order) values
  ('cleaning',    'Cleaning',                 'Pressure washers, carpet cleaners, wet & dry vacuums, steam cleaners and floor scrubbers.', 10),
  ('gardening',   'Gardening',                'Lawnmowers, whipper snippers, hedge trimmers, leaf blowers and chainsaws.', 20),
  ('power-tools', 'Power tools',              'Drills, impact drivers, grinders, sanders and demolition hammers.', 30),
  ('general',     'General',                  'Ladders, generators, extension leads and other general equipment.', 40),
  ('plant',       'Plant & portable toilets', 'Portable toilets and plant hire.', 50),
  ('trailers',    'Trailers',                 'Box, cage and car trailers.', 60);

create table public.equipment (
  id            uuid primary key default gen_random_uuid(),
  category      text not null references public.hire_categories(slug) on update cascade,
  name          text not null check (char_length(name) between 2 and 120),
  summary       text check (char_length(summary) <= 300),
  description   text check (char_length(description) <= 5000),
  specs         text check (char_length(specs) <= 3000),
  -- Owner approval: nothing is shown to the public until this is true.
  is_published  boolean not null default false,
  -- true = show the item but take enquiries by phone instead of online bookings.
  enquiry_only  boolean not null default false,
  sort_order    int not null default 0,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index equipment_category_idx on public.equipment (category) where is_published;
comment on column public.equipment.is_published is 'Owner approval flag. Unpublished items are invisible to the public (RLS).';

create or replace function public.equipment_publish_stamp()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.is_published and (tg_op = 'INSERT' or not old.is_published) then
    new.published_at := now();
  end if;
  return new;
end $$;
create trigger equipment_publish_stamp before insert or update of is_published on public.equipment
  for each row execute function public.equipment_publish_stamp();
create trigger equipment_updated_at before update on public.equipment
  for each row execute function public.set_updated_at();

create table public.equipment_photos (
  id           uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  storage_path text not null check (char_length(storage_path) <= 300),
  alt_text     text check (char_length(alt_text) <= 200),
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
create index equipment_photos_item_idx on public.equipment_photos (equipment_id, sort_order);

-- Rates in whole cents, AUD. Not GST registered, so no GST anywhere.
-- NULL = that rate is not offered.
create table public.equipment_rates (
  equipment_id  uuid primary key references public.equipment(id) on delete cascade,
  daily_cents   int check (daily_cents   > 0),
  weekend_cents int check (weekend_cents > 0),
  weekly_cents  int check (weekly_cents  > 0),
  updated_at    timestamptz not null default now()
);
create trigger equipment_rates_updated_at before update on public.equipment_rates
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Owner settings (single row). Every policy field is NULL by default.
-- ---------------------------------------------------------------------
create table public.hire_settings (
  id                         boolean primary key default true check (id),
  -- Owner's switch for online card payments. Off until authorised.
  payments_live              boolean not null default false,
  -- How prices are worked out (see calculate_hire_price). NULL = not approved yet:
  -- customers see an estimate and checkout is refused.
  pricing_rule               text check (pricing_rule in ('exact_period', 'customer_choice')),
  security_deposit_cents     int  check (security_deposit_cents >= 0),
  deposit_collected_online   boolean,
  deposit_terms              text check (char_length(deposit_terms) <= 3000),
  id_requirements            text check (char_length(id_requirements) <= 3000),
  pickup_options             text check (char_length(pickup_options) <= 3000),
  delivery_available         boolean,
  delivery_options           text check (char_length(delivery_options) <= 3000),
  late_return_policy         text check (char_length(late_return_policy) <= 3000),
  damage_policy              text check (char_length(damage_policy) <= 3000),
  cancellation_terms         text check (char_length(cancellation_terms) <= 3000),
  -- Optional automatic refunds. Both NULL = every paid cancellation goes to admin review.
  cancel_auto_refund_min_hours int check (cancel_auto_refund_min_hours >= 0),
  cancel_auto_refund_percent   int check (cancel_auto_refund_percent between 0 and 100),
  updated_at                 timestamptz not null default now(),
  updated_by                 uuid default auth.uid()
);
insert into public.hire_settings (id) values (true);
create trigger hire_settings_updated_at before update on public.hire_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Bookings, maintenance and holds
-- ---------------------------------------------------------------------
create table public.bookings (
  id                    uuid primary key default gen_random_uuid(),
  reference             text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  equipment_id          uuid not null references public.equipment(id) on delete restrict,
  equipment_name        text not null,               -- snapshot for the customer's history
  customer_id           uuid references auth.users(id) on delete set null,
  customer_name         text not null check (char_length(customer_name) between 1 and 120),
  customer_email        text not null check (char_length(customer_email) <= 254),
  customer_phone        text check (char_length(customer_phone) <= 40),
  -- Inclusive dates: hire starts on start_date and the item is back on end_date.
  start_date            date not null,
  end_date              date not null,
  hire_days             int generated always as (end_date - start_date + 1) stored,
  rate_type             text check (rate_type in ('daily', 'weekend', 'weekly')),
  pricing_rule          text,
  price_breakdown       jsonb,
  hire_total_cents      int check (hire_total_cents >= 0),  -- NULL = price to be confirmed
  deposit_cents         int check (deposit_cents >= 0),
  discount_percent      numeric(5,2) not null default 0 check (discount_percent between 0 and 100),
  fulfilment            text check (fulfilment in ('pickup', 'delivery')),
  delivery_address      text check (char_length(delivery_address) <= 300),
  customer_notes        text check (char_length(customer_notes) <= 1000),
  admin_notes           text check (char_length(admin_notes) <= 4000),
  status                text not null default 'pending'
                          check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status        text not null default 'unpaid'
                          check (payment_status in ('unpaid', 'checkout_open', 'paid', 'paid_conflict',
                                                    'refund_pending', 'refunded', 'partially_refunded')),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id   text,
  amount_paid_cents     int check (amount_paid_cents >= 0),
  amount_refunded_cents int not null default 0 check (amount_refunded_cents >= 0),
  cancel_requested_at   timestamptz,
  cancel_reason         text check (char_length(cancel_reason) <= 1000),
  confirmed_at          timestamptz,
  cancelled_at          timestamptz,
  completed_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  check (end_date >= start_date),
  check (end_date - start_date < 366)
);
create index bookings_customer_idx on public.bookings (customer_id, start_date desc);
create index bookings_equipment_idx on public.bookings (equipment_id, start_date);
create index bookings_status_idx on public.bookings (status, start_date);
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

create table public.maintenance_blocks (
  id           uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  start_date   date not null,
  end_date     date not null,
  reason       text check (char_length(reason) <= 500),
  created_by   uuid default auth.uid(),
  created_at   timestamptz not null default now(),
  check (end_date >= start_date)
);

-- Every period that makes an item unavailable. The exclusion constraint
-- below is what makes double bookings impossible.
create table public.equipment_holds (
  id             uuid primary key default gen_random_uuid(),
  equipment_id   uuid not null references public.equipment(id) on delete cascade,
  period         daterange not null check (not isempty(period)),
  kind           text not null check (kind in ('booking', 'checkout', 'maintenance')),
  booking_id     uuid unique references public.bookings(id) on delete cascade,
  maintenance_id uuid unique references public.maintenance_blocks(id) on delete cascade,
  expires_at     timestamptz,           -- only for kind = 'checkout'
  created_at     timestamptz not null default now(),
  check ((kind = 'maintenance') = (maintenance_id is not null)),
  check ((kind in ('booking', 'checkout')) = (booking_id is not null)),
  check ((kind = 'checkout') = (expires_at is not null)),
  constraint equipment_holds_no_overlap
    exclude using gist (equipment_id with =, period with &&)
);
comment on constraint equipment_holds_no_overlap on public.equipment_holds is
  'No two confirmed bookings, maintenance blocks or live checkout holds may overlap for the same item.';

-- Clear checkout holds whose Stripe session has expired, so they stop blocking.
create or replace function public.purge_expired_holds(p_equipment_id uuid)
returns void language sql security definer set search_path = ''
as $$
  delete from public.equipment_holds
  where equipment_id = p_equipment_id and kind = 'checkout' and expires_at < now();
$$;

-- Keep holds in step with booking status.
create or replace function public.sync_booking_hold()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.status in ('confirmed', 'completed') then
    perform public.purge_expired_holds(new.equipment_id);
    insert into public.equipment_holds (equipment_id, period, kind, booking_id)
    values (new.equipment_id, daterange(new.start_date, new.end_date, '[]'), 'booking', new.id)
    on conflict (booking_id) do update
      set equipment_id = excluded.equipment_id, period = excluded.period,
          kind = 'booking', expires_at = null;
    if new.status = 'confirmed' and (tg_op = 'INSERT' or old.status is distinct from 'confirmed') then
      new.confirmed_at := coalesce(new.confirmed_at, now());
    end if;
    if new.status = 'completed' then new.completed_at := coalesce(new.completed_at, now()); end if;
  elsif new.status = 'cancelled' then
    delete from public.equipment_holds where booking_id = new.id;
    new.cancelled_at := coalesce(new.cancelled_at, now());
  else -- pending: drop a booking hold, keep any live checkout hold
    delete from public.equipment_holds where booking_id = new.id and kind = 'booking';
    update public.equipment_holds
       set equipment_id = new.equipment_id, period = daterange(new.start_date, new.end_date, '[]')
     where booking_id = new.id and kind = 'checkout';
  end if;
  return new;
end $$;
-- Updates use a BEFORE trigger and inserts an AFTER trigger (the hold references the
-- booking row). Either way the hold and the status change succeed or fail together.
create or replace function public.sync_booking_hold_after_insert()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.status in ('confirmed', 'completed') then
    perform public.purge_expired_holds(new.equipment_id);
    insert into public.equipment_holds (equipment_id, period, kind, booking_id)
    values (new.equipment_id, daterange(new.start_date, new.end_date, '[]'), 'booking', new.id);
  end if;
  return null;
end $$;
create or replace function public.stamp_booking_status()
returns trigger language plpgsql set search_path = ''
as $$
begin
  if new.status = 'confirmed' then new.confirmed_at := coalesce(new.confirmed_at, now()); end if;
  if new.status = 'completed' then new.completed_at := coalesce(new.completed_at, now()); end if;
  if new.status = 'cancelled' then new.cancelled_at := coalesce(new.cancelled_at, now()); end if;
  return new;
end $$;
create trigger bookings_stamp_status before insert on public.bookings
  for each row execute function public.stamp_booking_status();
create trigger bookings_hold_on_insert after insert on public.bookings
  for each row execute function public.sync_booking_hold_after_insert();
create trigger bookings_hold_on_update before update of status, start_date, end_date, equipment_id on public.bookings
  for each row execute function public.sync_booking_hold();

create or replace function public.sync_maintenance_hold()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  perform public.purge_expired_holds(new.equipment_id);
  insert into public.equipment_holds (equipment_id, period, kind, maintenance_id)
  values (new.equipment_id, daterange(new.start_date, new.end_date, '[]'), 'maintenance', new.id)
  on conflict (maintenance_id) do update
    set equipment_id = excluded.equipment_id, period = excluded.period;
  return null;
end $$;
create trigger maintenance_hold after insert or update on public.maintenance_blocks
  for each row execute function public.sync_maintenance_hold();

-- ---------------------------------------------------------------------
-- Condition reports
-- ---------------------------------------------------------------------
create table public.condition_reports (
  id           uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment(id) on delete cascade,
  booking_id   uuid references public.bookings(id) on delete set null,
  stage        text not null check (stage in ('before_hire', 'on_return', 'maintenance', 'other')),
  condition    text not null check (condition in ('good', 'minor_wear', 'damaged', 'needs_service', 'out_of_service')),
  notes        text check (char_length(notes) <= 4000),
  recorded_by  uuid default auth.uid(),
  recorded_at  timestamptz not null default now()
);
create index condition_reports_item_idx on public.condition_reports (equipment_id, recorded_at desc);

create table public.condition_report_photos (
  id           uuid primary key default gen_random_uuid(),
  report_id    uuid not null references public.condition_reports(id) on delete cascade,
  storage_path text not null check (char_length(storage_path) <= 300),
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Server-only bookkeeping (Edge Functions use the service role)
-- ---------------------------------------------------------------------
create table public.stripe_events (
  id          text primary key,
  type        text not null,
  received_at timestamptz not null default now()
);
create table public.email_log (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  kind       text not null,
  sent_at    timestamptz not null default now(),
  unique (booking_id, kind)
);

-- ---------------------------------------------------------------------
-- Pricing
-- ---------------------------------------------------------------------
-- Documented rules (owner chooses one in hire_settings.pricing_rule):
--
--  'exact_period' (also used for ESTIMATES while no rule is approved)
--     * Saturday start + Sunday end (2 days) and a weekend rate is set -> weekend rate
--     * otherwise, a whole number of weeks (7, 14, 21 ... days) and a weekly rate is set
--       -> weeks x weekly rate
--     * otherwise days x daily rate
--     * no applicable rate -> NULL (price on request)
--
--  'customer_choice' (the customer picks the rate type)
--     * daily   -> days x daily rate
--     * weekend -> only for a Saturday-to-Sunday hire; 1 x weekend rate
--     * weekly  -> weeks rounded up x weekly rate
--
-- Days are counted inclusively: 1 Mar to 1 Mar is 1 day, 1 Mar to 3 Mar is 3 days.
-- No GST is added. Member discounts are not applied automatically yet.
create or replace function public.calculate_hire_price(
  p_daily int, p_weekend int, p_weekly int,
  p_start date, p_end date, p_rule text, p_rate_type text default null)
returns jsonb
language plpgsql immutable set search_path = ''
as $$
declare
  v_days  int := p_end - p_start + 1;
  v_rule  text := coalesce(p_rule, 'exact_period');
  v_is_weekend boolean := v_days = 2 and extract(isodow from p_start) = 6;
  v_type  text;
  v_units int;
  v_unit  int;
begin
  if p_start is null or p_end is null or p_end < p_start then
    return jsonb_build_object('ok', false, 'reason', 'invalid_dates');
  end if;

  if v_rule = 'exact_period' then
    if v_is_weekend and p_weekend is not null then
      v_type := 'weekend'; v_units := 1; v_unit := p_weekend;
    elsif v_days % 7 = 0 and p_weekly is not null then
      v_type := 'weekly'; v_units := v_days / 7; v_unit := p_weekly;
    elsif p_daily is not null then
      v_type := 'daily'; v_units := v_days; v_unit := p_daily;
    end if;
  elsif v_rule = 'customer_choice' then
    v_type := coalesce(p_rate_type, 'daily');
    if v_type = 'daily' and p_daily is not null then
      v_units := v_days; v_unit := p_daily;
    elsif v_type = 'weekend' then
      if not v_is_weekend then
        return jsonb_build_object('ok', false, 'reason', 'weekend_rate_needs_sat_to_sun', 'days', v_days);
      end if;
      if p_weekend is not null then v_units := 1; v_unit := p_weekend; end if;
    elsif v_type = 'weekly' and p_weekly is not null then
      v_units := ceil(v_days / 7.0)::int; v_unit := p_weekly;
    end if;
  else
    return jsonb_build_object('ok', false, 'reason', 'unknown_rule');
  end if;

  if v_unit is null then
    return jsonb_build_object('ok', true, 'days', v_days, 'rule', v_rule, 'rate_type', v_type,
                              'total_cents', null, 'reason', 'price_on_request');
  end if;
  return jsonb_build_object('ok', true, 'days', v_days, 'rule', v_rule, 'rate_type', v_type,
                            'units', v_units, 'unit_cents', v_unit,
                            'total_cents', v_units * v_unit);
end $$;

-- Can the public (or an admin) see this item?
create or replace function public.equipment_visible(p_equipment_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.equipment e
                 where e.id = p_equipment_id and (e.is_published or public.is_admin()));
$$;

-- ---------------------------------------------------------------------
-- Availability (public, published items only)
-- ---------------------------------------------------------------------
create or replace function public.check_availability(p_equipment_id uuid, p_start date, p_end date)
returns boolean
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.equipment_visible(p_equipment_id) then
    raise exception 'equipment_not_found' using errcode = 'P0002';
  end if;
  if p_start is null or p_end is null or p_end < p_start then
    raise exception 'invalid_dates' using errcode = '22023';
  end if;
  return not exists (
    select 1 from public.equipment_holds h
    where h.equipment_id = p_equipment_id
      and h.period && daterange(p_start, p_end, '[]')
      and (h.kind <> 'checkout' or h.expires_at > now())
  );
end $$;

-- Unavailable date ranges (inclusive) in a window. Says nothing about who or why.
create or replace function public.get_unavailable_periods(p_equipment_id uuid, p_from date, p_to date)
returns table (start_date date, end_date date)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.equipment_visible(p_equipment_id) then
    raise exception 'equipment_not_found' using errcode = 'P0002';
  end if;
  if p_to - p_from > 400 then
    raise exception 'window_too_long' using errcode = '22023';
  end if;
  return query
    select greatest(lower(h.period), p_from), least(upper(h.period) - 1, p_to)
    from public.equipment_holds h
    where h.equipment_id = p_equipment_id
      and h.period && daterange(p_from, p_to, '[]')
      and (h.kind <> 'checkout' or h.expires_at > now())
    order by 1;
end $$;

-- Price quote + availability for the booking form.
create or replace function public.quote_hire(p_equipment_id uuid, p_start date, p_end date, p_rate_type text default null)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare
  r public.equipment_rates;
  s public.hire_settings;
  v_price jsonb;
begin
  if not public.equipment_visible(p_equipment_id) then
    raise exception 'equipment_not_found' using errcode = 'P0002';
  end if;
  select * into r from public.equipment_rates where equipment_id = p_equipment_id;
  select * into s from public.hire_settings where id;
  v_price := public.calculate_hire_price(r.daily_cents, r.weekend_cents, r.weekly_cents,
                                         p_start, p_end, s.pricing_rule, p_rate_type);
  return v_price || jsonb_build_object(
    'available', case when (v_price ->> 'ok')::boolean
                      then public.check_availability(p_equipment_id, p_start, p_end) end,
    'pricing_rule_approved', s.pricing_rule is not null,
    'deposit_cents', s.security_deposit_cents,
    'payments_live', s.payments_live
  );
end $$;

-- ---------------------------------------------------------------------
-- Customer booking request (signed-in customers only)
-- Creates a PENDING request. Only an admin approval or a paid Stripe
-- checkout (via the webhook) can confirm it.
-- ---------------------------------------------------------------------
create or replace function public.request_booking(
  p_equipment_id uuid, p_start date, p_end date,
  p_customer_name text, p_customer_phone text default null,
  p_rate_type text default null, p_fulfilment text default null,
  p_delivery_address text default null, p_notes text default null)
returns public.bookings
language plpgsql volatile security definer set search_path = ''
as $$
declare
  v_uid   uuid := auth.uid();
  v_email text;
  e       public.equipment;
  v_quote jsonb;
  v_open  int;
  b       public.bookings;
begin
  if v_uid is null then
    raise exception 'sign_in_required' using errcode = '42501';
  end if;
  select email into v_email from auth.users where id = v_uid;
  v_email := coalesce(v_email, auth.jwt() ->> 'email');
  if v_email is null then raise exception 'email_required' using errcode = '22023'; end if;

  select * into e from public.equipment where id = p_equipment_id and is_published;
  if not found then raise exception 'equipment_not_found' using errcode = 'P0002'; end if;
  if e.enquiry_only then raise exception 'enquiry_only' using errcode = '22023'; end if;

  if p_start is null or p_end is null or p_end < p_start then
    raise exception 'invalid_dates' using errcode = '22023';
  end if;
  if p_start < public.hire_today() then raise exception 'start_in_past' using errcode = '22023'; end if;
  if p_end - p_start >= 366 then raise exception 'period_too_long' using errcode = '22023'; end if;
  if p_fulfilment is not null and p_fulfilment not in ('pickup', 'delivery') then
    raise exception 'invalid_fulfilment' using errcode = '22023';
  end if;
  if nullif(trim(coalesce(p_customer_name, '')), '') is null then
    raise exception 'name_required' using errcode = '22023';
  end if;

  select count(*) into v_open from public.bookings
   where customer_id = v_uid and status = 'pending';
  if v_open >= 5 then raise exception 'too_many_pending_requests' using errcode = '22023'; end if;

  v_quote := public.quote_hire(p_equipment_id, p_start, p_end, p_rate_type);
  if not (v_quote ->> 'ok')::boolean then
    raise exception '%', v_quote ->> 'reason' using errcode = '22023';
  end if;
  if not (v_quote ->> 'available')::boolean then
    raise exception 'dates_unavailable' using errcode = '23P01';
  end if;

  insert into public.bookings (equipment_id, equipment_name, customer_id, customer_name, customer_email,
                               customer_phone, start_date, end_date, rate_type, pricing_rule,
                               price_breakdown, hire_total_cents, deposit_cents, fulfilment,
                               delivery_address, customer_notes, status, payment_status)
  values (e.id, e.name, v_uid, left(trim(p_customer_name), 120), v_email,
          left(nullif(trim(coalesce(p_customer_phone, '')), ''), 40), p_start, p_end,
          v_quote ->> 'rate_type', v_quote ->> 'rule', v_quote,
          (v_quote ->> 'total_cents')::int, (v_quote ->> 'deposit_cents')::int, p_fulfilment,
          left(nullif(trim(coalesce(p_delivery_address, '')), ''), 300),
          left(nullif(trim(coalesce(p_notes, '')), ''), 1000), 'pending', 'unpaid')
  returning * into b;
  return b;
end $$;

-- ---------------------------------------------------------------------
-- Service-role functions used by the Edge Functions
-- ---------------------------------------------------------------------

-- Re-price on the server and hold the dates while the customer pays.
create or replace function public.begin_checkout(p_booking_id uuid, p_user_id uuid, p_hold_minutes int default 35)
returns jsonb
language plpgsql volatile security definer set search_path = ''
as $$
declare
  b public.bookings;
  e public.equipment;
  r public.equipment_rates;
  s public.hire_settings;
  v_price jsonb;
  v_total int;
  v_deposit int;
  v_expires timestamptz := now() + make_interval(mins => greatest(p_hold_minutes, 31));
begin
  select * into s from public.hire_settings where id;
  select * into b from public.bookings where id = p_booking_id for update;
  if not found or b.customer_id is distinct from p_user_id then
    raise exception 'booking_not_found' using errcode = 'P0002';
  end if;
  if b.status <> 'pending' or b.payment_status not in ('unpaid', 'checkout_open') then
    raise exception 'booking_not_payable' using errcode = '22023';
  end if;
  if s.pricing_rule is null then raise exception 'pricing_rule_not_approved' using errcode = '22023'; end if;
  if b.start_date < public.hire_today() then raise exception 'start_in_past' using errcode = '22023'; end if;

  select * into e from public.equipment where id = b.equipment_id;
  if not e.is_published or e.enquiry_only then raise exception 'equipment_not_bookable' using errcode = '22023'; end if;
  select * into r from public.equipment_rates where equipment_id = b.equipment_id;

  v_price := public.calculate_hire_price(r.daily_cents, r.weekend_cents, r.weekly_cents,
                                         b.start_date, b.end_date, s.pricing_rule, b.rate_type);
  v_total := (v_price ->> 'total_cents')::int;
  if not (v_price ->> 'ok')::boolean or v_total is null or v_total <= 0 then
    raise exception 'price_not_available' using errcode = '22023';
  end if;
  v_total := round(v_total * (100 - b.discount_percent) / 100.0)::int;
  v_deposit := case when s.deposit_collected_online is true then s.security_deposit_cents end;

  perform public.purge_expired_holds(b.equipment_id);
  begin
    insert into public.equipment_holds (equipment_id, period, kind, booking_id, expires_at)
    values (b.equipment_id, daterange(b.start_date, b.end_date, '[]'), 'checkout', b.id, v_expires)
    on conflict (booking_id) do update set expires_at = excluded.expires_at, period = excluded.period;
  exception when exclusion_violation then
    raise exception 'dates_unavailable' using errcode = '23P01';
  end;

  update public.bookings
     set hire_total_cents = v_total, deposit_cents = v_deposit, price_breakdown = v_price,
         pricing_rule = s.pricing_rule, payment_status = 'checkout_open'
   where id = b.id;

  return jsonb_build_object(
    'booking_id', b.id, 'reference', b.reference, 'equipment_name', e.name,
    'start_date', b.start_date, 'end_date', b.end_date, 'days', b.hire_days,
    'hire_total_cents', v_total, 'deposit_cents', v_deposit,
    'customer_email', b.customer_email,
    'expires_at', extract(epoch from v_expires)::bigint - 300,   -- Stripe session ends 5 min before the hold
    'payments_live_setting', s.payments_live);
end $$;

create or replace function public.attach_checkout_session(p_booking_id uuid, p_session_id text)
returns void language sql volatile security definer set search_path = ''
as $$
  update public.bookings set stripe_checkout_session_id = p_session_id where id = p_booking_id;
$$;

create or replace function public.release_checkout(p_booking_id uuid)
returns void language plpgsql volatile security definer set search_path = ''
as $$
begin
  delete from public.equipment_holds where booking_id = p_booking_id and kind = 'checkout';
  update public.bookings set payment_status = 'unpaid'
   where id = p_booking_id and payment_status = 'checkout_open';
end $$;

-- Called by the Stripe webhook after a successful payment.
-- Returns 'confirmed', 'already_confirmed', 'conflict' (paid but the dates are no longer
-- free: needs admin review/refund) or 'not_found'.
create or replace function public.confirm_paid_booking(
  p_booking_id uuid, p_session_id text, p_payment_intent text, p_amount_cents int)
returns text
language plpgsql volatile security definer set search_path = ''
as $$
declare
  b public.bookings;
begin
  select * into b from public.bookings where id = p_booking_id for update;
  if not found then return 'not_found'; end if;
  if b.payment_status = 'paid' and b.status in ('confirmed', 'completed') then return 'already_confirmed'; end if;

  update public.bookings
     set payment_status = 'paid', amount_paid_cents = p_amount_cents,
         stripe_checkout_session_id = coalesce(p_session_id, stripe_checkout_session_id),
         stripe_payment_intent_id = p_payment_intent
   where id = b.id;

  if b.status <> 'pending' then
    update public.bookings set payment_status = 'paid_conflict',
           admin_notes = concat_ws(E'\n', admin_notes, 'Payment received for a booking that was already ' || b.status || '. Review and refund if needed.')
     where id = b.id;
    return 'conflict';
  end if;

  begin
    update public.bookings set status = 'confirmed' where id = b.id;
  exception when exclusion_violation then
    delete from public.equipment_holds where booking_id = b.id;
    update public.bookings set payment_status = 'paid_conflict',
           admin_notes = concat_ws(E'\n', admin_notes, 'Payment received but the dates clash with another booking or maintenance block. Review and refund if needed.')
     where id = b.id;
    return 'conflict';
  end;
  return 'confirmed';
end $$;

-- Cancellation decision. Applies the owner's configured terms; with no terms,
-- anything already paid or confirmed goes to admin review (no automatic refund).
-- Returns {action: 'cancelled' | 'refund' | 'review', refund_cents, payment_intent, ...}
create or replace function public.decide_cancellation(
  p_booking_id uuid, p_user_id uuid, p_reason text default null, p_as_admin boolean default false)
returns jsonb
language plpgsql volatile security definer set search_path = ''
as $$
declare
  b public.bookings;
  s public.hire_settings;
  v_hours numeric;
  v_refund int;
  v_terms boolean;
begin
  select * into b from public.bookings where id = p_booking_id for update;
  if not found or (not p_as_admin and b.customer_id is distinct from p_user_id) then
    raise exception 'booking_not_found' using errcode = 'P0002';
  end if;
  if b.status in ('cancelled', 'completed') then
    raise exception 'booking_not_cancellable' using errcode = '22023';
  end if;
  select * into s from public.hire_settings where id;
  v_terms := s.cancel_auto_refund_min_hours is not null and s.cancel_auto_refund_percent is not null;
  v_hours := extract(epoch from ((b.start_date::timestamp at time zone 'Australia/Brisbane') - now())) / 3600;

  -- Nothing paid and not yet confirmed: just a request, cancel straight away.
  if b.status = 'pending' and b.payment_status in ('unpaid', 'checkout_open') then
    update public.bookings set status = 'cancelled', payment_status = 'unpaid',
           cancel_reason = left(p_reason, 1000) where id = b.id;
    return jsonb_build_object('action', 'cancelled', 'refund_cents', 0,
                              'checkout_session', b.stripe_checkout_session_id);
  end if;

  if v_terms and v_hours >= s.cancel_auto_refund_min_hours then
    if b.payment_status = 'paid' and coalesce(b.amount_paid_cents, 0) > 0 then
      v_refund := round(b.amount_paid_cents * s.cancel_auto_refund_percent / 100.0)::int;
      update public.bookings set status = 'cancelled',
             payment_status = case when v_refund > 0 then 'refund_pending' else 'paid' end,
             cancel_reason = left(p_reason, 1000) where id = b.id;
      return jsonb_build_object('action', case when v_refund > 0 then 'refund' else 'cancelled' end,
                                'refund_cents', v_refund, 'payment_intent', b.stripe_payment_intent_id,
                                'percent', s.cancel_auto_refund_percent);
    elsif b.payment_status = 'unpaid' then
      update public.bookings set status = 'cancelled', cancel_reason = left(p_reason, 1000) where id = b.id;
      return jsonb_build_object('action', 'cancelled', 'refund_cents', 0);
    end if;
  end if;

  update public.bookings set cancel_requested_at = now(), cancel_reason = left(p_reason, 1000) where id = b.id;
  return jsonb_build_object('action', 'review', 'refund_cents', 0,
                            'reason', case when not v_terms then 'no_cancellation_terms_configured'
                                           when v_hours < s.cancel_auto_refund_min_hours then 'inside_cancellation_window'
                                           else 'needs_review' end);
end $$;

create or replace function public.record_refund(p_booking_id uuid, p_refund_cents int, p_ok boolean, p_note text default null)
returns void language plpgsql volatile security definer set search_path = ''
as $$
begin
  if p_ok then
    update public.bookings
       set amount_refunded_cents = amount_refunded_cents + p_refund_cents,
           payment_status = case when amount_refunded_cents + p_refund_cents >= coalesce(amount_paid_cents, 0)
                                 then 'refunded' else 'partially_refunded' end
     where id = p_booking_id;
  else
    update public.bookings
       set admin_notes = concat_ws(E'\n', admin_notes, 'Automatic refund failed: ' || coalesce(p_note, 'unknown error'))
     where id = p_booking_id;
  end if;
end $$;

create or replace function public.claim_email(p_booking_id uuid, p_kind text)
returns boolean language plpgsql volatile security definer set search_path = ''
as $$
begin
  insert into public.email_log (booking_id, kind) values (p_booking_id, p_kind);
  return true;
exception when unique_violation then
  return false;
end $$;

create or replace function public.record_stripe_event(p_id text, p_type text)
returns boolean language plpgsql volatile security definer set search_path = ''
as $$
begin
  insert into public.stripe_events (id, type) values (p_id, p_type);
  return true;
exception when unique_violation then
  return false;
end $$;

-- Lock the service-only functions down (Supabase grants EXECUTE to everyone by default).
revoke execute on function public.begin_checkout(uuid, uuid, int)              from public, anon, authenticated;
revoke execute on function public.attach_checkout_session(uuid, text)           from public, anon, authenticated;
revoke execute on function public.release_checkout(uuid)                        from public, anon, authenticated;
revoke execute on function public.confirm_paid_booking(uuid, text, text, int)   from public, anon, authenticated;
revoke execute on function public.decide_cancellation(uuid, uuid, text, boolean) from public, anon, authenticated;
revoke execute on function public.record_refund(uuid, int, boolean, text)       from public, anon, authenticated;
revoke execute on function public.claim_email(uuid, text)                       from public, anon, authenticated;
revoke execute on function public.record_stripe_event(text, text)               from public, anon, authenticated;
revoke execute on function public.purge_expired_holds(uuid)                     from public, anon, authenticated;
revoke execute on function public.request_booking(uuid, date, date, text, text, text, text, text, text) from public, anon;
grant  execute on function public.begin_checkout(uuid, uuid, int), public.attach_checkout_session(uuid, text),
                           public.release_checkout(uuid), public.confirm_paid_booking(uuid, text, text, int),
                           public.decide_cancellation(uuid, uuid, text, boolean), public.record_refund(uuid, int, boolean, text),
                           public.claim_email(uuid, text), public.record_stripe_event(text, text),
                           public.purge_expired_holds(uuid)
  to service_role;
grant execute on function public.request_booking(uuid, date, date, text, text, text, text, text, text) to authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.user_roles              enable row level security;
alter table public.hire_categories         enable row level security;
alter table public.equipment               enable row level security;
alter table public.equipment_photos        enable row level security;
alter table public.equipment_rates         enable row level security;
alter table public.hire_settings           enable row level security;
alter table public.bookings                enable row level security;
alter table public.maintenance_blocks      enable row level security;
alter table public.equipment_holds         enable row level security;
alter table public.condition_reports       enable row level security;
alter table public.condition_report_photos enable row level security;
alter table public.stripe_events           enable row level security;
alter table public.email_log               enable row level security;

-- Belt and braces on top of RLS: the public role cannot touch private tables at all.
revoke all on public.bookings, public.maintenance_blocks, public.equipment_holds,
              public.condition_reports, public.condition_report_photos, public.user_roles,
              public.stripe_events, public.email_log
  from anon;
revoke all on public.stripe_events, public.email_log from authenticated;
revoke insert, update, delete on public.hire_categories, public.equipment, public.equipment_photos,
                                 public.equipment_rates, public.hire_settings
  from anon;

-- Roles: you can see your own role; admins see all. Rows are added from the SQL editor.
create policy "own role readable" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Categories: public read, admin write.
create policy "categories public read" on public.hire_categories for select to anon, authenticated using (true);
create policy "categories admin write" on public.hire_categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Equipment: the public only ever sees published items.
create policy "published equipment readable" on public.equipment for select to anon, authenticated
  using (is_published or public.is_admin());
create policy "equipment admin write" on public.equipment for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "photos of published equipment readable" on public.equipment_photos for select to anon, authenticated
  using (public.is_admin() or exists (select 1 from public.equipment e where e.id = equipment_id and e.is_published));
create policy "photos admin write" on public.equipment_photos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "rates of published equipment readable" on public.equipment_rates for select to anon, authenticated
  using (public.is_admin() or exists (select 1 from public.equipment e where e.id = equipment_id and e.is_published));
create policy "rates admin write" on public.equipment_rates for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Settings: customers need to read the terms; only admins change them.
create policy "settings public read" on public.hire_settings for select to anon, authenticated using (true);
create policy "settings admin update" on public.hire_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Bookings: customers read their own; changes go through request_booking / Edge Functions.
create policy "customers read own bookings" on public.bookings for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());
create policy "admins manage bookings" on public.bookings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admins manage maintenance" on public.maintenance_blocks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "admins read holds" on public.equipment_holds for select to authenticated
  using (public.is_admin());

create policy "admins manage condition reports" on public.condition_reports for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "customers read reports on own bookings" on public.condition_reports for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = booking_id and b.customer_id = auth.uid()));
create policy "admins manage condition photos" on public.condition_report_photos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: public bucket for catalogue photos, private bucket for
-- condition-report photos. Only admins can upload, change or delete.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('equipment-photos', 'equipment-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
       ('condition-photos', 'condition-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "hire admins upload photos" on storage.objects for insert to authenticated
  with check (bucket_id in ('equipment-photos', 'condition-photos') and public.is_admin());
create policy "hire admins update photos" on storage.objects for update to authenticated
  using (bucket_id in ('equipment-photos', 'condition-photos') and public.is_admin());
create policy "hire admins delete photos" on storage.objects for delete to authenticated
  using (bucket_id in ('equipment-photos', 'condition-photos') and public.is_admin());
create policy "hire admins read photos" on storage.objects for select to authenticated
  using (bucket_id in ('equipment-photos', 'condition-photos') and public.is_admin());
