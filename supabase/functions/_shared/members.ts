// Member Stripe customers and saved card summaries (no raw card data ever touches Supabase).
import { Ctx } from "./context.ts";
import { select, upsert } from "./db.ts";
import { stripeGet, stripeRequest } from "./stripe.ts";

export async function customerIdFor(ctx: Ctx, userId: string): Promise<string | null> {
  const rows = await select<{ stripe_customer_id: string }>(ctx,
    `member_stripe_customers?select=stripe_customer_id&user_id=eq.${encodeURIComponent(userId)}`);
  return rows[0]?.stripe_customer_id ?? null;
}

export async function userIdForCustomer(ctx: Ctx, customerId: string): Promise<string | null> {
  const rows = await select<{ user_id: string }>(ctx,
    `member_stripe_customers?select=user_id&stripe_customer_id=eq.${encodeURIComponent(customerId)}`);
  return rows[0]?.user_id ?? null;
}

/** Reuses the member's Stripe customer or creates one (idempotent per user). */
export async function ensureCustomer(ctx: Ctx, user: { id: string; email?: string }): Promise<string> {
  const existing = await customerIdFor(ctx, user.id);
  if (existing) return existing;
  const c = await stripeRequest<{ id: string }>(ctx, "customers",
    { email: user.email, metadata: { supabase_user_id: user.id } }, `member-customer-${user.id}`);
  await upsert(ctx, "member_stripe_customers", { user_id: user.id, stripe_customer_id: c.id }, "user_id");
  return c.id;
}

// deno-lint-ignore no-explicit-any
export async function savePaymentMethod(ctx: Ctx, pm: any, userId: string): Promise<void> {
  if (!pm || typeof pm !== "object" || pm.type !== "card" || !pm.card) return;
  const customer = typeof pm.customer === "string" ? pm.customer : pm.customer?.id;
  if (!customer) return;
  await upsert(ctx, "member_payment_methods", {
    user_id: userId,
    stripe_customer_id: customer,
    stripe_payment_method_id: pm.id,
    brand: pm.card.brand ?? null,
    last4: pm.card.last4 ?? null,
    exp_month: pm.card.exp_month ?? null,
    exp_year: pm.card.exp_year ?? null,
    livemode: !!pm.livemode,
    updated_at: new Date().toISOString(),
  }, "stripe_payment_method_id");
}

export async function fetchPaymentMethod(ctx: Ctx, id: string) {
  return await stripeGet(ctx, `payment_methods/${encodeURIComponent(id)}`);
}
