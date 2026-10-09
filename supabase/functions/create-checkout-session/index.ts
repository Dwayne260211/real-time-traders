// Supabase Edge Function entry point. The logic lives in handler.ts so it can be unit tested.
import { handler } from "./handler.ts";

Deno.serve((req) => handler(req));
