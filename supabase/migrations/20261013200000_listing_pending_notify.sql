-- Email the RTT inbox when a listing becomes pending (Edge Function notify-listing-pending via pg_net).
-- The shared secret lives in Vault as 'rtt_notify_secret' (set separately; never in the repo):
--   select vault.create_secret('<secret>', 'rtt_notify_secret');
create extension if not exists pg_net;

create or replace function public.ml_notify_pending()
returns trigger language plpgsql security definer set search_path = '' as $$
declare s text;
begin
  if new.status = 'pending' and (tg_op = 'INSERT' or old.status is distinct from 'pending') then
    select decrypted_secret into s from vault.decrypted_secrets where name = 'rtt_notify_secret' limit 1;
    if s is not null then
      perform net.http_post(
        url := 'https://qcfszkrwctwsllcivxwo.supabase.co/functions/v1/notify-listing-pending',
        headers := jsonb_build_object('Content-Type', 'application/json', 'x-notify-secret', s),
        body := jsonb_build_object('record', jsonb_build_object(
          'id', new.id, 'title', new.title, 'price_cents', new.price_cents, 'suburb', new.suburb,
          'category', new.category, 'photos', to_jsonb(new.photos), 'created_at', new.created_at, 'updated_at', new.updated_at)),
        timeout_milliseconds := 10000);
    end if;
  end if;
  return null;
exception when others then
  raise warning 'ml_notify_pending failed: %', sqlerrm;  -- never block the listing write
  return null;
end $$;
revoke all on function public.ml_notify_pending() from public, anon, authenticated;

drop trigger if exists ml_notify_pending on public.marketplace_listings;
create trigger ml_notify_pending after insert or update on public.marketplace_listings
  for each row execute function public.ml_notify_pending();
