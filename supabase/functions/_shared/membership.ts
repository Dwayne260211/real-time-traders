// Paid memberships: Stripe Checkout (subscription mode), Customer Portal and webhook sync.
// Tier changes are only ever written server-side via the apply_membership RPC.
import { Ctx, HttpError, siteUrl } from "./context.ts";
import { rpc, select } from "./db.ts";
import { stripeGet, stripeRequest } from "./stripe.ts";
import { ensureCustomer, userIdForCustomer } from "./members.ts";

export const TIERS = ["basic", "bronze", "silver", "gold"] as const;
export type Tier = typeof TIERS[number];
export const lookupKey = (t: Tier) => `rtt_${t}_monthly`;
const ACTIVE = ["active", "trialing", "past_due"];

export function portalConfig(ctx: Ctx): string | undefined {
  return ctx.env("STRIPE_PORTAL_CONFIGURATION") || undefined;
}

async function priceFor(ctx: Ctx, tier: Tier): Promise<{ id: string }> {
  const r = await stripeGet<{ data: { id: string; active: boolean }[] }>(ctx,
    `prices?active=true&lookup_keys[0]=${lookupKey(tier)}&limit=1`);
  if (!r.data?.[0]) throw new HttpError(503, "price_not_configured", "That membership isn't available right now.");
  return r.data[0];
}

async function currentMembership(ctx: Ctx, userId: string) {
  const rows = await select<{ membership_tier: string | null; subscription_status: string | null; stripe_subscription_id: string | null }>(
    ctx, `profiles?select=membership_tier,subscription_status,stripe_subscription_id&id=eq.${encodeURIComponent(userId)}`);
  return rows[0] ?? null;
}

/** Starts Checkout for a new subscription; existing subscribers are sent to the portal instead. */
export async function membershipCheckout(ctx: Ctx, user: { id: string; email?: string }, tierRaw: unknown) {
  const tier = String(tierRaw ?? "").toLowerCase() as Tier;
  if (!TIERS.includes(tier)) throw new HttpError(400, "bad_tier", "Please choose a membership.");
  const current = await currentMembership(ctx, user.id);
  const customer = await ensureCustomer(ctx, user);
  const site = siteUrl(ctx);
  if (current?.stripe_subscription_id && ACTIVE.includes(current.subscription_status ?? "")) {
    const portal = await stripeRequest<{ url: string }>(ctx, "billing_portal/sessions", {
      customer, return_url: `${site}/account.html#membership`, configuration: portalConfig(ctx),
    });
    return { url: portal.url, portal: true };
  }
  const price = await priceFor(ctx, tier);
  const session = await stripeRequest<{ id: string; url: string }>(ctx, "checkout/sessions", {
    mode: "subscription",
    customer,
    client_reference_id: user.id,
    line_items: [{ price: price.id, quantity: 1 }],
    allow_promotion_codes: false,
    billing_address_collection: "auto",
    metadata: { app: "rtt", supabase_user_id: user.id, tier },
    subscription_data: { metadata: { app: "rtt", supabase_user_id: user.id, tier } },
    success_url: `${site}/account.html?membership=success#membership`,
    cancel_url: `${site}/account.html?membership=cancelled#membership`,
  });
  return { url: session.url, id: session.id };
}

export async function membershipPortal(ctx: Ctx, user: { id: string; email?: string }) {
  const customer = await ensureCustomer(ctx, user);
  const s = await stripeRequest<{ url: string }>(ctx, "billing_portal/sessions", {
    customer, return_url: `${siteUrl(ctx)}/account.html#membership`, configuration: portalConfig(ctx),
  });
  return { url: s.url };
}

// deno-lint-ignore no-explicit-any
type Sub = Record<string, any>;

export const RTT_LOOKUP_KEYS: Record<string, Tier> = Object.fromEntries(TIERS.map((t) => [lookupKey(t), t]));

/** Tier from the subscription's price lookup key. Allowlist only: anything else (e.g. Hopewick prices
 *  on the shared Stripe account) is not an RTT subscription, whatever its metadata says. */
function tierOfSub(sub: Sub): Tier | null {
  return RTT_LOOKUP_KEYS[String(sub.items?.data?.[0]?.price?.lookup_key ?? "")] ?? null;
}

export function isRttSubscription(sub: Sub): boolean {
  return tierOfSub(sub) !== null;
}

/** Syncs one subscription object into profiles/public_profiles. Ignores non-RTT subscriptions (shared Stripe account). */
export async function syncSubscription(ctx: Ctx, sub: Sub): Promise<string> {
  if (!isRttSubscription(sub)) return "ignored_other_app";
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  const userId = sub.metadata?.supabase_user_id ?? (customer ? await userIdForCustomer(ctx, customer) : null);
  if (!userId) return "unknown_customer";
  const tier = tierOfSub(sub);
  if (!tier) return "unknown_price";
  const item = sub.items?.data?.[0] ?? {};
  const end = sub.current_period_end ?? item.current_period_end ?? null;   // moved onto items in newer API versions
  const cancelAtEnd = !!sub.cancel_at_period_end || (sub.cancel_at != null && sub.status === "active");
  return await rpc<string>(ctx, "apply_membership", {
    p_user_id: userId, p_tier: tier, p_status: String(sub.status ?? "incomplete"),
    p_period_end: end ? new Date(end * 1000).toISOString() : null,
    p_cancel_at_period_end: cancelAtEnd, p_subscription_id: sub.id, p_price_id: item.price?.id ?? null,
  });
}

/** Checkout can't attach an account tax ID, so add BRIDGE&BITE.CO's ABN to the RTT subscription
 *  itself; renewal invoices then show it. Best effort (never blocks the tier sync). */
export async function ensureSubscriptionTaxId(ctx: Ctx, sub: Sub): Promise<void> {
  const taxId = ctx.env("STRIPE_ACCOUNT_TAX_ID");
  if (!taxId || !isRttSubscription(sub)) return;
  const have: unknown[] = sub.invoice_settings?.account_tax_ids ?? [];
  if (have.some((t) => (typeof t === "string" ? t : (t as { id?: string })?.id) === taxId)) return;
  await stripeRequest(ctx, `subscriptions/${encodeURIComponent(sub.id)}`,
    { invoice_settings: { account_tax_ids: [taxId] } }).catch((e) => console.error("tax id", e));
}

export async function fetchSubscription(ctx: Ctx, id: string): Promise<Sub> {
  return await stripeGet<Sub>(ctx, `subscriptions/${encodeURIComponent(id)}`);
}
