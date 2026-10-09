// Minimal Stripe REST client (fetch only, no SDK) so it runs anywhere and is easy to mock.
// The secret key only ever comes from the Edge Function environment.
import { Ctx, HttpError } from "./context.ts";

export type KeyMode = "test" | "live";

export function stripeKey(ctx: Ctx): { key: string; mode: KeyMode } {
  const key = ctx.env("STRIPE_SECRET_KEY") ?? "";
  if (!key) throw new HttpError(503, "stripe_not_configured", "Online payments are not set up yet.");
  if (/^(sk|rk)_test_/.test(key)) return { key, mode: "test" };
  if (/^(sk|rk)_live_/.test(key)) return { key, mode: "live" };
  throw new HttpError(503, "stripe_not_configured", "Online payments are not set up correctly.");
}

/** Flattens {a:{b:[{c:1}]}} into Stripe's form encoding: a[b][0][c]=1 */
export function formEncode(obj: Record<string, unknown>, prefix = "", out = new URLSearchParams()): URLSearchParams {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) v.forEach((item, i) => {
      if (item !== null && typeof item === "object") formEncode(item as Record<string, unknown>, `${key}[${i}]`, out);
      else out.append(`${key}[${i}]`, String(item));
    });
    else if (typeof v === "object") formEncode(v as Record<string, unknown>, key, out);
    else out.append(key, String(v));
  }
  return out;
}

export async function stripeRequest<T = Record<string, unknown>>(
  ctx: Ctx, path: string, params: Record<string, unknown>, idempotencyKey?: string,
): Promise<T> {
  const { key } = stripeKey(ctx);
  const apiBase = (ctx.env("STRIPE_API_BASE") ?? "https://api.stripe.com").replace(/\/+$/, "");
  const headers: Record<string, string> = {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "Stripe-Version": "2024-06-20",
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  const res = await ctx.fetch(`${apiBase}/v1/${path}`, { method: "POST", headers, body: formEncode(params) });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Stripe ${path} failed: ${res.status} ${body?.error?.message ?? ""}`);
  return body as T;
}

function hex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(payload)));
}

/** Verifies a Stripe-Signature header (scheme v1, 5 minute tolerance). */
export async function verifyStripeSignature(
  payload: string, header: string | null, secret: string, nowSeconds: number, toleranceSeconds = 300,
): Promise<boolean> {
  if (!header || !secret) return false;
  const parts = header.split(",").map((p) => p.trim().split("="));
  const t = parts.find(([k]) => k === "t")?.[1];
  const sigs = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || !sigs.length || !/^\d+$/.test(t)) return false;
  if (Math.abs(nowSeconds - Number(t)) > toleranceSeconds) return false;
  const expected = await hmacSha256Hex(secret, `${t}.${payload}`);
  return sigs.some((s) => safeEqual(s, expected));
}
