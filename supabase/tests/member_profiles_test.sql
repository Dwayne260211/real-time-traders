-- SQL tests for member profiles (20261010120000_member_profiles.sql). Runs inside one
-- transaction and rolls back, so it leaves no data behind. TEST DATA ONLY.
--   psql -v ON_ERROR_STOP=1 -f supabase/tests/member_profiles_test.sql
-- Each check prints "PASS ..."; any failure raises and stops the run.
\set ON_ERROR_STOP 1
begin;

create temp table _results (n serial, name text) on commit drop;
grant all on _results to anon, authenticated, service_role;
grant usage on sequence _results_n_seq to anon, authenticated, service_role;
create or replace function pg_temp.pass(t text) returns void language plpgsql as $$
begin insert into _results(name) values (t); raise notice 'PASS %', t; end $$;

-- ---------- fixtures (test only) ----------
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-0000000000f1', 'member-a@test.invalid', '{"full_name":"Member A","requested_tier":"Gold"}'),
  ('00000000-0000-0000-0000-0000000000f2', 'member-b@test.invalid', '{"name":"Member B (Google)"}'),
  ('00000000-0000-0000-0000-0000000000f3', 'member-c@test.invalid', '{"requested_tier":"platinum"}');

do $$ declare p record; begin
  select * into p from public.profiles where id = '00000000-0000-0000-0000-0000000000f1';
  if p.full_name <> 'Member A' or p.email <> 'member-a@test.invalid' then raise exception 'profile name/email not copied'; end if;
  if p.membership_tier <> 'free' or p.requested_tier <> 'gold' then raise exception 'tier should be free with requested gold, got % / %', p.membership_tier, p.requested_tier; end if;
  perform pg_temp.pass('sign-up creates a free profile and keeps the requested tier');
  select * into p from public.profiles where id = '00000000-0000-0000-0000-0000000000f2';
  if p.full_name <> 'Member B (Google)' then raise exception 'Google name not copied'; end if;
  perform pg_temp.pass('Google "name" metadata is used when full_name is missing');
  select * into p from public.profiles where id = '00000000-0000-0000-0000-0000000000f3';
  if p.requested_tier <> 'free' then raise exception 'unknown tier should fall back to free'; end if;
  perform pg_temp.pass('unknown requested tier falls back to free');
end $$;

update auth.users set email = 'member-a2@test.invalid' where id = '00000000-0000-0000-0000-0000000000f1';
do $$ begin
  if (select email from public.profiles where id = '00000000-0000-0000-0000-0000000000f1') <> 'member-a2@test.invalid' then raise exception 'email not synced'; end if;
  perform pg_temp.pass('email change is copied to the profile');
end $$;

-- ---------- anon: no access ----------
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';
do $$ begin
  begin perform 1 from public.profiles; raise exception 'anon could read profiles';
  exception when insufficient_privilege then perform pg_temp.pass('anon cannot read profiles'); end;
end $$;
reset role;

-- ---------- member A: own row only, name only ----------
set local role authenticated;
set local request.jwt.claims = '{"role":"authenticated","sub":"00000000-0000-0000-0000-0000000000f1"}';
do $$ declare n int; begin
  select count(*) into n from public.profiles;
  if n <> 1 then raise exception 'member sees % profiles, expected 1', n; end if;
  perform pg_temp.pass('member reads only their own profile');
  update public.profiles set full_name = 'Member A Renamed' where id = '00000000-0000-0000-0000-0000000000f1';
  if (select full_name from public.profiles where id = '00000000-0000-0000-0000-0000000000f1') <> 'Member A Renamed' then raise exception 'own name update failed'; end if;
  perform pg_temp.pass('member can change their own name');
  update public.profiles set full_name = 'Hacked' where id = '00000000-0000-0000-0000-0000000000f2';
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'member changed another profile'; end if;
  perform pg_temp.pass('member cannot change another profile');
  begin update public.profiles set membership_tier = 'gold' where id = '00000000-0000-0000-0000-0000000000f1'; raise exception 'member upgraded own tier';
  exception when insufficient_privilege then perform pg_temp.pass('member cannot set their own tier'); end;
  begin insert into public.profiles (id) values ('00000000-0000-0000-0000-0000000000f9'); raise exception 'member inserted a profile';
  exception when insufficient_privilege then perform pg_temp.pass('member cannot insert profiles'); end;
  begin delete from public.profiles; raise exception 'member deleted profiles';
  exception when insufficient_privilege then perform pg_temp.pass('member cannot delete profiles'); end;
end $$;
reset role;

do $$ begin raise notice 'ALL % MEMBER PROFILE CHECKS PASSED', (select count(*) from _results); end $$;
rollback;
