/* account.html: profile (member_profiles), sign out, and saved payment method
   (Stripe SetupIntent + Payment Element). Only a card summary is ever read from Supabase. */
(function () {
  "use strict";
  var H = window.RTTHire;
  if (!H || !H.config()) return;   // static "coming soon" stays
  var STRIPE_PUBLISHABLE_KEY = String((window.RTT_HIRE_CONFIG || {}).stripePublishableKey || "").trim();
  var STRIPE_JS = "https://js.stripe.com/v3/";
  var $ = function (s) { return document.querySelector(s); };
  var sb, user, stripe = null, elements = null;
  var signinBox = $("[data-signin-box]"), account = $("[data-account]"), pageStatus = $("[data-page-status]");
  var profileForm = $("[data-profile]"), payBody = $("[data-payment-body]"), payForm = $("[data-payment-form]"), payStatus = $("[data-payment-status]");
  $("[data-unconfigured]").hidden = true;

  function notice(el, msg, isError) { el.hidden = !msg; el.classList.toggle("is-error", !!isError); el.textContent = msg || ""; }
  function status(el, msg, isError) { el.classList.toggle("is-error", !!isError); el.textContent = msg || ""; }
  var qs = new URLSearchParams(location.search);

  function showSignedOut() {
    account.hidden = true; signinBox.hidden = false;
    var err = H.oauthReturnError && H.oauthReturnError();
    if (err) notice($("[data-signin-status]"), err, true);
  }

  function loadProfile() {
    profileForm.elements.email.value = user.email || "";
    $("[data-email]").textContent = user.email || "";
    return sb.from("member_profiles").select("full_name, phone").eq("id", user.id).maybeSingle().then(function (r) {
      var meta = user.user_metadata || {};
      var p = (!r.error && r.data) || {};
      profileForm.elements.full_name.value = p.full_name || meta.full_name || meta.name || "";
      profileForm.elements.phone.value = p.phone || "";
    });
  }

  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var st = profileForm.querySelector(".form-status");
    var name = profileForm.elements.full_name.value.trim(), phone = profileForm.elements.phone.value.trim();
    if (!name) return status(st, "Please add your name.", true);
    if (phone && !/^[0-9 +()-]{6,32}$/.test(phone)) return status(st, "Please check the phone number.", true);
    status(st, "Saving…");
    sb.from("member_profiles").upsert({ id: user.id, full_name: name, phone: phone || null, updated_at: new Date().toISOString() })
      .then(function (r) {
        if (r.error) throw r.error;
        return sb.auth.updateUser({ data: { full_name: name } });
      })
      .then(function () { status(st, "Saved."); })
      .catch(function (err) { status(st, H.errorText(err), true); });
  });

  $("[data-signout]").addEventListener("click", function () {
    sb.auth.signOut().then(function () { location.href = "index.html"; });
  });

  /* Password reset links land here with ?reset=1 */
  var pwForm = $("[data-password]");
  pwForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var st = pwForm.querySelector(".form-status"), pw = pwForm.elements.password.value;
    if (pw.length < 8) return status(st, "Please use at least 8 characters.", true);
    sb.auth.updateUser({ password: pw }).then(function (r) {
      if (r.error) throw r.error;
      pwForm.reset(); status(st, "Password updated.");
    }).catch(function (err) { status(st, H.errorText(err), true); });
  });

  /* ---------- Payment method ---------- */
  function cap(s) { s = String(s || "card"); return s.charAt(0).toUpperCase() + s.slice(1); }
  function renderCards(rows) {
    payForm.hidden = true;
    if (!STRIPE_PUBLISHABLE_KEY) {
      payBody.innerHTML = '<p class="empty-state__title">Card payments coming soon</p><p class="note">You\u2019ll be able to save a card to your account here.</p>';
      return;
    }
    if (!rows.length) {
      payBody.innerHTML = '<p>No card saved.</p><button type="button" class="btn btn--primary btn--sm" data-card-add>Add a card</button>';
    } else {
      payBody.innerHTML = rows.map(function (c) {
        return '<div class="saved-card"><p><strong>' + H.esc(cap(c.brand)) + '</strong> ending ' + H.esc(c.last4 || "????") +
          ' \u00b7 expires ' + H.esc(String(c.exp_month || "").padStart(2, "0")) + "/" + H.esc(String(c.exp_year || "").slice(-2)) +
          '</p><button type="button" class="btn btn--outline btn--sm" data-card-remove="' + H.esc(c.stripe_payment_method_id) + '">Remove card</button></div>';
      }).join("") + '<button type="button" class="btn btn--light btn--sm" data-card-add>Replace or add another card</button>';
    }
  }
  function loadCards() {
    if (!STRIPE_PUBLISHABLE_KEY) { renderCards([]); return Promise.resolve([]); }
    return sb.from("member_payment_methods").select("stripe_payment_method_id, brand, last4, exp_month, exp_year")
      .order("created_at", { ascending: false }).then(function (r) {
        if (r.error) { payBody.innerHTML = '<p class="note">Saved cards aren\u2019t available yet.</p>'; return []; }
        renderCards(r.data || []); return r.data || [];
      });
  }
  function loadStripe() {
    if (window.Stripe) return Promise.resolve(window.Stripe);
    return new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = STRIPE_JS;
      s.onload = function () { res(window.Stripe); }; s.onerror = function () { rej(new Error("load_failed")); };
      document.head.appendChild(s);
    });
  }
  function startAddCard() {
    status(payStatus, "Loading secure card form…");
    Promise.all([loadStripe(), H.callFunction("create-setup-intent", {})]).then(function (r) {
      if (/^sk_|^rk_/.test(STRIPE_PUBLISHABLE_KEY)) throw new Error("Wrong Stripe key type in config.");
      stripe = stripe || r[0](STRIPE_PUBLISHABLE_KEY);
      elements = stripe.elements({ clientSecret: r[1].client_secret });
      var el = $("[data-payment-element]"); el.innerHTML = "";
      elements.create("payment").mount(el);
      payForm.hidden = false; status(payStatus, "");
    }).catch(function (err) { status(payStatus, H.errorText(err), true); });
  }
  $("[data-card-save]").addEventListener("click", function () {
    if (!stripe || !elements) return;
    var btn = this; btn.disabled = true; status(payStatus, "Saving card…");
    stripe.confirmSetup({ elements: elements, redirect: "if_required", confirmParams: { return_url: location.origin + location.pathname + "?card=saved" } })
      .then(function (r) {
        if (r.error) throw new Error(r.error.message);
        status(payStatus, "Card saved. It can take a few seconds to show here.");
        pollCards(6);
      }).catch(function (err) { status(payStatus, H.errorText(err), true); })
      .then(function () { btn.disabled = false; });
  });
  $("[data-card-cancel]").addEventListener("click", function () { payForm.hidden = true; status(payStatus, ""); });
  function pollCards(n) { loadCards().then(function (rows) { if (!rows.length && n > 0) setTimeout(function () { pollCards(n - 1); }, 2000); }); }
  payBody.addEventListener("click", function (e) {
    if (e.target.closest("[data-card-add]")) return startAddCard();
    var rm = e.target.closest("[data-card-remove]");
    if (!rm || !confirm("Remove this card from your account?")) return;
    rm.disabled = true;
    H.callFunction("remove-payment-method", { payment_method_id: rm.getAttribute("data-card-remove") })
      .then(function () { status(payStatus, "Card removed."); return loadCards(); })
      .catch(function (err) { rm.disabled = false; status(payStatus, H.errorText(err), true); });
  });

  /* ---------- Membership (Stripe subscription; tier is set server-side by the webhook only) ---------- */
  var TIERS = { basic: ["Basic", "$4.99"], bronze: ["Bronze", "$19.99"], silver: ["Silver", "$39.99"], gold: ["Gold", "$79.99"] };
  var memBody = $("[data-membership-body]"), memStatus = $("[data-membership-status]");
  function fmtDate(d) { return new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "Australia/Brisbane" }); }
  function pendingTier() { try { var t = sessionStorage.getItem("rtt_subscribe"); return TIERS[t] ? t : null; } catch (e) { return null; } }
  function goTo(fn, body, btn) {
    if (btn) btn.disabled = true;
    status(memStatus, fn === "create-portal-session" ? "Opening secure billing page…" : "Opening secure checkout…");
    H.callFunction(fn, body).then(function (r) {
      try { sessionStorage.removeItem("rtt_subscribe"); } catch (e) {}
      if (!r.url) throw new Error("No billing link returned.");
      location.href = r.url;
    }).catch(function (err) { if (btn) btn.disabled = false; status(memStatus, H.errorText(err), true); });
  }
  function loadMembership(retries) {
    if (!memBody) return Promise.resolve();
    return sb.from("profiles").select("membership_tier, subscription_status, current_period_end, cancel_at_period_end").eq("id", user.id).maybeSingle().then(function (r) {
      var p = (!r.error && r.data) || {}, t = TIERS[p.membership_tier] ? p.membership_tier : null, st = p.subscription_status;
      if (!t && retries > 0 && qs.get("membership") === "success") { memBody.innerHTML = '<p class="note">Payment received. Activating your membership…</p>'; setTimeout(function () { loadMembership(retries - 1); }, 2500); return; }
      var html;
      if (t) {
        var badge = window.RTTTierBadge ? window.RTTTierBadge(t) : "";
        var when = p.current_period_end ? fmtDate(p.current_period_end) : null;
        html = '<div class="plan-box"><p class="plan-box__name">' + H.esc(TIERS[t][0]) + " membership " + badge + "</p>" +
          "<p>" + H.esc(TIERS[t][1]) + " a month (AUD).</p>" +
          (st === "past_due" ? '<p class="is-warn">Your last payment didn\u2019t go through. Please update your card in Manage billing.</p>' : "") +
          (when ? "<p>" + (p.cancel_at_period_end ? "Cancelled: your membership ends on <strong>" + H.esc(when) + "</strong> and won\u2019t renew." : "Renews on <strong>" + H.esc(when) + "</strong>.") + "</p>" : "") +
          '<div class="plan-box__btns"><button type="button" class="btn btn--primary btn--sm" data-manage-billing>Manage billing</button><a class="btn btn--light btn--sm" href="membership.html">Compare plans</a></div>' +
          '<p class="note">Change plan, update your card, see invoices or cancel (cancelling takes effect at the end of the paid month).</p></div>';
      } else {
        var pend = pendingTier();
        html = '<div class="plan-box"><p class="plan-box__name">Free account</p><p>Up to 10 active listings. Upgrade for more listings, featured listings and member badges.</p>' +
          '<div class="plan-box__btns">' + (pend ? '<button type="button" class="btn btn--primary btn--sm" data-subscribe-now="' + pend + '">Continue to ' + TIERS[pend][0] + " checkout (" + TIERS[pend][1] + "/month)</button>" : "") +
          '<a class="btn btn--' + (pend ? "light" : "primary") + ' btn--sm" href="membership.html">See memberships</a>' +
          (st && st !== "canceled" && st !== "incomplete_expired" ? '<button type="button" class="btn btn--light btn--sm" data-manage-billing>Manage billing</button>' : "") + "</div></div>";
      }
      memBody.innerHTML = html;
    }).catch(function () { memBody.innerHTML = '<p class="note">Membership details aren\u2019t available right now.</p>'; });
  }
  if (memBody) memBody.addEventListener("click", function (e) {
    var b = e.target.closest("[data-manage-billing]");
    if (b) return goTo("create-portal-session", {}, b);
    var s2 = e.target.closest("[data-subscribe-now]");
    if (s2) goTo("create-checkout-session", { tier: s2.getAttribute("data-subscribe-now") }, s2);
  });

  function showAccount(session) {
    user = session.user;
    signinBox.hidden = true; account.hidden = false;
    if (qs.get("welcome") || /type=signup/.test(location.hash)) notice(pageStatus, "Welcome! Your account is ready.");
    if (qs.get("reset")) { $("[data-password-card]").hidden = false; notice(pageStatus, "Choose a new password below."); }
    if (qs.get("card") === "saved") { notice(pageStatus, "Card saved."); pollCards(6); }
    loadProfile().catch(function () {});
    if (qs.get("membership") === "success") notice(pageStatus, "Thanks! Your membership is being activated. It can take a few seconds to show below.");
    if (qs.get("membership") === "cancelled") notice(pageStatus, "Checkout was cancelled. You haven\u2019t been charged.");
    loadMembership(8);
    if (qs.get("card") !== "saved") loadCards();
  }

  H.client().then(function (client) {
    sb = client;
    sb.auth.onAuthStateChange(function (evt, session) {
      if (evt === "PASSWORD_RECOVERY") $("[data-password-card]").hidden = false;
      if (evt === "SIGNED_IN" && session && !user) showAccount(session);
    });
    return sb.auth.getSession();
  }).then(function (r) {
    var session = r.data && r.data.session;
    if (session) showAccount(session); else showSignedOut();
  }).catch(function () { showSignedOut(); });
})();
