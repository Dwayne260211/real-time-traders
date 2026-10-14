-- Advisor lint fixes (no behaviour change):
-- 1) pin search_path on the two tier helper functions
alter function public.listing_cap(text) set search_path = public;
alter function public.featured_allowance(text) set search_path = public;
-- 2) trigger-only SECURITY DEFINER functions don't need to be callable over the REST API
--    (triggers fire regardless of EXECUTE privilege)
revoke execute on function public.messages_before_insert() from public, anon, authenticated;
revoke execute on function public.public_profiles_on_signup() from public, anon, authenticated;
revoke execute on function public.sync_booking_hold() from public, anon, authenticated;
revoke execute on function public.sync_booking_hold_after_insert() from public, anon, authenticated;
revoke execute on function public.sync_maintenance_hold() from public, anon, authenticated;
