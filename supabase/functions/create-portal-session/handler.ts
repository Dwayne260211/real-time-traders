// POST {} with the member's Supabase access token -> Stripe Customer Portal URL
// (upgrade/downgrade between tiers, cancel at period end, update card, invoices).
import { endpoint } from "../_shared/context.ts";
import { requireUser } from "../_shared/db.ts";
import { membershipPortal } from "../_shared/membership.ts";

export const handler = endpoint(async (req, ctx) => membershipPortal(ctx, await requireUser(ctx, req)));
