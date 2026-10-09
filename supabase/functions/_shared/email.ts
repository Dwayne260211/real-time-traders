// Provider-agnostic email. Set EMAIL_PROVIDER=resend plus EMAIL_API_KEY and EMAIL_FROM.
// With no provider configured nothing is sent and callers are told so (never a fake "sent").
import { Ctx } from "./context.ts";

export interface Mail { to: string; subject: string; text: string; html?: string }
export interface SendResult { sent: boolean; reason?: string; id?: string }

export async function sendMail(ctx: Ctx, mail: Mail): Promise<SendResult> {
  const provider = (ctx.env("EMAIL_PROVIDER") ?? "").toLowerCase();
  const from = ctx.env("EMAIL_FROM");
  const apiKey = ctx.env("EMAIL_API_KEY");
  if (!provider || provider === "none" || !from || !apiKey) return { sent: false, reason: "email_not_configured" };
  if (provider === "resend") {
    const res = await ctx.fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [mail.to], subject: mail.subject, text: mail.text, html: mail.html,
        reply_to: ctx.env("EMAIL_REPLY_TO") || undefined,
      }),
    });
    if (!res.ok) return { sent: false, reason: `provider_error_${res.status}` };
    const body = await res.json().catch(() => ({}));
    return { sent: true, id: body?.id };
  }
  return { sent: false, reason: "unsupported_provider" };
}
