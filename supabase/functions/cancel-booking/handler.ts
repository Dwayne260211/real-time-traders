// POST { booking_id, reason? } with the customer's Supabase access token.
// Applies the owner's configured cancellation terms (decide_cancellation in SQL).
// With no terms configured, anything paid or confirmed goes to admin review: no automatic refund.
import { endpoint, HttpError, readJson, UUID_RE } from "../_shared/context.ts";
import { isAdmin, requireUser, rpc } from "../_shared/db.ts";
import { sendBookingEmail } from "../_shared/notify.ts";
import { stripeRequest } from "../_shared/stripe.ts";

interface Decision {
  action: "cancelled" | "refund" | "review"; refund_cents: number;
  payment_intent?: string; checkout_session?: string | null; reason?: string;
}

export const handler = endpoint(async (req, ctx) => {
  const user = await requireUser(ctx, req);
  const body = await readJson(req);
  const bookingId = String(body.booking_id ?? "");
  if (!UUID_RE.test(bookingId)) throw new HttpError(400, "bad_request", "Missing booking.");
  const reason = typeof body.reason === "string" ? body.reason.slice(0, 1000) : null;
  const admin = await isAdmin(ctx, user.id);

  const d = await rpc<Decision>(ctx, "decide_cancellation", {
    p_booking_id: bookingId, p_user_id: user.id, p_reason: reason, p_as_admin: admin,
  });

  if (d.action === "cancelled") {
    if (d.checkout_session && ctx.env("STRIPE_SECRET_KEY")) {
      // Close an unfinished checkout so it can't be paid after cancelling.
      await stripeRequest(ctx, `checkout/sessions/${encodeURIComponent(d.checkout_session)}/expire`, {})
        .catch(() => undefined);
    }
    await sendBookingEmail(ctx, bookingId, "cancelled").catch(console.error);
    return { status: "cancelled", message: "Your booking has been cancelled." };
  }

  if (d.action === "refund") {
    try {
      if (!d.payment_intent) throw new Error("no payment intent on booking");
      await stripeRequest(ctx, "refunds", {
        payment_intent: d.payment_intent, amount: d.refund_cents,
        metadata: { booking_id: bookingId, reason: "customer_cancellation" },
      }, `refund-${bookingId}`);
      await rpc(ctx, "record_refund", { p_booking_id: bookingId, p_refund_cents: d.refund_cents, p_ok: true });
      await sendBookingEmail(ctx, bookingId, "cancelled").catch(console.error);
      return { status: "cancelled", refund_cents: d.refund_cents,
               message: "Your booking has been cancelled and a refund has been started under the hire terms." };
    } catch (e) {
      console.error(e);
      await rpc(ctx, "record_refund", { p_booking_id: bookingId, p_refund_cents: 0, p_ok: false, p_note: String(e) });
      await sendBookingEmail(ctx, bookingId, "cancel_review").catch(console.error);
      return { status: "cancelled_refund_pending",
               message: "Your booking has been cancelled. Your refund needs a manual check and we'll be in touch." };
    }
  }

  await sendBookingEmail(ctx, bookingId, "cancel_review").catch(console.error);
  return { status: "review", reason: d.reason,
           message: "Your cancellation request has been sent to us for review under the hire terms. Your booking stays in place until we confirm." };
});
