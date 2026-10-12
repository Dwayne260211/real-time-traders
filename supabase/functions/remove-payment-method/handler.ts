// POST { payment_method_id } with the member's Supabase access token.
// Detaches the card in Stripe (only if it belongs to this member's customer) and deletes the summary row.
import { endpoint, HttpError, readJson } from "../_shared/context.ts";
import { del, requireUser, select } from "../_shared/db.ts";
import { stripeRequest } from "../_shared/stripe.ts";

export const handler = endpoint(async (req, ctx) => {
  const user = await requireUser(ctx, req);
  const body = await readJson(req);
  const pmId = String(body.payment_method_id ?? "");
  if (!/^pm_[A-Za-z0-9_]+$/.test(pmId)) throw new HttpError(400, "bad_request", "Missing card.");
  const rows = await select(ctx, `member_payment_methods?select=id&user_id=eq.${encodeURIComponent(user.id)}&stripe_payment_method_id=eq.${encodeURIComponent(pmId)}`);
  if (!rows.length) throw new HttpError(404, "not_found", "That card wasn't found on your account.");
  await stripeRequest(ctx, `payment_methods/${encodeURIComponent(pmId)}/detach`, {});
  await del(ctx, `member_payment_methods?user_id=eq.${encodeURIComponent(user.id)}&stripe_payment_method_id=eq.${encodeURIComponent(pmId)}`);
  return { removed: true };
});
