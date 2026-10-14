-- Performance lints (no access change):
-- 1) evaluate auth.uid()/is_admin() once per statement via (select ...)
-- 2) split admin ALL policies so each action has a single permissive policy
begin;
alter policy "own role readable" on public.user_roles using (((user_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_admin() AS is_admin)));
alter policy "categories public read" on public.hire_categories using (true);
alter policy "published equipment readable" on public.equipment using ((is_published OR ( SELECT is_admin() AS is_admin)));
alter policy "photos of published equipment readable" on public.equipment_photos using ((( SELECT is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM equipment e
  WHERE ((e.id = equipment_photos.equipment_id) AND e.is_published)))));
alter policy "rates of published equipment readable" on public.equipment_rates using ((( SELECT is_admin() AS is_admin) OR (EXISTS ( SELECT 1
   FROM equipment e
  WHERE ((e.id = equipment_rates.equipment_id) AND e.is_published)))));
alter policy "settings public read" on public.hire_settings using (true);
alter policy "settings admin update" on public.hire_settings using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
alter policy "customers read own bookings" on public.bookings using (((customer_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_admin() AS is_admin)));
alter policy "admins manage maintenance" on public.maintenance_blocks using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
alter policy "admins read holds" on public.equipment_holds using (( SELECT is_admin() AS is_admin));
alter policy "customers read reports on own bookings" on public.condition_reports using ((EXISTS ( SELECT 1
   FROM bookings b
  WHERE ((b.id = condition_reports.booking_id) AND (b.customer_id = ( SELECT auth.uid() AS uid))))) OR ( SELECT is_admin() AS is_admin));
alter policy "admins manage condition photos" on public.condition_report_photos using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
alter policy "members read own profile" on public.profiles using (((id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_admin() AS is_admin)));
alter policy "members update own profile" on public.profiles using ((id = ( SELECT auth.uid() AS uid))) with check ((id = ( SELECT auth.uid() AS uid)));
alter policy "member_profiles: read own" on public.member_profiles using ((id = ( SELECT auth.uid() AS uid)));
alter policy "member_profiles: insert own" on public.member_profiles with check ((id = ( SELECT auth.uid() AS uid)));
alter policy "member_profiles: update own" on public.member_profiles using ((id = ( SELECT auth.uid() AS uid))) with check ((id = ( SELECT auth.uid() AS uid)));
alter policy "member_payment_methods: read own" on public.member_payment_methods using ((user_id = ( SELECT auth.uid() AS uid)));
alter policy "conv_read" on public.conversations using (((( SELECT auth.uid() AS uid) = buyer) OR (( SELECT auth.uid() AS uid) = seller)));
alter policy "conv_insert" on public.conversations with check (((buyer = ( SELECT auth.uid() AS uid)) AND (buyer <> seller) AND (EXISTS ( SELECT 1
   FROM marketplace_listings l
  WHERE ((l.id = conversations.listing_id) AND (l.owner = conversations.seller) AND (l.status = 'active'::text))))));
alter policy "ml_read" on public.marketplace_listings using (((status = ANY (ARRAY['active'::text, 'sold'::text])) OR (owner = ( SELECT auth.uid() AS uid)) OR ( SELECT is_admin() AS is_admin)));
alter policy "ml_insert" on public.marketplace_listings with check (((owner = ( SELECT auth.uid() AS uid)) AND (status = ANY (ARRAY['active'::text, 'pending'::text]))));
alter policy "ml_delete" on public.marketplace_listings using (((owner = ( SELECT auth.uid() AS uid)) OR ( SELECT is_admin() AS is_admin)));
alter policy "mlc_read" on public.marketplace_listing_contacts using ((EXISTS ( SELECT 1
   FROM marketplace_listings l
  WHERE ((l.id = marketplace_listing_contacts.listing_id) AND ((l.status = 'active'::text) OR (l.owner = ( SELECT auth.uid() AS uid)) OR ( SELECT is_admin() AS is_admin))))));
alter policy "pp_read" on public.public_profiles using (true);
alter policy "pp_insert_own" on public.public_profiles with check ((id = ( SELECT auth.uid() AS uid)));
alter policy "pp_update" on public.public_profiles using (((id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_admin() AS is_admin))) with check (((id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_admin() AS is_admin)));
alter policy "msg_read" on public.messages using ((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((( SELECT auth.uid() AS uid) = c.buyer) OR (( SELECT auth.uid() AS uid) = c.seller))))));
alter policy "msg_insert" on public.messages with check (((sender = ( SELECT auth.uid() AS uid)) AND (read_at IS NULL) AND (EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((( SELECT auth.uid() AS uid) = c.buyer) OR (( SELECT auth.uid() AS uid) = c.seller)))))));
drop policy "admins manage bookings" on public.bookings;
create policy "admins manage bookings (insert)" on public.bookings for insert to authenticated with check (( SELECT is_admin() AS is_admin));
create policy "admins manage bookings (update)" on public.bookings for update to authenticated using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
create policy "admins manage bookings (delete)" on public.bookings for delete to authenticated using (( SELECT is_admin() AS is_admin));
drop policy "admins manage condition reports" on public.condition_reports;
create policy "admins manage condition reports (insert)" on public.condition_reports for insert to authenticated with check (( SELECT is_admin() AS is_admin));
create policy "admins manage condition reports (update)" on public.condition_reports for update to authenticated using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
create policy "admins manage condition reports (delete)" on public.condition_reports for delete to authenticated using (( SELECT is_admin() AS is_admin));
drop policy "equipment admin write" on public.equipment;
create policy "equipment admin write (insert)" on public.equipment for insert to authenticated with check (( SELECT is_admin() AS is_admin));
create policy "equipment admin write (update)" on public.equipment for update to authenticated using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
create policy "equipment admin write (delete)" on public.equipment for delete to authenticated using (( SELECT is_admin() AS is_admin));
drop policy "photos admin write" on public.equipment_photos;
create policy "photos admin write (insert)" on public.equipment_photos for insert to authenticated with check (( SELECT is_admin() AS is_admin));
create policy "photos admin write (update)" on public.equipment_photos for update to authenticated using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
create policy "photos admin write (delete)" on public.equipment_photos for delete to authenticated using (( SELECT is_admin() AS is_admin));
drop policy "rates admin write" on public.equipment_rates;
create policy "rates admin write (insert)" on public.equipment_rates for insert to authenticated with check (( SELECT is_admin() AS is_admin));
create policy "rates admin write (update)" on public.equipment_rates for update to authenticated using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
create policy "rates admin write (delete)" on public.equipment_rates for delete to authenticated using (( SELECT is_admin() AS is_admin));
drop policy "categories admin write" on public.hire_categories;
create policy "categories admin write (insert)" on public.hire_categories for insert to authenticated with check (( SELECT is_admin() AS is_admin));
create policy "categories admin write (update)" on public.hire_categories for update to authenticated using (( SELECT is_admin() AS is_admin)) with check (( SELECT is_admin() AS is_admin));
create policy "categories admin write (delete)" on public.hire_categories for delete to authenticated using (( SELECT is_admin() AS is_admin));
drop policy "mlc_write" on public.marketplace_listing_contacts;
create policy "mlc_write (insert)" on public.marketplace_listing_contacts for insert to authenticated with check ((EXISTS ( SELECT 1
   FROM marketplace_listings l
  WHERE ((l.id = marketplace_listing_contacts.listing_id) AND (l.owner = ( SELECT auth.uid() AS uid))))));
create policy "mlc_write (update)" on public.marketplace_listing_contacts for update to authenticated using ((EXISTS ( SELECT 1
   FROM marketplace_listings l
  WHERE ((l.id = marketplace_listing_contacts.listing_id) AND (l.owner = ( SELECT auth.uid() AS uid)))))) with check ((EXISTS ( SELECT 1
   FROM marketplace_listings l
  WHERE ((l.id = marketplace_listing_contacts.listing_id) AND (l.owner = ( SELECT auth.uid() AS uid))))));
create policy "mlc_write (delete)" on public.marketplace_listing_contacts for delete to authenticated using ((EXISTS ( SELECT 1
   FROM marketplace_listings l
  WHERE ((l.id = marketplace_listing_contacts.listing_id) AND (l.owner = ( SELECT auth.uid() AS uid))))));
drop policy "ml_update_admin" on public.marketplace_listings;
drop policy "ml_update_own" on public.marketplace_listings;
create policy "ml_update" on public.marketplace_listings for update to authenticated using ((((owner = ( SELECT auth.uid() AS uid)) AND (status <> 'removed'::text))) OR ( SELECT is_admin() AS is_admin)) with check ((((owner = ( SELECT auth.uid() AS uid)) AND (status = ANY (ARRAY['active'::text, 'sold'::text, 'pending'::text])))) OR ( SELECT is_admin() AS is_admin));
commit;
