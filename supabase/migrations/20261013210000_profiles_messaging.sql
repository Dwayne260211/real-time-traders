-- Public profiles (display name + avatar), avatars bucket, listing messaging (conversations + messages).

-- ---------- public profiles (no email/phone) ----------
create table if not exists public.public_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Member' check (char_length(display_name) between 1 and 40),
  avatar_path text,
  updated_at timestamptz not null default now()
);
alter table public.public_profiles enable row level security;
drop policy if exists pp_read on public.public_profiles;
create policy pp_read on public.public_profiles for select using (true);
drop policy if exists pp_insert_own on public.public_profiles;
create policy pp_insert_own on public.public_profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists pp_update on public.public_profiles;
create policy pp_update on public.public_profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
revoke all on public.public_profiles from anon;
grant select on public.public_profiles to anon, authenticated;
grant insert, update on public.public_profiles to authenticated;

-- admins may only clear an avatar (or rename), and nobody can point avatar_path outside their own folder
create or replace function public.public_profiles_before_write()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.updated_at := now();
  if new.avatar_path is not null and split_part(new.avatar_path, '/', 1) <> new.id::text then
    raise exception 'bad_avatar_path';
  end if;
  if tg_op = 'UPDATE' and old.id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) then
    -- admin editing someone else: only allow removing the avatar
    if new.avatar_path is not null and new.avatar_path is distinct from old.avatar_path then raise exception 'not_allowed'; end if;
  end if;
  return new;
end $$;
drop trigger if exists public_profiles_before_write on public.public_profiles;
create trigger public_profiles_before_write before insert or update on public.public_profiles
  for each row execute function public.public_profiles_before_write();

-- new sign-ups get a profile using their first name; backfill existing users
create or replace function public.public_profiles_on_signup()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.public_profiles (id, display_name)
  values (new.id, coalesce(nullif(left(split_part(trim(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')), ' ', 1), 40), ''), 'Member'))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists public_profiles_on_signup on auth.users;
create trigger public_profiles_on_signup after insert on auth.users for each row execute function public.public_profiles_on_signup();
insert into public.public_profiles (id, display_name)
select u.id, coalesce(nullif(left(split_part(trim(coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', '')), ' ', 1), 40), ''), 'Member')
from auth.users u on conflict (id) do nothing;

-- avatars bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "avatars read" on storage.objects;
create policy "avatars read" on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "avatars insert own" on storage.objects;
create policy "avatars insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "avatars delete own or admin" on storage.objects;
create policy "avatars delete own or admin" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- listings: sellers can choose messages only
alter table public.marketplace_listings drop constraint if exists marketplace_listings_contact_pref_check;
alter table public.marketplace_listings add constraint marketplace_listings_contact_pref_check
  check (contact_pref in ('email','phone','both','messages'));

-- ---------- conversations + messages ----------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.marketplace_listings(id) on delete cascade,
  buyer uuid not null references auth.users(id) on delete cascade,
  seller uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz,
  buyer_emailed_at timestamptz,
  seller_emailed_at timestamptz,
  unique (listing_id, buyer),
  check (buyer <> seller)
);
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists messages_conv_idx on public.messages(conversation_id, created_at);
create index if not exists messages_sender_idx on public.messages(sender, created_at);
create index if not exists conversations_buyer_idx on public.conversations(buyer);
create index if not exists conversations_seller_idx on public.conversations(seller);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
revoke all on public.conversations from anon;
revoke all on public.messages from anon;
grant select, insert on public.conversations to authenticated;
grant select, insert on public.messages to authenticated;

drop policy if exists conv_read on public.conversations;
create policy conv_read on public.conversations for select to authenticated using (auth.uid() in (buyer, seller));
drop policy if exists conv_insert on public.conversations;
create policy conv_insert on public.conversations for insert to authenticated with check (
  buyer = auth.uid() and buyer <> seller and exists (
    select 1 from public.marketplace_listings l where l.id = listing_id and l.owner = seller and l.status = 'active'));

drop policy if exists msg_read on public.messages;
create policy msg_read on public.messages for select to authenticated using (exists (
  select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.buyer, c.seller)));
drop policy if exists msg_insert on public.messages;
create policy msg_insert on public.messages for insert to authenticated with check (
  sender = auth.uid() and read_at is null and exists (
    select 1 from public.conversations c where c.id = conversation_id and auth.uid() in (c.buyer, c.seller)));

-- rate limit (30/hour per sender) + conversation bookkeeping + throttled email (15 min per recipient per conversation)
create or replace function public.messages_before_insert()
returns trigger language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  select count(*) into n from public.messages where sender = new.sender and created_at > now() - interval '1 hour';
  if n >= 30 then raise exception 'message_rate_limited' using hint = 'You can send up to 30 messages an hour.'; end if;
  new.body := btrim(new.body); new.created_at := now(); new.read_at := null;
  return new;
end $$;
drop trigger if exists messages_before_insert on public.messages;
create trigger messages_before_insert before insert on public.messages for each row execute function public.messages_before_insert();

create or replace function public.messages_after_insert()
returns trigger language plpgsql security definer set search_path = '' as $$
declare c public.conversations; recip uuid; last timestamptz; s text; ttl text;
begin
  select * into c from public.conversations where id = new.conversation_id;
  recip := case when new.sender = c.buyer then c.seller else c.buyer end;
  last := case when recip = c.buyer then c.buyer_emailed_at else c.seller_emailed_at end;
  update public.conversations set last_message_at = new.created_at,
    buyer_emailed_at = case when recip = c.buyer and (last is null or last < now() - interval '15 minutes') then now() else buyer_emailed_at end,
    seller_emailed_at = case when recip = c.seller and (last is null or last < now() - interval '15 minutes') then now() else seller_emailed_at end
  where id = c.id;
  if last is null or last < now() - interval '15 minutes' then
    begin
      select decrypted_secret into s from vault.decrypted_secrets where name = 'rtt_notify_secret' limit 1;
      select title into ttl from public.marketplace_listings where id = c.listing_id;
      if s is not null then
        perform net.http_post(
          url := 'https://qcfszkrwctwsllcivxwo.supabase.co/functions/v1/notify-listing-pending',
          headers := jsonb_build_object('Content-Type', 'application/json', 'x-notify-secret', s),
          body := jsonb_build_object('type', 'message', 'recipient', recip, 'listing_title', ttl,
            'sender_name', (select display_name from public.public_profiles where id = new.sender),
            'preview', left(new.body, 60)),
          timeout_milliseconds := 10000);
      end if;
    exception when others then raise warning 'message notify failed: %', sqlerrm;
    end;
  end if;
  return null;
end $$;
drop trigger if exists messages_after_insert on public.messages;
create trigger messages_after_insert after insert on public.messages for each row execute function public.messages_after_insert();

-- inbox + read receipts
create or replace function public.my_conversations()
returns table (id uuid, listing_id uuid, listing_title text, listing_photo text, other_id uuid, other_name text, other_avatar text,
               last_message_at timestamptz, last_body text, unread int, i_am_seller boolean)
language sql stable security definer set search_path = '' as $$
  select c.id, c.listing_id, l.title, l.photos[1],
         o.id, coalesce(p.display_name, 'Member'), p.avatar_path, c.last_message_at,
         (select left(m.body, 80) from public.messages m where m.conversation_id = c.id order by m.created_at desc limit 1),
         (select count(*)::int from public.messages m where m.conversation_id = c.id and m.sender <> auth.uid() and m.read_at is null),
         c.seller = auth.uid()
  from public.conversations c
  join public.marketplace_listings l on l.id = c.listing_id
  cross join lateral (select case when c.buyer = auth.uid() then c.seller else c.buyer end as id) o
  left join public.public_profiles p on p.id = o.id
  where auth.uid() in (c.buyer, c.seller)
  order by coalesce(c.last_message_at, c.created_at) desc;
$$;
create or replace function public.mark_conversation_read(p_conversation uuid)
returns void language sql security definer set search_path = '' as $$
  update public.messages m set read_at = now()
  from public.conversations c
  where m.conversation_id = p_conversation and c.id = p_conversation and auth.uid() in (c.buyer, c.seller)
    and m.sender <> auth.uid() and m.read_at is null;
$$;
create or replace function public.unread_message_count()
returns int language sql stable security definer set search_path = '' as $$
  select count(*)::int from public.messages m join public.conversations c on c.id = m.conversation_id
  where auth.uid() in (c.buyer, c.seller) and m.sender <> auth.uid() and m.read_at is null;
$$;
revoke all on function public.my_conversations() from public, anon;
revoke all on function public.mark_conversation_read(uuid) from public, anon;
revoke all on function public.unread_message_count() from public, anon;
grant execute on function public.my_conversations() to authenticated;
grant execute on function public.mark_conversation_read(uuid) to authenticated;
grant execute on function public.unread_message_count() to authenticated;
revoke all on function public.messages_after_insert() from public, anon, authenticated;
