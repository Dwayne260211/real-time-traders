// Stripe webhook. Verifies the signature, then confirms the booking in the database.
// confirm_paid_booking locks the row and relies on the exclusion constraint, so a payment
// that races another booking for the same dates is flagged 'paid_conflict', never double-booked.
import { corsHeaders, Ctx, defaultCtx, UUID_RE } from "../_shared/context.ts";
import { rpc } from "../_shared/db.ts";
import { sendBookingEmail } from "../_shared/notify.ts";
import { verifyStripeSignature } from "../_shared/stripe.ts";
import { fetchPaymentMethod, savePaymentMethod, userIdForCustomer } from "../_shared/members.ts";
import { ensureSubscriptionTaxId, fetchSubscription, syncSubscription } from "../_shared/membership.ts";

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
  // Only hire bookings carry metadata.booking_id (the Stripe account is shared with another app).
  const rawBooking = String(s.metadata?.booking_id ?? "");
  const bookingId: string | undefined = UUID_RE.test(rawBooking) ? rawBooking : undefined;

  try {
    let result = "ignored";
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        if (s.mode === "subscription") {
          if (s.metadata?.app !== "rtt" || !s.subscription) break;
          const subId = typeof s.subscription === "string" ? s.subscription : s.subscription.id;
          result = await syncSubscription(ctx, await fetchSubscription(ctx, subId));
          break;
        }
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
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // Re-read the subscription so out-of-order events can't apply a stale state.
        const fresh = await fetchSubscription(ctx, s.id).catch(() => s);
        result = await syncSubscription(ctx, fresh);
        if (event.type === "customer.subscription.created") await ensureSubscriptionTaxId(ctx, fresh);
        break;
      }
      case "invoice.payment_failed": {
        const subId = typeof s.subscription === "string" ? s.subscription
          : s.subscription?.id ?? s.parent?.subscription_details?.subscription;
        if (!subId) break;
        result = await syncSubscription(ctx, await fetchSubscription(ctx, subId));
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        if (s.mode === "subscription") break;
        if (bookingId) { await rpc(ctx, "release_checkout", { p_booking_id: bookingId }); result = "released"; }
        break;
      // Member saved a card (account.html, SetupIntent + Payment Element): store the summary only.
      case "setup_intent.succeeded": {
        const userId: string | undefined = s.metadata?.supabase_user_id;
        const pmId = typeof s.payment_method === "string" ? s.payment_method : s.payment_method?.id;
        if (!userId || !pmId) break;
        await savePaymentMethod(ctx, await fetchPaymentMethod(ctx, pmId), userId);
        result = "card_saved";
        break;
      }
      case "payment_method.attached": {
        const customer = typeof s.customer === "string" ? s.customer : s.customer?.id;
        const userId = customer ? await userIdForCustomer(ctx, customer) : null;
        if (!userId) break;
        await savePaymentMethod(ctx, s, userId);
        result = "card_saved";
        break;
      }
    }
    await rpc(ctx, "record_stripe_event", { p_id: event.id, p_type: event.type }).catch(() => undefined);
    return reply(200, { received: true, result });
  } catch (e) {
    console.error(e);
    return reply(500, { error: "processing_failed" });   // Stripe retries
  }
}
