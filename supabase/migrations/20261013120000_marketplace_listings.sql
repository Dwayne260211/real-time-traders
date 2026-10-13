-- Member self-service marketplace listings (free, no payments).
create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 80),
  description text not null default '' check (char_length(description) <= 2000),
  category text not null check (category in ('buy-sell','rare','donated')),
  price_cents integer check (price_cents is null or (price_cents >= 0 and price_cents <= 100000000)),
  condition text check (condition in ('new','like-new','good','fair','for-parts')),
  suburb text not null check (char_length(suburb) between 2 and 60),
  contact_pref text not null default 'email' check (contact_pref in ('email','phone','both')),
  photos text[] not null default '{}' check (cardinality(photos) <= 6),
  status text not null default 'active' check (status in ('active','sold','removed','pending')),
  removed_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists marketplace_listings_status_idx on public.marketplace_listings(status, created_at desc);
create index if not exists marketplace_listings_owner_idx on public.marketplace_listings(owner);

-- Seller contact details: separate table so only signed-in users can read them.
create table if not exists public.marketplace_listing_contacts (
  listing_id uuid primary key references public.marketplace_listings(id) on delete cascade,
  phone text check (phone is null or char_length(phone) <= 30),
  email text check (email is null or char_length(email) <= 120)
);

alter table public.marketplace_listings enable row level security;
alter table public.marketplace_listing_contacts enable row level security;

drop policy if exists ml_read on public.marketplace_listings;
create policy ml_read on public.marketplace_listings for select
  using (status in ('active','sold') or owner = auth.uid() or public.is_admin());
drop policy if exists ml_insert on public.marketplace_listings;
create policy ml_insert on public.marketplace_listings for insert to authenticated
  with check (owner = auth.uid() and status in ('active','pending'));
drop policy if exists ml_update_own on public.marketplace_listings;
create policy ml_update_own on public.marketplace_listings for update to authenticated
  using (owner = auth.uid() and status <> 'removed')
  with check (owner = auth.uid() and status in ('active','sold','pending'));
drop policy if exists ml_update_admin on public.marketplace_listings;
create policy ml_update_admin on public.marketplace_listings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists ml_delete on public.marketplace_listings;
create policy ml_delete on public.marketplace_listings for delete to authenticated
  using (owner = auth.uid() or public.is_admin());

drop policy if exists mlc_read on public.marketplace_listing_contacts;
create policy mlc_read on public.marketplace_listing_contacts for select to authenticated
  using (exists (select 1 from public.marketplace_listings l where l.id = listing_id
                 and (l.status = 'active' or l.owner = auth.uid() or public.is_admin())));
drop policy if exists mlc_write on public.marketplace_listing_contacts;
create policy mlc_write on public.marketplace_listing_contacts for all to authenticated
  using (exists (select 1 from public.marketplace_listings l where l.id = listing_id and l.owner = auth.uid()))
  with check (exists (select 1 from public.marketplace_listings l where l.id = listing_id and l.owner = auth.uid()));

revoke all on public.marketplace_listings from anon;
revoke all on public.marketplace_listing_contacts from anon;
grant select on public.marketplace_listings to anon, authenticated;
grant insert, update, delete on public.marketplace_listings to authenticated;
grant select, insert, update, delete on public.marketplace_listing_contacts to authenticated;

-- updated_at, owner immutability, 10-active-listing cap (all accounts are free for now; matches Basic 10).
create or replace function public.ml_before_write()
returns trigger language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if tg_op = 'INSERT' and (auth.uid() is null or new.owner <> auth.uid()) and not public.is_admin() then
    raise exception 'not_allowed';
  end if;
  new.updated_at := now();
  if tg_op = 'UPDATE' then
    new.owner := old.owner; new.created_at := old.created_at;
    if not public.is_admin() then new.removed_reason := old.removed_reason; end if;
  end if;
  if new.status = 'active' and (tg_op = 'INSERT' or old.status <> 'active') then
    select count(*) into n from public.marketplace_listings where owner = new.owner and status = 'active' and id <> new.id;
    if n >= 10 then raise exception 'listing_limit_reached' using hint = 'You can have up to 10 active listings.'; end if;
  end if;
  return new;
end $$;
drop trigger if exists ml_before_write on public.marketplace_listings;
create trigger ml_before_write before insert or update on public.marketplace_listings
  for each row execute function public.ml_before_write();

-- Photos bucket: public read, owner-folder writes, images only, 5 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-photos','listing-photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "listing photos read" on storage.objects;
create policy "listing photos read" on storage.objects for select using (bucket_id = 'listing-photos');
drop policy if exists "listing photos insert own" on storage.objects;
create policy "listing photos insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "listing photos delete own" on storage.objects;
create policy "listing photos delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'listing-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
