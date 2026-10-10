// Shared runtime context so every handler can be tested with fake env + fetch.
export interface Ctx {
  env: (key: string) => string | undefined;
  fetch: typeof fetch;
  now: () => Date;
}

export function defaultCtx(): Ctx {
  return {
    env: (k) => Deno.env.get(k),
    fetch: (...a) => fetch(...a),
    now: () => new Date(),
  };
}

export class HttpError extends Error {
  constructor(public status: number, public code: string, message?: string) {
    super(message ?? code);
  }
}

export function siteUrl(ctx: Ctx): string {
  return (ctx.env("SITE_URL") ?? "https://realtimetradersbrisbane.au").replace(/\/+$/, "");
}

export function corsHeaders(ctx: Ctx, req: Request): Record<string, string> {
  const allowed = (ctx.env("ALLOWED_ORIGINS") ?? new URL(siteUrl(ctx)).origin)
    .split(",").map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function json(ctx: Ctx, req: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(ctx, req) },
  });
}

/** Wraps a handler with CORS preflight, POST-only and error mapping. */
export function endpoint(fn: (req: Request, ctx: Ctx) => Promise<unknown>) {
  return async (req: Request, ctx: Ctx = defaultCtx()): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(ctx, req) });
    if (req.method !== "POST") return json(ctx, req, 405, { error: "method_not_allowed" });
    try {
      return json(ctx, req, 200, await fn(req, ctx));
    } catch (e) {
      if (e instanceof HttpError) return json(ctx, req, e.status, { error: e.code, message: e.message });
      console.error(e);
      return json(ctx, req, 500, { error: "server_error", message: "Something went wrong. Please call us." });
    }
  };
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    if (body && typeof body === "object") return body as Record<string, unknown>;
  } catch { /* fall through */ }
  throw new HttpError(400, "bad_request", "Expected a JSON body.");
}

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
