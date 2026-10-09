-- SQL tests for the hire system. Runs inside one transaction and rolls back,
-- so it leaves no data behind. Every fixture below is TEST DATA ONLY.
--   psql -v ON_ERROR_STOP=1 -f supabase/tests/hire_system_test.sql
-- Each check prints "PASS ..."; any failure raises and stops the run.
\set ON_ERROR_STOP 1
begin;

create temp table _results (n serial, name text) on commit drop;
grant all on _results to anon, authenticated, service_role;
grant usage on sequence _results_n_seq to anon, authenticated, service_role;
create or replace function pg_temp.pass(t text) returns void language plpgsql as $$
begin insert into _results(name) values (t); raise notice 'PASS %', t; end $$;

-- ---------- fixtures (test only) ----------
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'customer-a@test.invalid'),
  ('00000000-0000-0000-0000-00000000000b', 'customer-b@test.invalid'),
  ('00000000-0000-0000-0000-0000000000ad', 'admin@test.invalid');
insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000ad', 'admin');
insert into public.equipment (id, category, name, is_published) values
  ('10000000-0000-0000-0000-000000000001', 'cleaning',  'TEST ITEM published', true),
  ('10000000-0000-0000-0000-000000000002', 'gardening', 'TEST ITEM unpublished', false),
  ('10000000-0000-0000-0000-000000000003', 'general',   'TEST ITEM enquiry only', true);
update public.equipment set enquiry_only = true where id = '10000000-0000-0000-0000-000000000003';
insert into public.equipment_rates (equipment_id, daily_cents, weekend_cents, weekly_cents) values
  ('10000000-0000-0000-0000-000000000001', 1000, 1500, 5000),
  ('10000000-0000-0000-0000-000000000002', 2000, null, null);

-- Settings ship empty: no policy defaults.
do $$ declare s public.hire_settings; begin
  select * into s from public.hire_settings;
  assert s.payments_live = false, 'payments must default to off';
  assert s.pricing_rule is null and s.security_deposit_cents is null and s.deposit_collected_online is null
     and s.id_requirements is null and s.pickup_options is null and s.delivery_available is null
     and s.delivery_options is null and s.late_return_policy is null and s.damage_policy is null
     and s.cancellation_terms is null and s.cancel_auto_refund_min_hours is null
     and s.cancel_auto_refund_percent is null and s.deposit_terms is null, 'policy fields must default to NULL';
  assert (select count(*) from public.equipment where name not like 'TEST ITEM%') = 0, 'migration must not ship inventory';
  perform pg_temp.pass('settings ship with no policy values, payments off, no inventory');
end $$;

-- ---------- 1. overlapping confirmed bookings are rejected ----------
insert into public.bookings (id, equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, status)
values ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'x',
        '00000000-0000-0000-0000-00000000000a', 'A', 'a@test.invalid', '2030-01-10', '2030-01-12', 'confirmed');
do $$ begin
  begin
    insert into public.bookings (equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, status)
    values ('10000000-0000-0000-0000-000000000001', 'x', '00000000-0000-0000-0000-00000000000b', 'B', 'b@test.invalid', '2030-01-12', '2030-01-14', 'confirmed');
    raise exception 'FAIL: overlapping confirmed booking was accepted';
  exception when exclusion_violation then perform pg_temp.pass('overlapping confirmed INSERT rejected by exclusion constraint'); end;
end $$;
do $$ begin
  insert into public.bookings (equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, status)
  values ('10000000-0000-0000-0000-000000000001', 'x', '00000000-0000-0000-0000-00000000000b', 'B', 'b@test.invalid', '2030-01-13', '2030-01-14', 'confirmed');
  perform pg_temp.pass('back-to-back booking (next day) accepted');
end $$;
insert into public.bookings (id, equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, status)
values ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'x',
        '00000000-0000-0000-0000-00000000000b', 'B', 'b@test.invalid', '2030-01-11', '2030-01-11', 'pending');
do $$ begin
  perform pg_temp.pass('overlapping PENDING request allowed (does not block)');
  begin
    update public.bookings set status = 'confirmed' where id = '20000000-0000-0000-0000-000000000002';
    raise exception 'FAIL: confirming an overlapping pending booking was accepted';
  exception when exclusion_violation then perform pg_temp.pass('confirming an overlapping pending booking (UPDATE) rejected'); end;
  assert (select status from public.bookings where id = '20000000-0000-0000-0000-000000000002') = 'pending';
  begin
    update public.bookings set end_date = '2030-01-13' where id = '20000000-0000-0000-0000-000000000001';
    raise exception 'FAIL: extending a confirmed booking into another was accepted';
  exception when exclusion_violation then perform pg_temp.pass('extending a confirmed booking into another rejected'); end;
end $$;
-- other items are independent
do $$ begin
  insert into public.bookings (equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, status)
  values ('10000000-0000-0000-0000-000000000002', 'x', '00000000-0000-0000-0000-00000000000b', 'B', 'b@test.invalid', '2030-01-10', '2030-01-12', 'confirmed');
  perform pg_temp.pass('same dates on a different item accepted');
end $$;
-- cancelling frees the dates
do $$ begin
  update public.bookings set status = 'cancelled' where id = '20000000-0000-0000-0000-000000000001';
  update public.bookings set status = 'confirmed' where id = '20000000-0000-0000-0000-000000000002';
  perform pg_temp.pass('cancelling releases the dates for another booking');
end $$;

-- ---------- 2. maintenance blocks prevent booking ----------
insert into public.maintenance_blocks (id, equipment_id, start_date, end_date, reason)
values ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2030-02-01', '2030-02-05', 'TEST service');
do $$ begin
  begin
    insert into public.bookings (equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, status)
    values ('10000000-0000-0000-0000-000000000001', 'x', '00000000-0000-0000-0000-00000000000a', 'A', 'a@test.invalid', '2030-02-05', '2030-02-06', 'confirmed');
    raise exception 'FAIL: booking inside a maintenance block accepted';
  exception when exclusion_violation then perform pg_temp.pass('confirmed booking overlapping maintenance rejected'); end;
  begin
    insert into public.maintenance_blocks (equipment_id, start_date, end_date)
    values ('10000000-0000-0000-0000-000000000001', '2030-01-11', '2030-01-11');
    raise exception 'FAIL: maintenance over a confirmed booking accepted';
  exception when exclusion_violation then perform pg_temp.pass('maintenance block over a confirmed booking rejected'); end;
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-02-03', '2030-02-03') = false;
  perform pg_temp.pass('check_availability false inside maintenance');
  delete from public.maintenance_blocks where id = '30000000-0000-0000-0000-000000000001';
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-02-03', '2030-02-03') = true;
  perform pg_temp.pass('deleting a maintenance block frees the dates');
end $$;
insert into public.maintenance_blocks (id, equipment_id, start_date, end_date, reason)
values ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '2030-02-01', '2030-02-05', 'TEST service');

-- ---------- 3. availability ----------
do $$ declare r record; n int := 0; begin
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-01-01', '2030-01-09') = true, 'free window';
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-01-09', '2030-01-11') = false, 'touches confirmed booking';
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-01-14', '2030-01-31') = false, 'touches 13-14 booking';
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-01-15', '2030-01-31') = true, 'free after';
  for r in select * from public.get_unavailable_periods('10000000-0000-0000-0000-000000000001', '2030-01-01', '2030-02-28') loop
    n := n + 1;
  end loop;
  assert n = 3, 'expected 3 unavailable periods, got ' || n;
  assert (select array_agg(start_date || '..' || end_date order by start_date)
            from public.get_unavailable_periods('10000000-0000-0000-0000-000000000001', '2030-01-01', '2030-02-28'))
         = array['2030-01-11..2030-01-11', '2030-01-13..2030-01-14', '2030-02-01..2030-02-05'];
  perform pg_temp.pass('check_availability and get_unavailable_periods return the right dates');
end $$;
-- checkout holds: live ones block, expired ones do not
insert into public.bookings (id, equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date)
values ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 'x',
        '00000000-0000-0000-0000-00000000000a', 'A', 'a@test.invalid', '2030-03-01', '2030-03-02');
insert into public.equipment_holds (equipment_id, period, kind, booking_id, expires_at)
values ('10000000-0000-0000-0000-000000000001', '[2030-03-01,2030-03-02]', 'checkout',
        '20000000-0000-0000-0000-000000000010', now() + interval '30 minutes');
do $$ begin
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-03-02', '2030-03-03') = false;
  update public.equipment_holds set expires_at = now() - interval '1 minute' where booking_id = '20000000-0000-0000-0000-000000000010';
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-03-02', '2030-03-03') = true;
  perform pg_temp.pass('live checkout hold blocks; expired checkout hold does not');
  delete from public.equipment_holds where booking_id = '20000000-0000-0000-0000-000000000010';
end $$;

-- ---------- 4. pricing rule ----------
do $$ declare j jsonb; begin
  -- exact_period: 2030-01-05 is a Saturday
  j := public.calculate_hire_price(1000, 1500, 5000, '2030-01-05', '2030-01-06', 'exact_period');
  assert j->>'rate_type' = 'weekend' and (j->>'total_cents')::int = 1500, j::text;
  j := public.calculate_hire_price(1000, 1500, 5000, '2030-01-07', '2030-01-20', 'exact_period');
  assert j->>'rate_type' = 'weekly' and (j->>'total_cents')::int = 10000, j::text;
  j := public.calculate_hire_price(1000, 1500, 5000, '2030-01-07', '2030-01-09', 'exact_period');
  assert j->>'rate_type' = 'daily' and (j->>'total_cents')::int = 3000 and (j->>'days')::int = 3, j::text;
  j := public.calculate_hire_price(1000, null, null, '2030-01-05', '2030-01-06', null);
  assert j->>'rate_type' = 'daily' and (j->>'total_cents')::int = 2000 and j->>'rule' = 'exact_period', j::text;
  j := public.calculate_hire_price(null, null, null, '2030-01-05', '2030-01-06', null);
  assert j->>'reason' = 'price_on_request' and j->'total_cents' = 'null'::jsonb, j::text;
  -- customer_choice
  j := public.calculate_hire_price(1000, 1500, 5000, '2030-01-07', '2030-01-16', 'customer_choice', 'weekly');
  assert (j->>'total_cents')::int = 10000 and (j->>'units')::int = 2, j::text;
  j := public.calculate_hire_price(1000, 1500, 5000, '2030-01-07', '2030-01-08', 'customer_choice', 'weekend');
  assert (j->>'ok')::boolean = false and j->>'reason' = 'weekend_rate_needs_sat_to_sun', j::text;
  j := public.calculate_hire_price(1000, 1500, 5000, '2030-01-07', '2030-01-05', 'exact_period');
  assert j->>'reason' = 'invalid_dates', j::text;
  perform pg_temp.pass('calculate_hire_price follows the documented rules');
end $$;

-- ---------- 5. RLS ----------
-- anon (public website visitor)
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
do $$ begin
  assert (select count(*) from public.equipment) = 2, 'anon should only see the 2 published items';
  assert not exists (select 1 from public.equipment where not is_published);
  assert (select count(*) from public.equipment_rates) = 1, 'anon sees rates of published items only';
  assert (select count(*) from public.hire_categories) = 6;
  perform pg_temp.pass('anon sees only published equipment and their rates');
  begin
    perform 1 from public.bookings;
    raise exception 'FAIL: anon could read bookings';
  exception when insufficient_privilege then perform pg_temp.pass('anon cannot read bookings'); end;
  begin
    perform public.check_availability('10000000-0000-0000-0000-000000000002', '2030-01-01', '2030-01-02');
    raise exception 'FAIL: availability leaked for unpublished item';
  exception when no_data_found then perform pg_temp.pass('availability of unpublished item is hidden from anon'); end;
  begin
    perform public.request_booking('10000000-0000-0000-0000-000000000001', '2030-04-01', '2030-04-02', 'Anon');
    raise exception 'FAIL: anon could request a booking';
  exception when insufficient_privilege then perform pg_temp.pass('anon cannot request bookings'); end;
  begin
    update public.hire_settings set payments_live = true;
    raise exception 'FAIL: anon updated settings';
  exception when insufficient_privilege then perform pg_temp.pass('anon cannot change settings'); end;
end $$;
reset role;

-- customer A
set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated","sub":"00000000-0000-0000-0000-00000000000a","email":"customer-a@test.invalid"}';
do $$ declare b public.bookings; n int; begin
  assert (select count(*) from public.equipment) = 2, 'customer sees only published items';
  b := public.request_booking('10000000-0000-0000-0000-000000000001', '2030-04-01', '2030-04-03', 'Customer A', '0400 000 000');
  assert b.status = 'pending' and b.payment_status = 'unpaid' and b.customer_email = 'customer-a@test.invalid'
     and b.hire_total_cents = 3000 and b.customer_id = auth.uid(), row_to_json(b)::text;
  perform pg_temp.pass('signed-in customer can request a booking; it is created PENDING with a server-side price');
  select count(*) into n from public.bookings;
  assert n = (select count(*) from public.bookings where customer_id = '00000000-0000-0000-0000-00000000000a');
  assert not exists (select 1 from public.bookings where customer_id = '00000000-0000-0000-0000-00000000000b');
  perform pg_temp.pass('customer A sees only their own bookings');
  update public.bookings set status = 'confirmed' where id = b.id;
  get diagnostics n = row_count;
  assert n = 0, 'customer must not be able to confirm their own booking';
  perform pg_temp.pass('customer cannot change booking status directly (RLS)');
  begin
    insert into public.bookings (equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, status)
    values ('10000000-0000-0000-0000-000000000001', 'x', auth.uid(), 'A', 'a@test.invalid', '2030-05-01', '2030-05-01', 'confirmed');
    raise exception 'FAIL: customer inserted a confirmed booking';
  exception when insufficient_privilege then perform pg_temp.pass('customer cannot insert bookings directly (RLS)'); end;
  begin
    insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
    raise exception 'FAIL: customer made themselves admin';
  exception when insufficient_privilege then perform pg_temp.pass('customer cannot grant themselves admin'); end;
  begin
    perform public.begin_checkout(b.id, auth.uid());
    raise exception 'FAIL: customer called a service-only function';
  exception when insufficient_privilege then perform pg_temp.pass('service-only functions are not callable by customers'); end;
  begin
    perform public.request_booking('10000000-0000-0000-0000-000000000002', '2030-04-01', '2030-04-03', 'A');
    raise exception 'FAIL: booked an unpublished item';
  exception when no_data_found then perform pg_temp.pass('unpublished items cannot be booked'); end;
  begin
    perform public.request_booking('10000000-0000-0000-0000-000000000003', '2030-04-01', '2030-04-03', 'A');
    raise exception 'FAIL: booked an enquiry-only item';
  exception when invalid_parameter_value then perform pg_temp.pass('enquiry-only items cannot be booked online'); end;
  begin
    perform public.request_booking('10000000-0000-0000-0000-000000000001', '2030-02-04', '2030-02-06', 'A');
    raise exception 'FAIL: request over maintenance accepted';
  exception when exclusion_violation then perform pg_temp.pass('request over a maintenance block refused'); end;
  begin
    perform public.request_booking('10000000-0000-0000-0000-000000000001', '2020-01-01', '2020-01-02', 'A');
    raise exception 'FAIL: past dates accepted';
  exception when invalid_parameter_value then perform pg_temp.pass('past start date refused'); end;
  update public.hire_settings set payments_live = true;
  get diagnostics n = row_count;
  assert n = 0;
  assert (select count(*) from public.condition_reports) = 0;
  assert (select count(*) from public.maintenance_blocks) = 0;
  perform pg_temp.pass('customer cannot change settings or see maintenance/condition data');
end $$;
reset role;

-- customer B
set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated","sub":"00000000-0000-0000-0000-00000000000b"}';
do $$ begin
  assert not exists (select 1 from public.bookings where customer_id = '00000000-0000-0000-0000-00000000000a');
  assert exists (select 1 from public.bookings where customer_id = '00000000-0000-0000-0000-00000000000b');
  perform pg_temp.pass('customer B cannot see customer A''s bookings');
end $$;
reset role;

-- admin
set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated","sub":"00000000-0000-0000-0000-0000000000ad"}';
do $$ declare n int; begin
  assert (select count(*) from public.equipment) = 3, 'admin sees unpublished items too';
  assert (select count(*) from public.bookings) = (select count(*) from public.bookings where true);
  assert exists (select 1 from public.bookings where customer_id = '00000000-0000-0000-0000-00000000000a')
     and exists (select 1 from public.bookings where customer_id = '00000000-0000-0000-0000-00000000000b');
  update public.hire_settings set id_requirements = 'TEST VALUE';
  get diagnostics n = row_count; assert n = 1;
  insert into public.maintenance_blocks (equipment_id, start_date, end_date, reason)
  values ('10000000-0000-0000-0000-000000000002', '2031-01-01', '2031-01-02', 'TEST');
  insert into public.condition_reports (equipment_id, stage, condition, notes)
  values ('10000000-0000-0000-0000-000000000001', 'on_return', 'good', 'TEST');
  update public.equipment set is_published = true where id = '10000000-0000-0000-0000-000000000002';
  assert (select published_at is not null from public.equipment where id = '10000000-0000-0000-0000-000000000002');
  update public.equipment set is_published = false where id = '10000000-0000-0000-0000-000000000002';
  insert into storage.objects (bucket_id, name) values ('equipment-photos', 'test/admin-upload.jpg');
  perform pg_temp.pass('admin has full access: all items, all bookings, settings, maintenance, condition reports, publish, photo upload');
end $$;
reset role;

set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated","sub":"00000000-0000-0000-0000-00000000000a"}';
do $$ begin
  begin
    insert into storage.objects (bucket_id, name) values ('equipment-photos', 'test/customer-upload.jpg');
    raise exception 'FAIL: customer uploaded a photo';
  exception when insufficient_privilege then perform pg_temp.pass('customers cannot upload to the photo buckets'); end;
end $$;
reset role;

-- ---------- 6. checkout hold + webhook race ----------
set local request.jwt.claims = '';
update public.hire_settings set pricing_rule = 'exact_period';   -- test only
insert into public.bookings (id, equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, hire_total_cents) values
  ('20000000-0000-0000-0000-0000000000c1', '10000000-0000-0000-0000-000000000001', 'x', '00000000-0000-0000-0000-00000000000a', 'A', 'a@test.invalid', '2030-06-10', '2030-06-12', 3000),
  ('20000000-0000-0000-0000-0000000000c2', '10000000-0000-0000-0000-000000000001', 'x', '00000000-0000-0000-0000-00000000000b', 'B', 'b@test.invalid', '2030-06-11', '2030-06-13', 3000);
set local role service_role;
do $$ declare j jsonb; r text; begin
  j := public.begin_checkout('20000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-00000000000a');
  assert (j->>'hire_total_cents')::int = 3000 and j->'deposit_cents' = 'null'::jsonb, j::text;
  perform pg_temp.pass('begin_checkout re-prices on the server (no deposit charged while not configured)');
  begin
    perform public.begin_checkout('20000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-00000000000b');
    raise exception 'FAIL: other user started checkout on A''s booking';
  exception when no_data_found then perform pg_temp.pass('checkout refused for someone else''s booking'); end;
  begin
    perform public.begin_checkout('20000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-00000000000b');
    raise exception 'FAIL: second checkout for overlapping dates accepted';
  exception when exclusion_violation then perform pg_temp.pass('second overlapping checkout refused while the first holds the dates'); end;
  -- A's session expires without payment; B can now check out
  update public.equipment_holds set expires_at = now() - interval '1 minute' where booking_id = '20000000-0000-0000-0000-0000000000c1';
  j := public.begin_checkout('20000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-00000000000b');
  r := public.confirm_paid_booking('20000000-0000-0000-0000-0000000000c2', 'cs_test_b', 'pi_test_b', 3000);
  assert r = 'confirmed', r;
  r := public.confirm_paid_booking('20000000-0000-0000-0000-0000000000c2', 'cs_test_b', 'pi_test_b', 3000);
  assert r = 'already_confirmed', r;
  perform pg_temp.pass('webhook confirms a paid booking, and a repeated webhook is idempotent');
  -- a late payment for A (race) must NOT double-book
  r := public.confirm_paid_booking('20000000-0000-0000-0000-0000000000c1', 'cs_test_a', 'pi_test_a', 3000);
  assert r = 'conflict', r;
  assert (select status = 'pending' and payment_status = 'paid_conflict' from public.bookings where id = '20000000-0000-0000-0000-0000000000c1');
  assert (select count(*) from public.equipment_holds where period && '[2030-06-10,2030-06-13]'::daterange) = 1;
  perform pg_temp.pass('late/racing payment for clashing dates is flagged paid_conflict, never double-booked');
end $$;
reset role;

-- ---------- 7. cancellation ----------
set local role service_role;
do $$ declare j jsonb; v_id uuid; begin
  -- unpaid pending request: cancels immediately
  insert into public.bookings (id, equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date)
  values ('20000000-0000-0000-0000-0000000000d1', '10000000-0000-0000-0000-000000000001', 'x', '00000000-0000-0000-0000-00000000000a', 'A', 'a@test.invalid', '2030-07-01', '2030-07-02');
  j := public.decide_cancellation('20000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-00000000000a');
  assert j->>'action' = 'cancelled', j::text;
  perform pg_temp.pass('unpaid pending request cancels immediately');
  begin
    perform public.decide_cancellation('20000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-00000000000a');
    raise exception 'FAIL: cancelled someone else''s booking';
  exception when no_data_found then perform pg_temp.pass('customers cannot cancel other people''s bookings'); end;
  -- paid + confirmed, no terms configured -> admin review, no refund
  j := public.decide_cancellation('20000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-00000000000b', 'TEST');
  assert j->>'action' = 'review' and j->>'reason' = 'no_cancellation_terms_configured', j::text;
  assert (select status = 'confirmed' and cancel_requested_at is not null from public.bookings where id = '20000000-0000-0000-0000-0000000000c2');
  perform pg_temp.pass('with no cancellation terms, a paid booking goes to admin review (no auto refund)');
end $$;
reset role;
update public.hire_settings set cancel_auto_refund_min_hours = 48, cancel_auto_refund_percent = 50;  -- test only
set local role service_role;
do $$ declare j jsonb; begin
  j := public.decide_cancellation('20000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-00000000000b', 'TEST');
  assert j->>'action' = 'refund' and (j->>'refund_cents')::int = 1500 and j->>'payment_intent' = 'pi_test_b', j::text;
  assert (select status = 'cancelled' and payment_status = 'refund_pending' from public.bookings where id = '20000000-0000-0000-0000-0000000000c2');
  perform public.record_refund('20000000-0000-0000-0000-0000000000c2', 1500, true);
  assert (select payment_status = 'partially_refunded' and amount_refunded_cents = 1500 from public.bookings where id = '20000000-0000-0000-0000-0000000000c2');
  assert public.check_availability('10000000-0000-0000-0000-000000000001', '2030-06-11', '2030-06-13');
  perform pg_temp.pass('configured terms are applied: refund % of amount paid, dates released');
end $$;
reset role;
-- inside the window -> review
insert into public.bookings (id, equipment_id, equipment_name, customer_id, customer_name, customer_email, start_date, end_date, status, payment_status, amount_paid_cents)
values ('20000000-0000-0000-0000-0000000000d2', '10000000-0000-0000-0000-000000000001', 'x', '00000000-0000-0000-0000-00000000000a', 'A', 'a@test.invalid',
        public.hire_today() + 1, public.hire_today() + 1, 'confirmed', 'paid', 1000);
set local role service_role;
do $$ declare j jsonb; begin
  j := public.decide_cancellation('20000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-00000000000a');
  assert j->>'action' = 'review' and j->>'reason' = 'inside_cancellation_window', j::text;
  perform pg_temp.pass('cancellation inside the configured window goes to admin review');
  assert public.claim_email('20000000-0000-0000-0000-0000000000d2', 'confirmed') = true;
  assert public.claim_email('20000000-0000-0000-0000-0000000000d2', 'confirmed') = false;
  assert public.record_stripe_event('evt_test_1', 'checkout.session.completed') = true;
  assert public.record_stripe_event('evt_test_1', 'checkout.session.completed') = false;
  perform pg_temp.pass('emails and Stripe events are de-duplicated');
end $$;
reset role;

select count(*) as passed from _results;
rollback;
