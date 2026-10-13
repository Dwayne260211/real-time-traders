-- Pre-approval for member listings: owners can only create pending listings; content edits send a listing back to
-- pending; owners may toggle an approved listing between active and sold; only admins approve (active) or reject (removed).
create or replace function public.ml_before_write()
returns trigger language plpgsql security definer set search_path = '' as $$
declare n int; adm boolean := public.is_admin();
begin
  if tg_op = 'INSERT' then
    if (auth.uid() is null or new.owner <> auth.uid()) and not adm then raise exception 'not_allowed'; end if;
    if not adm then new.status := 'pending'; new.removed_reason := null; end if;
  else
    new.owner := old.owner; new.created_at := old.created_at;
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
  new.updated_at := now();
  if new.status in ('active','pending') and (tg_op = 'INSERT' or old.status not in ('active','pending')) then
    select count(*) into n from public.marketplace_listings
      where owner = new.owner and status in ('active','pending') and id <> new.id;
    if n >= 10 then raise exception 'listing_limit_reached' using hint = 'You can have up to 10 active or pending listings.'; end if;
  end if;
  return new;
end $$;
