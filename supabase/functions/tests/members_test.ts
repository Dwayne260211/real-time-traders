// Unit tests for member card saving (create-setup-intent, stripe-webhook card events). No network.
import { assertEquals } from "jsr:@std/assert@1";
import { Ctx } from "../_shared/context.ts";
import { hmacSha256Hex } from "../_shared/stripe.ts";
import { handler as setup } from "../create-setup-intent/handler.ts";
import { handler as webhook } from "../stripe-webhook/handler.ts";

const SUPA = "http://supabase.test";
const USER = "00000000-0000-0000-0000-00000000000a";

function ctx(customers: Record<string, string>) {
  const calls: { url: string; method: string; body: string }[] = [];
  const env: Record<string, string> = { SUPABASE_URL: SUPA, SUPABASE_SERVICE_ROLE_KEY: "svc", SUPABASE_ANON_KEY: "anon",
    STRIPE_SECRET_KEY: "sk_test_x", STRIPE_WEBHOOK_SECRET: "whsec_x" };
  const c: Ctx = { env: (k) => env[k], now: () => new Date(), fetch: async (input, init) => {
    const url = String(input), body = init?.body ? String(init.body) : "", method = init?.method ?? "GET";
    calls.push({ url, method, body });
    const r = (s: number, b: unknown) => new Response(s === 201 ? null : JSON.stringify(b), { status: s });
    if (url === `${SUPA}/auth/v1/user`) return r(200, { id: USER, email: "a@test.invalid" });
    if (url.startsWith(`${SUPA}/rest/v1/member_stripe_customers?select`)) {
      const byUser = url.match(/user_id=eq\.([^&]+)/)?.[1]; const byCus = url.match(/stripe_customer_id=eq\.([^&]+)/)?.[1];
      if (byUser && customers[byUser]) return r(200, [{ stripe_customer_id: customers[byUser] }]);
      if (byCus) { const u = Object.keys(customers).find((k) => customers[k] === byCus); return r(200, u ? [{ user_id: u }] : []); }
      return r(200, []);
    }
    if (url.startsWith(`${SUPA}/rest/v1/`) && method === "POST") return r(201, null);
    if (url.startsWith(`${SUPA}/rest/v1/rpc/`)) return r(200, null);
    if (url === "https://api.stripe.com/v1/customers") return r(200, { id: "cus_new" });
    if (url === "https://api.stripe.com/v1/setup_intents") return r(200, { id: "seti_1", client_secret: "seti_1_secret_x" });
    if (url === "https://api.stripe.com/v1/payment_methods/pm_1") return r(200, { id: "pm_1", type: "card", customer: "cus_new", livemode: false, card: { brand: "visa", last4: "4242", exp_month: 12, exp_year: 2030, fingerprint: "secret-ish" } });
    return r(404, {});
  } };
  return { c, calls };
}

Deno.test("create-setup-intent creates a customer once and returns the client_secret", async () => {
  const { c, calls } = ctx({});
  const res = await setup(new Request("http://x", { method: "POST", headers: { authorization: "Bearer t" }, body: "{}" }), c);
  assertEquals(res.status, 200);
  assertEquals((await res.json()).client_secret, "seti_1_secret_x");
  assertEquals(calls.filter((x) => x.url.endsWith("/v1/customers")).length, 1);
  assertEquals(calls.some((x) => x.url.includes("member_stripe_customers?on_conflict") && x.body.includes("cus_new")), true);
  const si = new URLSearchParams(calls.find((x) => x.url.endsWith("/setup_intents"))!.body);
  assertEquals(si.get("customer"), "cus_new");
  assertEquals(si.get("metadata[supabase_user_id]"), USER);
});

Deno.test("create-setup-intent reuses an existing customer and requires sign-in", async () => {
  const { c, calls } = ctx({ [USER]: "cus_old" });
  await setup(new Request("http://x", { method: "POST", headers: { authorization: "Bearer t" }, body: "{}" }), c);
  assertEquals(calls.some((x) => x.url.endsWith("/v1/customers")), false);
  const res = await setup(new Request("http://x", { method: "POST", body: "{}" }), c);
  assertEquals(res.status, 401);
});

Deno.test("stripe-webhook setup_intent.succeeded stores only the card summary", async () => {
  const { c, calls } = ctx({ [USER]: "cus_new" });
  const payload = JSON.stringify({ id: "evt_1", type: "setup_intent.succeeded", data: { object: { id: "seti_1", payment_method: "pm_1", metadata: { supabase_user_id: USER } } } });
  const t = Math.floor(Date.now() / 1000);
  const sig = `t=${t},v1=${await hmacSha256Hex("whsec_x", `${t}.${payload}`)}`;
  const res = await webhook(new Request("http://x", { method: "POST", headers: { "stripe-signature": sig }, body: payload }), c);
  assertEquals((await res.json()).result, "card_saved");
  const row = JSON.parse(calls.find((x) => x.url.includes("member_payment_methods?on_conflict"))!.body);
  assertEquals(row, { user_id: USER, stripe_customer_id: "cus_new", stripe_payment_method_id: "pm_1", brand: "visa", last4: "4242",
    exp_month: 12, exp_year: 2030, livemode: false, updated_at: row.updated_at });
});
