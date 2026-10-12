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

  function showAccount(session) {
    user = session.user;
    signinBox.hidden = true; account.hidden = false;
    if (qs.get("welcome") || /type=signup/.test(location.hash)) notice(pageStatus, "Welcome! Your account is ready.");
    if (qs.get("reset")) { $("[data-password-card]").hidden = false; notice(pageStatus, "Choose a new password below."); }
    if (qs.get("card") === "saved") { notice(pageStatus, "Card saved."); pollCards(6); }
    loadProfile().catch(function () {});
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
