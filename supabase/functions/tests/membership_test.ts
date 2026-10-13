// Membership checkout / portal / webhook sync, with Supabase and Stripe mocked (no network, no keys).
// deno test supabase/functions/tests/membership_test.ts
import { assert, assertEquals, assertMatch } from "jsr:@std/assert@1";
import { Ctx } from "../_shared/context.ts";
import { hmacSha256Hex } from "../_shared/stripe.ts";
import { handler as checkout } from "../create-checkout-session/handler.ts";
import { handler as portal } from "../create-portal-session/handler.ts";
import { handler as webhook } from "../stripe-webhook/handler.ts";

const SUPA = "http://supabase.test";
const USER = "00000000-0000-0000-0000-00000000000a";
const SUB = (over: Record<string, unknown> = {}) => ({
  id: "sub_1", object: "subscription", customer: "cus_1", status: "active", cancel_at_period_end: false,
  metadata: { app: "rtt", supabase_user_id: USER, tier: "silver" },
  items: { data: [{ current_period_end: 1900000000, price: { id: "price_s", lookup_key: "rtt_silver_monthly", metadata: { tier: "silver" } } }] },
  ...over,
});

function mock(o: { profile?: Record<string, unknown>; customer?: string | null; sub?: Record<string, unknown> } = {}) {
  const calls: { url: string; method: string; body: string }[] = [];
  const applied: any[] = [];
  const env: Record<string, string> = { SUPABASE_URL: SUPA, SUPABASE_SERVICE_ROLE_KEY: "svc", SUPABASE_ANON_KEY: "anon",
    STRIPE_SECRET_KEY: "sk_test_x", STRIPE_WEBHOOK_SECRET: "whsec_t", STRIPE_PORTAL_CONFIGURATION: "bpc_rtt",
    SITE_URL: "https://realtimetradersbrisbane.au" };
  const res = (s: number, b: unknown) => new Response(s === 204 ? null : JSON.stringify(b), { status: s });
  const ctx: Ctx = { env: (k) => env[k], now: () => new Date(), fetch: async (input, init) => {
    const url = String(input), body = init?.body ? String(init.body) : "";
    calls.push({ url, method: init?.method ?? "GET", body });
    if (url === `${SUPA}/auth/v1/user`) return new Headers(init?.headers).get("authorization") === "Bearer tok"
      ? res(200, { id: USER, email: "a@test.invalid" }) : res(401, {});
    if (url.startsWith(`${SUPA}/rest/v1/profiles`)) return res(200, o.profile ? [o.profile] : []);
    if (url.startsWith(`${SUPA}/rest/v1/member_stripe_customers`)) {
      if ((init?.method ?? "GET") === "POST") return res(201, []);
      return res(200, o.customer === null ? [] : [{ stripe_customer_id: o.customer ?? "cus_1", user_id: USER }]);
    }
    if (url === `${SUPA}/rest/v1/rpc/apply_membership`) { const a = JSON.parse(body); applied.push(a); return res(200, a.p_status === "active" ? a.p_tier : "free"); }
    if (url.startsWith(`${SUPA}/rest/v1/rpc/`)) return res(200, null);
    if (url.startsWith("https://api.stripe.com/v1/prices")) return res(200, { data: [{ id: "price_s", active: true }] });
    if (url.startsWith("https://api.stripe.com/v1/subscriptions/")) return res(200, o.sub ?? SUB());
    if (url === "https://api.stripe.com/v1/customers") return res(200, { id: "cus_new" });
    if (url === "https://api.stripe.com/v1/checkout/sessions") return res(200, { id: "cs_1", url: "https://checkout.stripe.com/c/pay/cs_1" });
    if (url === "https://api.stripe.com/v1/billing_portal/sessions") return res(200, { url: "https://billing.stripe.com/p/session/x" });
    throw new Error("unexpected fetch " + url);
  } };
  return { ctx, calls, applied };
}
const post = (body: unknown, tok = "tok") => new Request("https://fn.test", { method: "POST",
  headers: { authorization: `Bearer ${tok}`, "content-type": "application/json" }, body: JSON.stringify(body) });
async function hook(type: string, obj: Record<string, unknown>) {
  const payload = JSON.stringify({ id: "evt_" + type, type, data: { object: obj } });
  const t = Math.floor(Date.now() / 1000);
  return new Request("https://fn.test", { method: "POST", body: payload,
    headers: { "stripe-signature": `t=${t},v1=${await hmacSha256Hex("whsec_t", `${t}.${payload}`)}` } });
}

Deno.test("checkout: signed-out users are refused", async () => {
  const { ctx } = mock();
  assertEquals((await checkout(post({ tier: "silver" }, "bad"), ctx)).status, 401);
});

Deno.test("checkout: subscription session reuses the member's customer and the tier's lookup-key price", async () => {
  const { ctx, calls } = mock({ profile: { membership_tier: "free" } });
  const r = await checkout(post({ tier: "silver" }), ctx);
  assertEquals(r.status, 200);
  assertMatch((await r.json()).url, /checkout\.stripe\.com/);
  assert(calls.some((c) => c.url.includes("lookup_keys[0]=rtt_silver_monthly")));
  const s = new URLSearchParams(calls.find((c) => c.url.endsWith("/checkout/sessions"))!.body);
  assertEquals(s.get("mode"), "subscription");
  assertEquals(s.get("customer"), "cus_1");
  assertEquals(s.get("line_items[0][price]"), "price_s");
  assertEquals(s.get("subscription_data[metadata][supabase_user_id]"), USER);
  assertMatch(s.get("success_url")!, /account\.html\?membership=success/);
  assert(!calls.some((c) => c.url === "https://api.stripe.com/v1/customers"), "no duplicate customer");
});

Deno.test("checkout: rejects unknown tiers", async () => {
  const { ctx } = mock();
  assertEquals((await checkout(post({ tier: "platinum" }), ctx)).status, 400);
});

Deno.test("checkout: existing subscribers are sent to the portal (no second subscription)", async () => {
  const { ctx, calls } = mock({ profile: { membership_tier: "bronze", subscription_status: "active", stripe_subscription_id: "sub_1" } });
  const j = await (await checkout(post({ tier: "gold" }), ctx)).json();
  assertEquals(j.portal, true);
  assert(!calls.some((c) => c.url.endsWith("/checkout/sessions")));
});

Deno.test("portal: uses the RTT portal configuration", async () => {
  const { ctx, calls } = mock();
  assertMatch((await (await portal(post({}), ctx)).json()).url, /billing\.stripe\.com/);
  const b = new URLSearchParams(calls.find((c) => c.url.endsWith("/billing_portal/sessions"))!.body);
  assertEquals(b.get("configuration"), "bpc_rtt");
  assertEquals(b.get("customer"), "cus_1");
});

Deno.test("webhook: checkout.session.completed (subscription) sets tier, status and period end", async () => {
  const { ctx, applied } = mock();
  const r = await webhook(await hook("checkout.session.completed", { id: "cs_1", mode: "subscription", subscription: "sub_1", metadata: { app: "rtt" } }), ctx);
  assertEquals((await r.json()).result, "silver");
  assertEquals(applied[0].p_tier, "silver");
  assertEquals(applied[0].p_status, "active");
  assertEquals(applied[0].p_period_end, new Date(1900000000 * 1000).toISOString());
});

Deno.test("webhook: plan switch, cancellation and deletion are re-read from Stripe and applied", async () => {
  let m = mock({ sub: SUB({ items: { data: [{ current_period_end: 1900000000, price: { id: "price_g", lookup_key: "rtt_gold_monthly" } }] }, cancel_at_period_end: true }) });
  await webhook(await hook("customer.subscription.updated", { id: "sub_1" }), m.ctx);
  assertEquals([m.applied[0].p_tier, m.applied[0].p_cancel_at_period_end], ["gold", true]);
  m = mock({ sub: SUB({ status: "canceled" }) });
  const r = await webhook(await hook("customer.subscription.deleted", { id: "sub_1" }), m.ctx);
  assertEquals((await r.json()).result, "free");
});

Deno.test("webhook: invoice.payment_failed syncs the (past_due) subscription", async () => {
  const m = mock({ sub: SUB({ status: "past_due" }) });
  await webhook(await hook("invoice.payment_failed", { id: "in_1", subscription: "sub_1" }), m.ctx);
  assertEquals(m.applied[0].p_status, "past_due");
});

Deno.test("webhook: other apps' subscriptions on the shared Stripe account are ignored", async () => {
  const m = mock({ sub: { id: "sub_x", customer: "cus_x", status: "active", metadata: {}, items: { data: [{ price: { id: "p", lookup_key: null } }] } } });
  const r = await webhook(await hook("customer.subscription.created", { id: "sub_x" }), m.ctx);
  assertEquals((await r.json()).result, "ignored_other_app");
  assertEquals(m.applied.length, 0);
  const r2 = await webhook(await hook("checkout.session.completed", { id: "cs_x", mode: "payment", client_reference_id: USER }), m.ctx);
  assertEquals((await r2.json()).result, "ignored");
});

Deno.test("webhook: only allowlisted RTT lookup keys count, even if metadata claims app=rtt", async () => {
  const m = mock({ sub: SUB({ items: { data: [{ current_period_end: 1900000000, price: { id: "price_hw", lookup_key: "hopewick_plus_monthly", metadata: { tier: "gold" } } }] } }) });
  const r = await webhook(await hook("customer.subscription.updated", { id: "sub_1" }), m.ctx);
  assertEquals((await r.json()).result, "ignored_other_app");
  assertEquals(m.applied.length, 0);
});

Deno.test("checkout: hire payments carry app=rtt and the REALTIMETRADERS descriptor suffix", async () => {
  const src = await Deno.readTextFile(new URL("../create-checkout-session/handler.ts", import.meta.url));
  assertMatch(src, /statement_descriptor_suffix: "REALTIMETRADERS"/);
  assertMatch(src, /metadata: \{ app: "rtt", booking_id/);
});
