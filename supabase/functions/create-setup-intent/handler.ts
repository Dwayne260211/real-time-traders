// POST {} with the member's Supabase access token.
// Creates or reuses the member's Stripe customer and returns a SetupIntent client_secret
// for the Stripe Payment Element. The card is saved by Stripe; the stripe-webhook stores
// only the summary (brand, last4, expiry) in member_payment_methods.
import { endpoint } from "../_shared/context.ts";
import { requireUser } from "../_shared/db.ts";
import { ensureCustomer } from "../_shared/members.ts";
import { stripeRequest } from "../_shared/stripe.ts";

export const handler = endpoint(async (req, ctx) => {
  const user = await requireUser(ctx, req);
  const customer = await ensureCustomer(ctx, user);
  const si = await stripeRequest<{ id: string; client_secret: string }>(ctx, "setup_intents", {
    customer,
    usage: "off_session",
    payment_method_types: ["card"],
    metadata: { supabase_user_id: user.id },
  });
  return { client_secret: si.client_secret };
});
