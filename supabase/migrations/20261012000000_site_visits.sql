-- Real Time Traders: privacy-friendly site visit counter for the coming-soon page.
-- Stores only the page path and a timestamp: no IP, no user agent, no cookies, no user id.
-- The browser counts one visit per session (sessionStorage) and calls public.record_visit().

create table if not exists public.site_visits (
  id bigserial primary key,
  path text,
  created_at timestamptz not null default now()
);

alter table public.site_visits enable row level security;
-- No policies: anon/authenticated cannot read or write the table directly.
-- All access goes through the SECURITY DEFINER functions below.
revoke all on table public.site_visits from anon, authenticated;

create or replace function public.record_visit(p_path text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_visits (path) values (left(coalesce(p_path, '/'), 200));
  return (select count(*) from public.site_visits);
end;
$$;

create or replace function public.visit_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*) from public.site_visits;
$$;

revoke all on function public.record_visit(text) from public;
revoke all on function public.visit_count() from public;
grant execute on function public.record_visit(text) to anon, authenticated;
grant execute on function public.visit_count() to anon, authenticated;
