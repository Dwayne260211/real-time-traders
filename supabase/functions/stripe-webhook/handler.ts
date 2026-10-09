// Stripe webhook. Verifies the signature, then confirms the booking in the database.
// confirm_paid_booking locks the row and relies on the exclusion constraint, so a payment
// that races another booking for the same dates is flagged 'paid_conflict', never double-booked.
import { corsHeaders, Ctx, defaultCtx } from "../_shared/context.ts";
import { rpc } from "../_shared/db.ts";
import { sendBookingEmail } from "../_shared/notify.ts";
import { verifyStripeSignature } from "../_shared/stripe.ts";

interface StripeEvent { id: string; type: string; data: { object: Record<string, any> } }

function reply(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

export async function handler(req: Request, ctx: Ctx = defaultCtx()): Promise<Response> {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405, headers: corsHeaders(ctx, req) });
  const secret = ctx.env("STRIPE_WEBHOOK_SECRET") ?? "";
  const payload = await req.text();
  const ok = await verifyStripeSignature(payload, req.headers.get("stripe-signature"), secret,
    Math.floor(ctx.now().getTime() / 1000));
  if (!ok) return reply(400, { error: "bad_signature" });

  let event: StripeEvent;
  try { event = JSON.parse(payload); } catch { return reply(400, { error: "bad_payload" }); }
  const s = event.data?.object ?? {};
  const bookingId: string | undefined = s.metadata?.booking_id ?? s.client_reference_id;

  try {
    let result = "ignored";
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        if (!bookingId) break;
        if (s.payment_status !== "paid") { result = "awaiting_payment"; break; }
        result = await rpc<string>(ctx, "confirm_paid_booking", {
          p_booking_id: bookingId, p_session_id: s.id,
          p_payment_intent: typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null,
          p_amount_cents: s.amount_total ?? 0,
        });
        if (result === "confirmed") await sendBookingEmail(ctx, bookingId, "confirmed").catch(console.error);
        if (result === "conflict") await sendBookingEmail(ctx, bookingId, "paid_conflict").catch(console.error);
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        if (bookingId) { await rpc(ctx, "release_checkout", { p_booking_id: bookingId }); result = "released"; }
        break;
    }
    await rpc(ctx, "record_stripe_event", { p_id: event.id, p_type: event.type }).catch(() => undefined);
    return reply(200, { received: true, result });
  } catch (e) {
    console.error(e);
    return reply(500, { error: "processing_failed" });   // Stripe retries
  }
}
