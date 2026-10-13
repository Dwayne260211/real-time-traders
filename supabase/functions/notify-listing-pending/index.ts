// Emails the RTT inbox when a marketplace listing becomes pending (new post or edit sent back to approval).
// Called by the pg_net trigger public.ml_notify_pending() with header x-notify-secret.
// Secrets: NOTIFY_SECRET, BREVO_SMTP_KEY (SMTP_USER defaults to the Brevo login). Port 465 (587 is blocked on Edge Functions).
import nodemailer from "npm:nodemailer@6.9.16";

const TO = "realtimetraders101@gmail.com";
const FROM = '"Real Time Traders Brisbane" <admin@bridge-bite-co.com>';
const CATS: Record<string, string> = { "buy-sell": "Buy & sell", rare: "Antiques & rare finds", donated: "Donated / free" };
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function price(c: number | null) { return c == null ? "Contact seller" : c === 0 ? "Free" : "$" + (c / 100).toFixed(c % 100 ? 2 : 0); }

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method", { status: 405 });
  const secret = Deno.env.get("NOTIFY_SECRET") || "";
  if (!secret || req.headers.get("x-notify-secret") !== secret) return new Response("forbidden", { status: 403 });
  let l: any;
  try { const b = await req.json(); l = b.record ?? b; } catch { return new Response("bad json", { status: 400 }); }
  if (!l || !l.id || !l.title) return new Response("bad payload", { status: 400 });

  const base = Deno.env.get("SUPABASE_URL") || "";
  const thumb = Array.isArray(l.photos) && l.photos.length
    ? `${base}/storage/v1/object/public/listing-photos/${String(l.photos[0]).split("/").map(encodeURIComponent).join("/")}` : "";
  const isEdit = l.created_at && l.updated_at && Math.abs(Date.parse(l.updated_at) - Date.parse(l.created_at)) > 5000;
  const subject = `New listing waiting for approval: ${String(l.title).slice(0, 80)}`;
  const rows: [string, string][] = [["Title", l.title], ["Price", price(l.price_cents)], ["Suburb", l.suburb], ["Category", CATS[l.category] || l.category], ["Type", isEdit ? "Edited listing (back to approval)" : "New listing"]];
  const html = `<div style="font-family:Arial,sans-serif;color:#1b2333;max-width:520px">
<h2 style="margin:0 0 12px">Listing waiting for approval</h2>
${thumb ? `<p><img src="${esc(thumb)}" alt="" width="240" style="max-width:240px;border-radius:8px"></p>` : ""}
<table cellpadding="4">${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${esc(v)}</td></tr>`).join("")}</table>
<p><a href="https://realtimetradersbrisbane.au/admin.html" style="background:#f5a623;color:#0b1f3a;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:bold;display:inline-block">Review in admin</a></p>
<p style="font-size:12px;color:#5a6476">Admin &gt; Member listings &gt; Awaiting approval.</p></div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + "\n\nReview: https://realtimetradersbrisbane.au/admin.html";

  const tx = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", port: 465, secure: true,
    auth: { user: Deno.env.get("SMTP_USER") || "bdebd7001@smtp-brevo.com", pass: Deno.env.get("BREVO_SMTP_KEY") || "" },
  });
  try {
    const info = await tx.sendMail({ from: FROM, to: TO, subject, html, text });
    console.log("notify sent", l.id, info.messageId, info.response);
    return Response.json({ ok: true, messageId: info.messageId, response: info.response });
  } catch (e) {
    console.error("notify failed", l.id, String((e as Error).message || e));
    return Response.json({ ok: false, error: String((e as Error).message || e) }, { status: 502 });
  }
});
