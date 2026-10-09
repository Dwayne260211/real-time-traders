/* Real Time Traders hire system: shared helpers for hire.html, hire-item.html,
   my-bookings.html and admin.html. Vanilla JS, no build step.
   Talks to Supabase only when js/hire-config.js has been filled in. */
(function () {
  "use strict";

  var SUPABASE_JS = "js/vendor/supabase-js-2.117.3.min.js";
  var TBC = "Terms to be confirmed";
  var CALL_HREF = "tel:+61422909739";

  var CATEGORIES = [
    { slug: "cleaning", name: "Cleaning", icon: "i-washer", hash: "cleaning",
      blurb: "For driveways, carpets and floors: pressure washers, carpet cleaners, wet & dry vacuums, steam cleaners and floor scrubbers." },
    { slug: "gardening", name: "Gardening", icon: "i-leaf", hash: "gardening",
      blurb: "For lawns, hedges and yard clean-ups: lawnmowers, whipper snippers, hedge trimmers, leaf blowers and chainsaws." },
    { slug: "power-tools", name: "Power tools", icon: "i-drill", hash: "power-tools",
      blurb: "For renovations and trade jobs: drills, impact drivers, grinders, sanders and demolition hammers." },
    { slug: "general", name: "General", icon: "i-ladder", hash: "general",
      blurb: "Everyday gear for home and trade jobs: ladders, generators, extension leads and more." },
    { slug: "plant", name: "Plant & portable toilets", icon: "i-toilet", hash: "plant", enquiry: true,
      blurb: "Portable toilets for building sites, events and renovations, plus plant hire. By enquiry for now." },
    { slug: "trailers", name: "Trailers", icon: "i-trailer", hash: "trailer", enquiry: true,
      blurb: "Box, cage and car trailers for rubbish runs, moves and hauling. By enquiry for now." }
  ];

  function config() {
    var c = window.RTT_HIRE_CONFIG || {};
    var url = String(c.supabaseUrl || "").trim().replace(/\/+$/, "");
    var key = String(c.supabaseAnonKey || "").trim();
    if (!url || !key) return null;
    if (isSecretKey(key)) {
      console.error("js/hire-config.js contains a SECRET key. Use the anon/publishable key only. Hire system disabled.");
      return null;
    }
    return { url: url, key: key };
  }

  /* Refuse service_role JWTs and sb_secret_ keys if someone pastes the wrong one. */
  function isSecretKey(key) {
    if (/^sb_secret_/i.test(key)) return true;
    var parts = key.split(".");
    if (parts.length === 3) {
      try {
        var payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        return payload && payload.role === "service_role";
      } catch (e) { return false; }
    }
    return false;
  }

  var clientPromise = null;
  function client() {
    var cfg = config();
    if (!cfg) return Promise.reject(new Error("not_configured"));
    if (clientPromise) return clientPromise;
    clientPromise = new Promise(function (resolve, reject) {
      function make() {
        resolve(window.supabase.createClient(cfg.url, cfg.key, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        }));
      }
      if (window.supabase && window.supabase.createClient) return make();
      var s = document.createElement("script");
      s.src = SUPABASE_JS;
      s.onload = make;
      s.onerror = function () { reject(new Error("load_failed")); };
      document.head.appendChild(s);
    });
    return clientPromise;
  }

  /* ---------- formatting ---------- */
  function money(cents) {
    if (cents === null || cents === undefined || cents === "") return null;
    return "$" + (Number(cents) / 100).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function parseDate(iso) { var p = String(iso).split("-").map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
  function fmtDate(iso, opts) {
    return parseDate(iso).toLocaleDateString("en-AU", Object.assign({ weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }, opts || {}));
  }
  function todayBrisbane() {
    // Brisbane is UTC+10 all year (no daylight saving).
    return new Date(Date.now() + 10 * 3600 * 1000).toISOString().slice(0, 10);
  }
  function addDays(iso, n) { var d = parseDate(iso); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function daysBetween(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000) + 1; }

  function esc(s) {
    return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function category(slug) { for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].slug === slug) return CATEGORIES[i]; return null; }

  function photoUrl(path) {
    var cfg = config();
    if (!cfg || !path) return "";
    return cfg.url + "/storage/v1/object/public/equipment-photos/" + String(path).split("/").map(encodeURIComponent).join("/");
  }

  /* ---------- errors ---------- */
  var MESSAGES = {
    sign_in_required: "Please sign in first.",
    equipment_not_found: "This item isn't available online.",
    enquiry_only: "This item is booked by phone. Please call us.",
    invalid_dates: "Please choose a return date on or after the hire start date.",
    start_in_past: "The hire start date can't be in the past.",
    period_too_long: "Hires longer than a year need a quote. Please call us.",
    dates_unavailable: "Sorry, those dates aren't available. Please try other dates.",
    too_many_pending_requests: "You already have 5 requests waiting. We'll be in touch, or call us.",
    weekend_rate_needs_sat_to_sun: "The weekend rate is for a Saturday to Sunday hire.",
    price_on_request: "Price on request.",
    name_required: "Please add your name.",
    not_configured: "Online hire isn't switched on yet. Please call us.",
    load_failed: "We couldn't load the booking system. Check your connection or call us."
  };
  function errorText(err) {
    if (!err) return "Something went wrong. Please call us.";
    var raw = err.message || err.error || String(err);
    if (MESSAGES[raw]) return MESSAGES[raw];
    if (err.code === "23P01" || /equipment_holds_no_overlap|conflicting key value violates exclusion/.test(raw)) {
      return "Those dates clash with a confirmed booking or a maintenance block.";
    }
    if (/Failed to fetch|NetworkError|load failed/i.test(raw)) return "We couldn't reach the booking system. Check your connection or call us.";
    return raw.length < 160 ? raw : "Something went wrong. Please call us.";
  }

  /* ---------- Edge Functions ---------- */
  function callFunction(name, body) {
    var cfg = config();
    return client().then(function (sb) { return sb.auth.getSession(); }).then(function (r) {
      var session = r.data && r.data.session;
      if (!session) throw new Error("sign_in_required");
      return fetch(cfg.url + "/functions/v1/" + name, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: cfg.key, Authorization: "Bearer " + session.access_token },
        body: JSON.stringify(body || {})
      });
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var e = new Error(data.message || data.error || ("The booking service returned an error (" + res.status + ")."));
          e.code = data.error; e.status = res.status;
          throw e;
        }
        return data;
      });
    });
  }

  /* ---------- settings / terms ---------- */
  function termsRows(s) {
    s = s || {};
    function val(v) { return v && String(v).trim() ? String(v).trim() : null; }
    var deposit = s.security_deposit_cents === null || s.security_deposit_cents === undefined ? null
      : money(s.security_deposit_cents) + (val(s.deposit_terms) ? ". " + val(s.deposit_terms) : "");
    var delivery = s.delivery_available === false ? "Pickup only" + (val(s.delivery_options) ? ". " + val(s.delivery_options) : "")
      : val(s.delivery_options);
    return [
      ["Security deposit", deposit],
      ["ID requirements", val(s.id_requirements)],
      ["Pickup", val(s.pickup_options)],
      ["Delivery", delivery],
      ["Late returns", val(s.late_return_policy)],
      ["Damage", val(s.damage_policy)],
      ["Cancellations", val(s.cancellation_terms)]
    ];
  }
  function renderTerms(dl, s) {
    dl.innerHTML = termsRows(s).map(function (r) {
      return "<div><dt>" + esc(r[0]) + "</dt><dd" + (r[1] ? "" : ' class="is-tbc"') + ">" + esc(r[1] || TBC) + "</dd></div>";
    }).join("");
  }
  function loadSettings(sb) {
    return sb.from("hire_settings").select("*").limit(1).maybeSingle().then(function (r) {
      if (r.error) throw r.error;
      return r.data || {};
    });
  }

  /* ---------- auth (email magic link) ---------- */
  function sendMagicLink(sb, email, redirectTo) {
    return sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirectTo, shouldCreateUser: true } })
      .then(function (r) { if (r.error) throw r.error; });
  }
  /* Wires a <form data-signin> with an email input and a .form-status */
  function wireSignIn(form, sb, redirectTo) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var email = form.querySelector("input[type=email]").value.trim();
      status.classList.remove("is-error");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.classList.add("is-error"); status.textContent = "Please enter a valid email address."; return; }
      var btn = form.querySelector("button[type=submit]"); btn.disabled = true;
      status.textContent = "Sending…";
      sendMagicLink(sb, email, typeof redirectTo === "function" ? redirectTo() : redirectTo).then(function () {
        status.textContent = "Check your email: we've sent a sign-in link to " + email + ". Open it on this device.";
      }).catch(function (err) {
        status.classList.add("is-error"); status.textContent = errorText(err);
      }).then(function () { btn.disabled = false; });
    });
  }

  function statusBadge(status) {
    var label = { pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled", completed: "Completed" }[status] || status;
    return '<span class="status-badge status-badge--' + esc(status) + '">' + esc(label) + "</span>";
  }
  var PAYMENT_LABELS = {
    unpaid: "Not paid", checkout_open: "Payment started", paid: "Paid", paid_conflict: "Paid: dates clash, we'll contact you",
    refund_pending: "Refund pending", refunded: "Refunded", partially_refunded: "Partly refunded"
  };

  function showConfigNotice(el) {
    if (!el) return;
    el.hidden = false;
  }

  window.RTTHire = {
    TBC: TBC, CALL_HREF: CALL_HREF, CATEGORIES: CATEGORIES, PAYMENT_LABELS: PAYMENT_LABELS,
    config: config, client: client, money: money, fmtDate: fmtDate, todayBrisbane: todayBrisbane,
    addDays: addDays, daysBetween: daysBetween, esc: esc, icon: icon, category: category, photoUrl: photoUrl,
    errorText: errorText, callFunction: callFunction, termsRows: termsRows, renderTerms: renderTerms,
    loadSettings: loadSettings, wireSignIn: wireSignIn, statusBadge: statusBadge, showConfigNotice: showConfigNotice
  };
})();
