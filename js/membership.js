/* membership.html: Subscribe buttons -> Stripe Checkout (create-checkout-session). Signed-out
   visitors are asked to log in / join first; the chosen tier is remembered for account.html. */
(function () {
  "use strict";
  var H = window.RTTHire;
  var st = document.querySelector("[data-subscribe-status]");
  var NAMES = { basic: "Basic", bronze: "Bronze", silver: "Silver", gold: "Gold" };
  function say(msg, err) { if (!st) return; st.textContent = msg || ""; st.classList.toggle("is-error", !!err); }
  function session() {
    if (!H || !H.config()) return Promise.resolve(null);
    return H.client().then(function (sb) { return sb.auth.getSession(); }).then(function (r) { return r.data && r.data.session; }).catch(function () { return null; });
  }
  document.querySelectorAll("[data-subscribe]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tier = btn.getAttribute("data-subscribe");
      try { sessionStorage.setItem("rtt_subscribe", tier); } catch (e) {}
      session().then(function (s) {
        if (!s) {
          say("Please log in or create a free account first. You'll then continue to secure checkout for " + NAMES[tier] + ".");
          if (window.RTT_openAuth) window.RTT_openAuth("join", { tier: NAMES[tier], gate: "Log in or create a free account first, then continue to secure checkout for " + NAMES[tier] + " from My account." });
          return;
        }
        btn.disabled = true; say("Opening secure checkout…");
        return H.callFunction("create-checkout-session", { tier: tier }).then(function (r) {
          try { sessionStorage.removeItem("rtt_subscribe"); } catch (e) {}
          location.href = r.url;
        }).catch(function (err) { btn.disabled = false; say(H.errorText(err), true); });
      });
    });
  });
  session().then(function (s) {
    if (!s || !H) return;
    H.client().then(function (sb) {
      return sb.from("profiles").select("membership_tier,subscription_status").eq("id", s.user.id).maybeSingle();
    }).then(function (r) {
      var t = r && r.data && r.data.membership_tier;
      if (!NAMES[t]) return;
      document.querySelectorAll("[data-subscribe]").forEach(function (b) {
        if (b.getAttribute("data-subscribe") === t) { b.textContent = "Your current plan"; b.disabled = true; }
        else b.textContent = "Switch to " + NAMES[b.getAttribute("data-subscribe")];
      });
      say("You're on " + NAMES[t] + ". Switching plans opens Manage billing.");
    }).catch(function () {});
  });
})();
