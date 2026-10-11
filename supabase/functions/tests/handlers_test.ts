// Unit tests for the Edge Function logic with Supabase and Stripe fully mocked.
// No network, no real keys:  deno test supabase/functions/tests/handlers_test.ts
import { assert, assertEquals, assertMatch } from "jsr:@std/assert@1";
import { Ctx } from "../_shared/context.ts";
import { formEncode, hmacSha256Hex, verifyStripeSignature } from "../_shared/stripe.ts";
import { renderEmail, TBC } from "../_shared/notify.ts";
import { handler as checkout } from "../create-checkout-session/handler.ts";
import { handler as webhook } from "../stripe-webhook/handler.ts";
import { handler as cancel } from "../cancel-booking/handler.ts";
import { handler as confirmMail } from "../send-confirmation/handler.ts";

const SUPA = "http://supabase.test";
const BOOKING = "20000000-0000-0000-0000-0000000000c1";
const USER_A = "00000000-0000-0000-0000-00000000000a";

const EMPTY_SETTINGS = {
  payments_live: false, pricing_rule: null, security_deposit_cents: null, deposit_collected_online: null,
  deposit_terms: null, id_requirements: null, pickup_options: null, delivery_available: null, delivery_options: null,
  late_return_policy: null, damage_policy: null, cancellation_terms: null,
  cancel_auto_refund_min_hours: null, cancel_auto_refund_percent: null,
};

interface Call { url: string; method: string; body: string; headers: Headers }

function mock(opts: {
  env?: Record<string, string>; settings?: Record<string, unknown>;
  rpc?: Record<string, (args: any) => [number, unknown]>;
  stripe?: (path: string, body: URLSearchParams) => [number, unknown];
  admin?: boolean; booking?: Record<string, unknown>;
}) {
  const calls: Call[] = [];
  const env: Record<string, string> = {
    SUPABASE_URL: SUPA, SUPABASE_SERVICE_ROLE_KEY: "service-test", SUPABASE_ANON_KEY: "anon-test",
    SITE_URL: "https://realtimetradersbrisbane.au", ...opts.env,
  };
  const ctx: Ctx = {
    env: (k) => env[k],
    now: () => new Date(),
    fetch: async (input, init) => {
      const url = String(input);
      const body = init?.body ? String(init.body) : "";
      calls.push({ url, method: init?.method ?? "GET", body, headers: new Headers(init?.headers) });
      const res = (status: number, b: unknown) => new Response(status === 204 ? null : JSON.stringify(b), { status });
      if (url === `${SUPA}/auth/v1/user`) {
        const tok = new Headers(init?.headers).get("authorization");
        return tok === "Bearer tok-a" ? res(200, { id: USER_A, email: "a@test.invalid" }) : res(401, {});
      }
      if (url.startsWith(`${SUPA}/rest/v1/hire_settings`)) return res(200, [{ ...EMPTY_SETTINGS, ...opts.settings }]);
      if (url.startsWith(`${SUPA}/rest/v1/user_roles`)) return res(200, opts.admin ? [{ role: "admin" }] : []);
      if (url.startsWith(`${SUPA}/rest/v1/bookings`)) return res(200, opts.booking ? [opts.booking] : []);
      if (url.startsWith(`${SUPA}/rest/v1/email_log`)) return res(204, null);
      const m = url.match(/\/rest\/v1\/rpc\/(\w+)$/);
      if (m) {
        const fn = opts.rpc?.[m[1]];
        if (fn) { const [s, b] = fn(JSON.parse(body || "{}")); return res(s, b); }
        return res(200, null);
      }
      if (url.startsWith("https://api.stripe.com/v1/")) {
        const [s, b] = opts.stripe?.(url.slice("https://api.stripe.com/v1/".length), new URLSearchParams(body)) ?? [200, {}];
        return res(s, b);
      }
      if (url === "https://api.resend.com/emails") return res(200, { id: "email_test_1" });
      throw new Error("unexpected fetch " + url);
    },
  };
  return { ctx, calls };
}

function post(body: unknown, token = "tok-a") {
  return new Request("https://fn.test/x", {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json",
                               origin: "https://realtimetradersbrisbane.au" },
    body: JSON.stringify(body),
  });
}

const CHECKOUT_ROW = {
  booking_id: BOOKING, reference: "ABCD1234", equipment_name: "TEST ITEM", start_date: "2030-06-10",
  end_date: "2030-06-12", days: 3, hire_total_cents: 3000, deposit_cents: null,
  customer_email: "a@test.invalid", expires_at: 1900000000,
};

// ---------------------------------------------------------------- checkout
Deno.test("checkout: refused while payments are not live (no Stripe call, no hold)", async () => {
  const { ctx, calls } = mock({ env: { STRIPE_SECRET_KEY: "sk_test_x" } });
  const r = await checkout(post({ booking_id: BOOKING }), ctx);
  assertEquals(r.status, 403);
  assertEquals((await r.json()).error, "payments_not_live");
  assert(!calls.some((c) => c.url.includes("stripe.com") || c.url.includes("begin_checkout")));
});

Deno.test("checkout: requires sign-in", async () => {
  const { ctx } = mock({ env: { PAYMENTS_LIVE: "true", STRIPE_SECRET_KEY: "sk_test_x" } });
  const r = await checkout(post({ booking_id: BOOKING }, "bad"), ctx);
  assertEquals(r.status, 401);
});

Deno.test("checkout: no Stripe key configured -> 503", async () => {
  const { ctx } = mock({ env: { PAYMENTS_LIVE: "true" } });
  const r = await checkout(post({ booking_id: BOOKING }), ctx);
  assertEquals(r.status, 503);
  assertEquals((await r.json()).error, "stripe_not_configured");
});

Deno.test("checkout: live key refused unless BOTH env flag and owner setting are on", async () => {
  for (const [env, setting] of [[true, false], [false, true]]) {
    const { ctx, calls } = mock({
      env: { STRIPE_SECRET_KEY: "sk_live_x", ...(env ? { PAYMENTS_LIVE: "true" } : {}) },
      settings: { payments_live: setting },
    });
    const r = await checkout(post({ booking_id: BOOKING }), ctx);
    assertEquals(r.status, 403);
    assertEquals((await r.json()).error, "live_payments_not_authorised");
    assert(!calls.some((c) => c.url.includes("stripe.com")));
  }
});

Deno.test("checkout: test mode creates a session priced by the SERVER, AUD, with expiry and metadata", async () => {
  let sent: URLSearchParams | null = null;
  let idem = "";
  const { ctx, calls } = mock({
    env: { STRIPE_SECRET_KEY: "sk_test_x" }, settings: { payments_live: true },
    rpc: { begin_checkout: () => [200, CHECKOUT_ROW] },
    stripe: (path, body) => { sent = body; return [200, { id: "cs_test_1", url: "https://checkout.stripe.com/c/pay/cs_test_1" }]; },
  });
  const r = await checkout(post({ booking_id: BOOKING, amount: 1 /* ignored */ }), ctx);
  assertEquals(r.status, 200);
  assertEquals((await r.json()).url, "https://checkout.stripe.com/c/pay/cs_test_1");
  const s = sent as unknown as URLSearchParams;
  assertEquals(s.get("mode"), "payment");
  assertEquals(s.get("line_items[0][price_data][unit_amount]"), "3000");
  assertEquals(s.get("line_items[0][price_data][currency]"), "aud");
  assertEquals(s.get("line_items[1][price_data][unit_amount]"), null, "no deposit line when deposit not configured");
  assertEquals(s.get("metadata[booking_id]"), BOOKING);
  assertEquals(s.get("payment_intent_data[receipt_email]"), "a@test.invalid");
  assertEquals(s.get("expires_at"), "1900000000");
  assertMatch(s.get("success_url")!, /^https:\/\/realtimetradersbrisbane\.au\/my-bookings\.html/);
  idem = calls.find((c) => c.url.includes("checkout/sessions"))!.headers.get("idempotency-key") ?? "";
  assertEquals(idem, `checkout-${BOOKING}-1900000000`);
  assert(calls.some((c) => c.url.endsWith("/rpc/attach_checkout_session")));
});

Deno.test("checkout: deposit line added only when configured to be collected online", async () => {
  let sent: URLSearchParams | null = null;
  const { ctx } = mock({
    env: { STRIPE_SECRET_KEY: "sk_test_x", PAYMENTS_LIVE: "true" },
    rpc: { begin_checkout: () => [200, { ...CHECKOUT_ROW, deposit_cents: 10000 }] },
    stripe: (_p, body) => { sent = body; return [200, { id: "cs_test_2", url: "u" }]; },
  });
  await checkout(post({ booking_id: BOOKING }), ctx);
  assertEquals((sent as unknown as URLSearchParams).get("line_items[1][price_data][unit_amount]"), "10000");
});

Deno.test("checkout: dates taken -> 409 and Stripe never called", async () => {
  const { ctx, calls } = mock({
    env: { STRIPE_SECRET_KEY: "sk_test_x", PAYMENTS_LIVE: "true" },
    rpc: { begin_checkout: () => [409, { code: "23P01", message: "dates_unavailable" }] },
  });
  const r = await checkout(post({ booking_id: BOOKING }), ctx);
  assertEquals(r.status, 409);
  assertEquals((await r.json()).error, "dates_unavailable");
  assert(!calls.some((c) => c.url.includes("stripe.com")));
});

Deno.test("checkout: Stripe failure releases the date hold", async () => {
  const { ctx, calls } = mock({
    env: { STRIPE_SECRET_KEY: "sk_test_x", PAYMENTS_LIVE: "true" },
    rpc: { begin_checkout: () => [200, CHECKOUT_ROW] },
    stripe: () => [500, { error: { message: "boom" } }],
  });
  const r = await checkout(post({ booking_id: BOOKING }), ctx);
  assertEquals(r.status, 502);
  assert(calls.some((c) => c.url.endsWith("/rpc/release_checkout")));
});

// ---------------------------------------------------------------- webhook
async function signed(payload: string, secret: string, t = Math.floor(Date.now() / 1000)) {
  return `t=${t},v1=${await hmacSha256Hex(secret, `${t}.${payload}`)}`;
}

Deno.test("signature: valid, tampered, wrong secret and stale timestamps", async () => {
  const p = '{"id":"evt_1"}';
  const now = Math.floor(Date.now() / 1000);
  assert(await verifyStripeSignature(p, await signed(p, "whsec_a"), "whsec_a", now));
  assert(!(await verifyStripeSignature(p + " ", await signed(p, "whsec_a"), "whsec_a", now)));
  assert(!(await verifyStripeSignature(p, await signed(p, "whsec_b"), "whsec_a", now)));
  assert(!(await verifyStripeSignature(p, await signed(p, "whsec_a", now - 3600), "whsec_a", now)));
  assert(!(await verifyStripeSignature(p, null, "whsec_a", now)));
  assert(!(await verifyStripeSignature(p, await signed(p, "x"), "", now)), "empty secret never verifies");
});

function event(type: string, obj: Record<string, unknown>) {
  return JSON.stringify({ id: "evt_" + crypto.randomUUID(), type, data: { object: obj } });
}

Deno.test("webhook: rejects unsigned requests without touching the database", async () => {
  const { ctx, calls } = mock({ env: { STRIPE_WEBHOOK_SECRET: "whsec_t" } });
  const r = await webhook(new Request("https://fn.test", { method: "POST", body: event("checkout.session.completed", {}) }), ctx);
  assertEquals(r.status, 400);
  assertEquals(calls.length, 0);
});

Deno.test("webhook: paid checkout confirms the booking and emails the customer", async () => {
  const confirmArgs: any[] = [];
  const { ctx, calls } = mock({
    env: { STRIPE_WEBHOOK_SECRET: "whsec_t", EMAIL_PROVIDER: "resend", EMAIL_API_KEY: "re_test", EMAIL_FROM: "hire@example.test" },
    rpc: { confirm_paid_booking: (a) => { confirmArgs.push(a); return [200, "confirmed"]; }, claim_email: () => [200, true] },
    booking: { id: BOOKING, reference: "ABCD1234", equipment_name: "TEST ITEM", customer_id: USER_A, customer_name: "A",
               customer_email: "a@test.invalid", start_date: "2030-06-10", end_date: "2030-06-12", hire_days: 3,
               hire_total_cents: 3000, deposit_cents: null, status: "confirmed", payment_status: "paid",
               fulfilment: null, amount_paid_cents: 3000, amount_refunded_cents: 0 },
  });
  const body = event("checkout.session.completed", {
    id: "cs_test_1", payment_status: "paid", payment_intent: "pi_test_1", amount_total: 3000,
    metadata: { booking_id: BOOKING },
  });
  const r = await webhook(new Request("https://fn.test", { method: "POST", body, headers: { "stripe-signature": await signed(body, "whsec_t") } }), ctx);
  assertEquals(r.status, 200);
  assertEquals((await r.json()).result, "confirmed");
  assertEquals(confirmArgs[0], { p_booking_id: BOOKING, p_session_id: "cs_test_1", p_payment_intent: "pi_test_1", p_amount_cents: 3000 });
  const mail = calls.find((c) => c.url === "https://api.resend.com/emails");
  assert(mail, "confirmation email sent");
  assertMatch(JSON.parse(mail!.body).subject, /confirmed/);
  assert(calls.some((c) => c.url.endsWith("/rpc/record_stripe_event")));
});

Deno.test("webhook: racing payment for taken dates is reported as conflict, not confirmed", async () => {
  const { ctx } = mock({
    env: { STRIPE_WEBHOOK_SECRET: "whsec_t" },
    rpc: { confirm_paid_booking: () => [200, "conflict"], claim_email: () => [200, true] },
  });
  const body = event("checkout.session.completed", { id: "cs", payment_status: "paid", payment_intent: "pi", amount_total: 1, client_reference_id: BOOKING });
  const r = await webhook(new Request("https://fn.test", { method: "POST", body, headers: { "stripe-signature": await signed(body, "whsec_t") } }), ctx);
  assertEquals((await r.json()).result, "conflict");
});

Deno.test("webhook: unpaid (async) completion does not confirm; expiry releases the hold", async () => {
  const { ctx, calls } = mock({ env: { STRIPE_WEBHOOK_SECRET: "whsec_t" } });
  let body = event("checkout.session.completed", { id: "cs", payment_status: "unpaid", metadata: { booking_id: BOOKING } });
  let r = await webhook(new Request("https://fn.test", { method: "POST", body, headers: { "stripe-signature": await signed(body, "whsec_t") } }), ctx);
  assertEquals((await r.json()).result, "awaiting_payment");
  assert(!calls.some((c) => c.url.endsWith("/rpc/confirm_paid_booking")));
  body = event("checkout.session.expired", { id: "cs", metadata: { booking_id: BOOKING } });
  r = await webhook(new Request("https://fn.test", { method: "POST", body, headers: { "stripe-signature": await signed(body, "whsec_t") } }), ctx);
  assertEquals((await r.json()).result, "released");
});

// ---------------------------------------------------------------- cancel
Deno.test("cancel: no terms configured -> admin review, no refund call", async () => {
  const { ctx, calls } = mock({
    env: { STRIPE_SECRET_KEY: "sk_test_x" },
    rpc: { decide_cancellation: () => [200, { action: "review", refund_cents: 0, reason: "no_cancellation_terms_configured" }],
           claim_email: () => [200, true] },
  });
  const r = await cancel(post({ booking_id: BOOKING }), ctx);
  const j = await r.json();
  assertEquals(r.status, 200);
  assertEquals(j.status, "review");
  assert(!calls.some((c) => c.url.includes("/v1/refunds")));
});

Deno.test("cancel: configured terms -> Stripe refund with idempotency key, then recorded", async () => {
  let refundBody: URLSearchParams | null = null;
  const recorded: any[] = [];
  const { ctx, calls } = mock({
    env: { STRIPE_SECRET_KEY: "sk_test_x" },
    rpc: { decide_cancellation: () => [200, { action: "refund", refund_cents: 1500, payment_intent: "pi_test_b" }],
           record_refund: (a) => { recorded.push(a); return [200, null]; }, claim_email: () => [200, true] },
    stripe: (path, body) => { if (path === "refunds") refundBody = body; return [200, { id: "re_1" }]; },
  });
  const r = await cancel(post({ booking_id: BOOKING, reason: "plans changed" }), ctx);
  assertEquals((await r.json()).refund_cents, 1500);
  const rb = refundBody as unknown as URLSearchParams;
  assertEquals(rb.get("payment_intent"), "pi_test_b");
  assertEquals(rb.get("amount"), "1500");
  assertEquals(calls.find((c) => c.url.endsWith("/v1/refunds"))!.headers.get("idempotency-key"), `refund-${BOOKING}`);
  assertEquals(recorded[0], { p_booking_id: BOOKING, p_refund_cents: 1500, p_ok: true });
});

Deno.test("cancel: unpaid request cancels and expires any open checkout", async () => {
  const { ctx, calls } = mock({
    env: { STRIPE_SECRET_KEY: "sk_test_x" },
    rpc: { decide_cancellation: () => [200, { action: "cancelled", refund_cents: 0, checkout_session: "cs_open" }],
           claim_email: () => [200, true] },
  });
  const r = await cancel(post({ booking_id: BOOKING }), ctx);
  assertEquals((await r.json()).status, "cancelled");
  assert(calls.some((c) => c.url.endsWith("/v1/checkout/sessions/cs_open/expire")));
});

Deno.test("cancel: someone else's booking -> 404", async () => {
  const { ctx } = mock({ rpc: { decide_cancellation: () => [404, { message: "booking_not_found" }] } });
  const r = await cancel(post({ booking_id: BOOKING }), ctx);
  assertEquals(r.status, 404);
});

// ---------------------------------------------------------------- email
Deno.test("send-confirmation: customers can only send request_received for their own booking", async () => {
  const own = { id: BOOKING, customer_id: USER_A };
  let { ctx } = mock({ booking: own });
  assertEquals((await confirmMail(post({ booking_id: BOOKING, kind: "confirmed" }), ctx)).status, 403);
  ({ ctx } = mock({ booking: { ...own, customer_id: "someone-else" } }));
  assertEquals((await confirmMail(post({ booking_id: BOOKING, kind: "request_received" }), ctx)).status, 404);
});

Deno.test("send-confirmation: with no email provider it reports not sent (never a fake success)", async () => {
  const booking = { id: BOOKING, reference: "R", equipment_name: "TEST", customer_id: USER_A, customer_name: "A",
    customer_email: "a@test.invalid", start_date: "2030-06-10", end_date: "2030-06-12", hire_days: 3,
    hire_total_cents: null, deposit_cents: null, status: "pending", payment_status: "unpaid", fulfilment: null,
    amount_paid_cents: null, amount_refunded_cents: 0 };
  const { ctx, calls } = mock({ booking, rpc: { claim_email: () => [200, true] } });
  const r = await confirmMail(post({ booking_id: BOOKING, kind: "request_received" }), ctx);
  assertEquals(await r.json(), { sent: false, reason: "email_not_configured" });
  assert(calls.some((c) => c.method === "DELETE" && c.url.includes("email_log")), "claim released for retry");
});

Deno.test("emails say 'Terms to be confirmed' for every empty policy and never add GST", () => {
  const b = { id: BOOKING, reference: "R", equipment_name: "TEST", customer_id: USER_A, customer_name: "A",
    customer_email: "a@test.invalid", start_date: "2030-06-10", end_date: "2030-06-12", hire_days: 3,
    hire_total_cents: 3000, deposit_cents: null, status: "pending", payment_status: "unpaid", fulfilment: null,
    amount_paid_cents: null, amount_refunded_cents: 0 };
  const { text } = renderEmail("request_received", b, EMPTY_SETTINGS, "https://x");
  assertEquals(text.split(TBC).length - 1, 7);
  assertMatch(text, /NOT confirmed yet/);
  assertMatch(text, /\$30\.00 \(no GST/);
  assert(!/0422|422 909/.test(text), "no phone number in emails");
});

Deno.test("formEncode flattens nested Stripe params", () => {
  const f = formEncode({ a: 1, b: { c: [{ d: "x" }, 2] }, n: null });
  assertEquals(f.toString(), "a=1&b%5Bc%5D%5B0%5D%5Bd%5D=x&b%5Bc%5D%5B1%5D=2");
});
