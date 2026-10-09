// Booking emails: request received, confirmed, cancelled, cancellation review, payment clash.
// Payment receipts come from Stripe itself (receipt_email on the PaymentIntent).
import { Ctx, siteUrl } from "./context.ts";
import { del, getSettings, HireSettings, rpc, select } from "./db.ts";
import { sendMail, SendResult } from "./email.ts";

export type EmailKind = "request_received" | "confirmed" | "cancelled" | "cancel_review" | "paid_conflict";
export const EMAIL_KINDS: EmailKind[] = ["request_received", "confirmed", "cancelled", "cancel_review", "paid_conflict"];

export interface BookingRow {
  id: string; reference: string; equipment_name: string; customer_id: string | null;
  customer_name: string; customer_email: string; start_date: string; end_date: string; hire_days: number;
  hire_total_cents: number | null; deposit_cents: number | null; status: string; payment_status: string;
  fulfilment: string | null; amount_paid_cents: number | null; amount_refunded_cents: number;
}

export const TBC = "Terms to be confirmed";

export function money(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "To be confirmed";
  return "$" + (cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ausDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}

function termsBlock(s: HireSettings): string {
  const line = (label: string, v: string | null) => `${label}: ${v && v.trim() ? v.trim() : TBC}`;
  const deposit = s.security_deposit_cents === null ? TBC
    : `${money(s.security_deposit_cents)}${s.deposit_terms ? ". " + s.deposit_terms : ""}`;
  return [
    `Security deposit: ${deposit}`,
    line("ID requirements", s.id_requirements),
    line("Pickup", s.pickup_options),
    line("Delivery", s.delivery_options),
    line("Late returns", s.late_return_policy),
    line("Damage", s.damage_policy),
    line("Cancellations", s.cancellation_terms),
  ].join("\n");
}

export function renderEmail(kind: EmailKind, b: BookingRow, s: HireSettings, site: string): { subject: string; text: string } {
  const head = [
    `Booking reference: ${b.reference}`,
    `Item: ${b.equipment_name}`,
    `Dates: ${ausDate(b.start_date)} to ${ausDate(b.end_date)} (${b.hire_days} day${b.hire_days === 1 ? "" : "s"})`,
    `Hire price: ${money(b.hire_total_cents)} (no GST: Real Time Traders is not registered for GST)`,
  ].join("\n");
  const manage = `View or manage your bookings: ${site}/my-bookings.html`;
  const sign = "Real Time Traders Pty Ltd\nABN 54 642 170 438";
  const hi = `Hi ${b.customer_name},`;
  switch (kind) {
    case "request_received":
      return {
        subject: `Hire request received: ${b.equipment_name} (${b.reference})`,
        text: `${hi}\n\nThanks, we've received your hire request. It is NOT confirmed yet: we'll check it and get back to you to confirm the dates and price.\n\n${head}\n\n${termsBlock(s)}\n\n${manage}\n\n${sign}`,
      };
    case "confirmed":
      return {
        subject: `Hire booking confirmed: ${b.equipment_name} (${b.reference})`,
        text: `${hi}\n\nYour hire booking is confirmed.${b.payment_status === "paid" ? ` We've received your payment of ${money(b.amount_paid_cents)}; Stripe emails your payment receipt separately.` : ""}\n\n${head}\n\n${termsBlock(s)}\n\n${manage}\n\n${sign}`,
      };
    case "cancelled":
      return {
        subject: `Hire booking cancelled: ${b.equipment_name} (${b.reference})`,
        text: `${hi}\n\nYour hire booking has been cancelled.${b.amount_refunded_cents > 0 ? ` A refund of ${money(b.amount_refunded_cents)} has been sent to your card; banks usually take 5 to 10 business days to show it.` : ""}\n\n${head}\n\n${manage}\n\n${sign}`,
      };
    case "cancel_review":
      return {
        subject: `Cancellation request received: ${b.equipment_name} (${b.reference})`,
        text: `${hi}\n\nWe've received your request to cancel. Your booking stays in place until we've reviewed it against the hire terms; we'll contact you about the outcome and any refund.\n\n${head}\n\n${manage}\n\n${sign}`,
      };
    case "paid_conflict":
      return {
        subject: `About your hire payment: ${b.equipment_name} (${b.reference})`,
        text: `${hi}\n\nWe received your payment, but the dates you chose were taken while you were paying. Your booking is not confirmed yet. We'll contact you shortly to offer other dates or a full refund.\n\n${head}\n\n${manage}\n\n${sign}`,
      };
  }
}

export async function loadBooking(ctx: Ctx, id: string): Promise<BookingRow | null> {
  const rows = await select<BookingRow>(ctx, `bookings?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  return rows[0] ?? null;
}

/** Sends one email of each kind per booking (de-duplicated in the database). Also alerts the admin. */
export async function sendBookingEmail(ctx: Ctx, bookingId: string, kind: EmailKind): Promise<SendResult> {
  const b = await loadBooking(ctx, bookingId);
  if (!b) return { sent: false, reason: "booking_not_found" };
  const s = await getSettings(ctx);
  const claimed = await rpc<boolean>(ctx, "claim_email", { p_booking_id: bookingId, p_kind: kind });
  if (!claimed) return { sent: false, reason: "already_sent" };
  const mail = renderEmail(kind, b, s, siteUrl(ctx));
  const result = await sendMail(ctx, { to: b.customer_email, ...mail });
  if (!result.sent) {
    // Release the claim so it can be retried once email is configured.
    await del(ctx, `email_log?booking_id=eq.${bookingId}&kind=eq.${kind}`);
  }
  const admin = ctx.env("ADMIN_NOTIFY_EMAIL");
  if (admin) {
    await sendMail(ctx, {
      to: admin,
      subject: `[Hire admin] ${kind.replace("_", " ")}: ${b.equipment_name} (${b.reference})`,
      text: `${mail.text}\n\n---\nCustomer: ${b.customer_name} <${b.customer_email}>\nStatus: ${b.status} / payment ${b.payment_status}\nOpen the admin page: ${siteUrl(ctx)}/admin.html`,
    }).catch(() => undefined);
  }
  return result;
}
