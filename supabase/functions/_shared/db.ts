// Tiny PostgREST client using the service role key (server side only).
import { Ctx, HttpError } from "./context.ts";

function base(ctx: Ctx) {
  const url = ctx.env("SUPABASE_URL");
  const key = ctx.env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new HttpError(503, "not_configured", "Supabase is not configured for this function.");
  return { url: url.replace(/\/+$/, ""), key };
}

// Postgres errors raised by the migration's functions, mapped to HTTP.
const DB_ERRORS: Record<string, [number, string]> = {
  booking_not_found: [404, "That booking was not found."],
  booking_not_payable: [409, "This booking can't be paid online now."],
  booking_not_cancellable: [409, "This booking can no longer be cancelled online."],
  pricing_rule_not_approved: [409, "Online prices haven't been approved yet. We'll confirm your price."],
  price_not_available: [409, "This item's price is on request. We'll confirm your price."],
  equipment_not_bookable: [409, "This item can't be booked online."],
  dates_unavailable: [409, "Sorry, those dates are no longer available."],
  start_in_past: [409, "The hire start date has passed."],
};

export async function rpc<T = unknown>(ctx: Ctx, fn: string, args: Record<string, unknown>): Promise<T> {
  const { url, key } = base(ctx);
  const res = await ctx.fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg: string = body?.message ?? "";
    const known = DB_ERRORS[msg];
    if (known) throw new HttpError(known[0], msg, known[1]);
    throw new Error(`rpc ${fn} failed: ${res.status} ${text}`);
  }
  return body as T;
}

export async function select<T = unknown>(ctx: Ctx, pathAndQuery: string): Promise<T[]> {
  const { url, key } = base(ctx);
  const res = await ctx.fetch(`${url}/rest/v1/${pathAndQuery}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`select ${pathAndQuery} failed: ${res.status} ${await res.text()}`);
  return await res.json() as T[];
}

export async function del(ctx: Ctx, pathAndQuery: string): Promise<void> {
  const { url, key } = base(ctx);
  await ctx.fetch(`${url}/rest/v1/${pathAndQuery}`, {
    method: "DELETE",
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
}

export interface AuthUser { id: string; email?: string }

/** Resolve the signed-in customer from their Supabase access token. */
export async function requireUser(ctx: Ctx, req: Request): Promise<AuthUser> {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!token) throw new HttpError(401, "sign_in_required", "Please sign in first.");
  const { url } = base(ctx);
  const apikey = ctx.env("SUPABASE_ANON_KEY") ?? ctx.env("SUPABASE_SERVICE_ROLE_KEY")!;
  const res = await ctx.fetch(`${url}/auth/v1/user`, { headers: { apikey, Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new HttpError(401, "sign_in_required", "Your sign-in has expired. Please sign in again.");
  const user = await res.json();
  if (!user?.id) throw new HttpError(401, "sign_in_required", "Please sign in first.");
  return { id: user.id, email: user.email };
}

export async function isAdmin(ctx: Ctx, userId: string): Promise<boolean> {
  const rows = await select(ctx, `user_roles?select=role&role=eq.admin&user_id=eq.${encodeURIComponent(userId)}`);
  return rows.length > 0;
}

export interface HireSettings {
  payments_live: boolean;
  pricing_rule: string | null;
  security_deposit_cents: number | null;
  deposit_collected_online: boolean | null;
  deposit_terms: string | null;
  id_requirements: string | null;
  pickup_options: string | null;
  delivery_available: boolean | null;
  delivery_options: string | null;
  late_return_policy: string | null;
  damage_policy: string | null;
  cancellation_terms: string | null;
  cancel_auto_refund_min_hours: number | null;
  cancel_auto_refund_percent: number | null;
}

export async function getSettings(ctx: Ctx): Promise<HireSettings> {
  const rows = await select<HireSettings>(ctx, "hire_settings?select=*&limit=1");
  if (!rows[0]) throw new Error("hire_settings row missing");
  return rows[0];
}
