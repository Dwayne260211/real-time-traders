// Provider-agnostic email. EMAIL_PROVIDER=brevo (SMTP on port 465 with BREVO_SMTP_KEY, the same
// setup notify-listing-pending uses) or EMAIL_PROVIDER=resend plus EMAIL_API_KEY. EMAIL_FROM is optional for brevo.
// With no provider configured nothing is sent and callers are told so (never a fake "sent").
import { Ctx } from "./context.ts";

export interface Mail { to: string; subject: string; text: string; html?: string }
export interface SendResult { sent: boolean; reason?: string; id?: string }

const BREVO_FROM = '"Real Time Traders Brisbane" <admin@bridge-bite-co.com>';

export async function sendMail(ctx: Ctx, mail: Mail): Promise<SendResult> {
  const provider = (ctx.env("EMAIL_PROVIDER") ?? "").toLowerCase();
  if (provider === "brevo") {
    const pass = ctx.env("BREVO_SMTP_KEY");
    if (!pass) return { sent: false, reason: "email_not_configured" };
    try {
      const nodemailer = (await import("npm:nodemailer@6.9.16")).default;
      const tx = nodemailer.createTransport({ host: "smtp-relay.brevo.com", port: 465, secure: true,   // 587 is blocked on Edge Functions
        auth: { user: ctx.env("SMTP_USER") || "bdebd7001@smtp-brevo.com", pass } });
      const info = await tx.sendMail({ from: ctx.env("EMAIL_FROM") || BREVO_FROM, to: mail.to, subject: mail.subject,
        text: mail.text, html: mail.html, replyTo: ctx.env("EMAIL_REPLY_TO") || "realtimetraders101@gmail.com" });
      return { sent: true, id: info.messageId };
    } catch (e) {
      console.error("brevo send failed", e);
      return { sent: false, reason: "provider_error" };
    }
  }
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
