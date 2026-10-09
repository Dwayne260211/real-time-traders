// POST { booking_id, kind } with a Supabase access token.
// Customers may only trigger "request_received" for their own booking (sent once).
// Admins may send any kind. Stripe sends the payment receipt itself.
import { endpoint, HttpError, readJson, UUID_RE } from "../_shared/context.ts";
import { isAdmin, requireUser } from "../_shared/db.ts";
import { EMAIL_KINDS, EmailKind, loadBooking, sendBookingEmail } from "../_shared/notify.ts";

export const handler = endpoint(async (req, ctx) => {
  const user = await requireUser(ctx, req);
  const body = await readJson(req);
  const bookingId = String(body.booking_id ?? "");
  const kind = String(body.kind ?? "request_received") as EmailKind;
  if (!UUID_RE.test(bookingId) || !EMAIL_KINDS.includes(kind)) throw new HttpError(400, "bad_request", "Bad request.");
  const admin = await isAdmin(ctx, user.id);
  if (!admin) {
    const b = await loadBooking(ctx, bookingId);
    if (!b || b.customer_id !== user.id) throw new HttpError(404, "booking_not_found", "That booking was not found.");
    if (kind !== "request_received") throw new HttpError(403, "forbidden", "Not allowed.");
  }
  return await sendBookingEmail(ctx, bookingId, kind);
});
