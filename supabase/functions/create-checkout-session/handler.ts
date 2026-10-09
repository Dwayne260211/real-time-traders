// POST { booking_id } with the customer's Supabase access token.
// Re-prices the booking on the server, holds the dates, and returns a Stripe Checkout URL.
// Refuses unless online payments are switched on (env PAYMENTS_LIVE=true or the owner's
// payments_live setting). A LIVE Stripe key additionally needs BOTH switches on.
import { endpoint, HttpError, readJson, siteUrl, UUID_RE } from "../_shared/context.ts";
import { getSettings, requireUser, rpc } from "../_shared/db.ts";
import { stripeKey, stripeRequest } from "../_shared/stripe.ts";

interface Checkout {
  booking_id: string; reference: string; equipment_name: string; start_date: string; end_date: string;
  days: number; hire_total_cents: number; deposit_cents: number | null; customer_email: string; expires_at: number;
}

export const handler = endpoint(async (req, ctx) => {
  const user = await requireUser(ctx, req);
  const body = await readJson(req);
  const bookingId = String(body.booking_id ?? "");
  if (!UUID_RE.test(bookingId)) throw new HttpError(400, "bad_request", "Missing booking.");

  const settings = await getSettings(ctx);
  const envLive = ctx.env("PAYMENTS_LIVE") === "true";
  if (!envLive && !settings.payments_live) {
    throw new HttpError(403, "payments_not_live",
      "Online payment isn't switched on yet. Your request has been saved and we'll contact you to confirm.");
  }
  const { mode } = stripeKey(ctx);
  if (mode === "live" && !(envLive && settings.payments_live)) {
    throw new HttpError(403, "live_payments_not_authorised", "Live payments have not been authorised by the owner.");
  }

  const c = await rpc<Checkout>(ctx, "begin_checkout", { p_booking_id: bookingId, p_user_id: user.id });
  const site = siteUrl(ctx);
  const lineItems: Record<string, unknown>[] = [{
    quantity: 1,
    price_data: {
      currency: "aud",
      unit_amount: c.hire_total_cents,
      product_data: {
        name: `${c.equipment_name} hire`,
        description: `${c.start_date} to ${c.end_date} (${c.days} day${c.days === 1 ? "" : "s"}). Ref ${c.reference}`,
      },
    },
  }];
  if (c.deposit_cents && c.deposit_cents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency: "aud", unit_amount: c.deposit_cents, product_data: { name: "Security deposit" } },
    });
  }
  try {
    const session = await stripeRequest<{ id: string; url: string }>(ctx, "checkout/sessions", {
      mode: "payment",
      line_items: lineItems,
      customer_email: c.customer_email,
      client_reference_id: c.booking_id,
      metadata: { booking_id: c.booking_id, reference: c.reference },
      payment_intent_data: { metadata: { booking_id: c.booking_id, reference: c.reference }, receipt_email: c.customer_email },
      expires_at: c.expires_at,
      success_url: `${site}/my-bookings.html?checkout=success&ref=${encodeURIComponent(c.reference)}`,
      cancel_url: `${site}/my-bookings.html?checkout=cancelled&ref=${encodeURIComponent(c.reference)}`,
    }, `checkout-${c.booking_id}-${c.expires_at}`);
    await rpc(ctx, "attach_checkout_session", { p_booking_id: c.booking_id, p_session_id: session.id });
    return { url: session.url, mode };
  } catch (e) {
    await rpc(ctx, "release_checkout", { p_booking_id: c.booking_id }).catch(() => undefined);
    if (e instanceof HttpError) throw e;
    console.error(e);
    throw new HttpError(502, "stripe_error", "We couldn't start the payment. Your request is saved; please try again or call us.");
  }
});
