/* my-bookings.html: email magic-link sign-in, list your own bookings (RLS), pay when the
   owner has switched payments on, and cancel through the cancel-booking Edge Function. */
(function () {
  "use strict";
  var H = window.RTTHire;
  if (!H || !H.config()) return;   // static "coming soon" stays
  var $ = function (s) { return document.querySelector(s); };
  var sb, settings = {}, bookings = [];
  var unconfigured = $("[data-unconfigured]"), signinBox = $("[data-signin-box]"), account = $("[data-account]");
  var list = $("[data-bookings]"), pageStatus = $("[data-page-status]");
  var modal = $("#cancel-modal"), cancelForm = $("[data-cancel-form]"), cancelling = null, lastFocus = null;

  unconfigured.hidden = true;

  function notice(msg, isError) {
    pageStatus.hidden = !msg;
    pageStatus.classList.toggle("is-error", !!isError);
    pageStatus.textContent = msg || "";
  }

  var qs = new URLSearchParams(location.search);
  if (qs.get("checkout") === "success") notice("Thanks. Stripe is confirming your payment (reference " + (qs.get("ref") || "") + "). Your booking shows as Confirmed once the payment is confirmed; refresh in a minute if it hasn't changed.");
  if (qs.get("checkout") === "cancelled") notice("Payment was not completed (reference " + (qs.get("ref") || "") + "). Your request is still saved and has not been charged.");

  function canCancel(b) { return (b.status === "pending" || b.status === "confirmed") && !b.cancel_requested_at; }
  function canPay(b) {
    return settings.payments_live && settings.pricing_rule && b.status === "pending" && b.hire_total_cents &&
      (b.payment_status === "unpaid" || b.payment_status === "checkout_open") && b.start_date >= H.todayBrisbane();
  }

  function render() {
    if (!bookings.length) {
      list.innerHTML = '<div class="empty-state"><p class="empty-state__title">You have no hire bookings yet.</p><p>Browse the catalogue to request one, or call us.</p><div class="empty-state__ctas"><a class="btn btn--primary btn--sm" href="hire.html">Browse hire</a></div></div>';
      return;
    }
    list.innerHTML = bookings.map(function (b) {
      var note = "";
      if (b.cancel_requested_at && b.status !== "cancelled") note = "Cancellation requested: we're reviewing it under the hire terms and will contact you.";
      else if (b.status === "pending" && b.payment_status === "unpaid") note = "Waiting for Real Time Traders to confirm. No payment has been taken.";
      else if (b.payment_status === "paid_conflict") note = "We received your payment but the dates were taken. We'll contact you about other dates or a refund.";
      return '<article class="booking-card">' +
        '<div class="booking-card__head"><h3>' + H.esc(b.equipment_name) + "</h3>" + H.statusBadge(b.status) + "</div>" +
        "<dl>" +
          "<div><dt>Reference</dt><dd>" + H.esc(b.reference) + "</dd></div>" +
          "<div><dt>Dates</dt><dd>" + H.esc(H.fmtDate(b.start_date)) + " to " + H.esc(H.fmtDate(b.end_date)) + "</dd></div>" +
          "<div><dt>Hire price</dt><dd>" + H.esc(H.money(b.hire_total_cents) || "To be confirmed") + "</dd></div>" +
          "<div><dt>Payment</dt><dd>" + H.esc(H.PAYMENT_LABELS[b.payment_status] || b.payment_status) +
            (b.amount_refunded_cents ? " (" + H.esc(H.money(b.amount_refunded_cents)) + " refunded)" : "") + "</dd></div>" +
        "</dl>" +
        (note ? '<p class="booking-card__note">' + H.esc(note) + "</p>" : "") +
        '<div class="booking-card__actions">' +
          (canPay(b) ? '<button type="button" class="btn btn--primary btn--sm" data-pay="' + b.id + '">Pay online<span class="sr-only"> for ' + H.esc(b.reference) + "</span></button>" : "") +
          (canCancel(b) ? '<button type="button" class="btn btn--outline btn--sm" data-cancel="' + b.id + '">Cancel booking<span class="sr-only"> ' + H.esc(b.reference) + "</span></button>" : "") +
        "</div></article>";
    }).join("");
  }

  function load() {
    return sb.from("bookings")
      .select("id, reference, equipment_name, start_date, end_date, status, payment_status, hire_total_cents, amount_refunded_cents, cancel_requested_at")
      .order("start_date", { ascending: false })
      .then(function (r) {
        if (r.error) throw r.error;
        bookings = r.data || [];
        render();
      }).catch(function (err) { list.innerHTML = ""; notice(H.errorText(err), true); });
  }

  list.addEventListener("click", function (e) {
    var pay = e.target.closest("[data-pay]"), cancel = e.target.closest("[data-cancel]");
    if (pay) {
      pay.disabled = true;
      notice("Taking you to secure payment…");
      H.callFunction("create-checkout-session", { booking_id: pay.getAttribute("data-pay") })
        .then(function (res) { location.href = res.url; })
        .catch(function (err) { pay.disabled = false; notice(H.errorText(err), true); });
    }
    if (cancel) openCancel(cancel);
  });

  function openCancel(btn) {
    cancelling = bookings.filter(function (b) { return b.id === btn.getAttribute("data-cancel"); })[0];
    if (!cancelling) return;
    lastFocus = btn;
    $("[data-cancel-ref]").textContent = cancelling.reference;
    var terms = settings.cancellation_terms && settings.cancellation_terms.trim();
    var explain = cancelling.status === "pending" && cancelling.payment_status === "unpaid"
      ? "This request hasn't been confirmed or paid, so it will be cancelled straight away."
      : "Cancellation terms: " + (terms || H.TBC + ". Your request will be reviewed by Real Time Traders before anything is refunded.");
    $("[data-cancel-explain]").textContent = explain;
    cancelForm.reset();
    cancelForm.querySelector(".form-status").textContent = "";
    cancelForm.querySelector("button[type=submit]").disabled = false;
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
  }
  function closeCancel() {
    if (modal.close) modal.close(); else modal.removeAttribute("open");
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest("[data-cancel-close]")) closeCancel(); });
  cancelForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var st = cancelForm.querySelector(".form-status"), btn = cancelForm.querySelector("button[type=submit]");
    st.classList.remove("is-error"); st.textContent = "Cancelling…"; btn.disabled = true;
    H.callFunction("cancel-booking", { booking_id: cancelling.id, reason: cancelForm.elements.reason.value.trim() || null })
      .then(function (res) { closeCancel(); notice(res.message || "Done."); return load(); })
      .catch(function (err) { st.classList.add("is-error"); st.textContent = H.errorText(err) + " If this keeps happening, please call us."; btn.disabled = false; });
  });

  var currentUser = null;
  function setSession(s) {
    var uid = s ? s.user.id : null;
    if (uid === currentUser && (s ? !account.hidden : !signinBox.hidden)) return;
    currentUser = uid;
    signinBox.hidden = !!s;
    account.hidden = !s;
    if (s) { account.querySelector("[data-email]").textContent = s.user.email || ""; load(); }
  }

  H.client().then(function (client) {
    sb = client;
    H.wireSignIn(signinBox.querySelector("[data-signin]"), sb, function () { return location.origin + location.pathname; });
    account.querySelector("[data-signout]").addEventListener("click", function () { sb.auth.signOut().then(function () { setSession(null); }); });
    return Promise.all([H.loadSettings(sb), sb.auth.getSession()]);
  }).then(function (res) {
    settings = res[0] || {};
    H.renderTerms(document.querySelector("[data-terms]"), settings);
    setSession(res[1].data.session);
    sb.auth.onAuthStateChange(function (evt, s) { if (evt === "SIGNED_IN" || evt === "SIGNED_OUT") setSession(s); });
  }).catch(function (err) {
    unconfigured.hidden = false;
    unconfigured.querySelector("p:not(.empty-state__title)").textContent = H.errorText(err);
  });
})();
