/* Real Time Traders: small vanilla JS helpers (no dependencies) */
(function () {
  "use strict";

  /* ---------- Site-wide announcement strip ----------
     To remove: set ANNOUNCE.enabled = false. Change "id" to show a new message to people who dismissed the old one. */
  var ANNOUNCE = { enabled: true, id: "launch-2026-10", text: "We\u2019ve just launched! New features like messaging are rolling out this week." };
  (function () {
    if (!ANNOUNCE.enabled) return;
    var key = "rtt_announce_dismissed";
    try { if (localStorage.getItem(key) === ANNOUNCE.id) return; } catch (e) {}
    var st = document.createElement("style");
    st.textContent = ".announce{background:#f5a623;color:#0b1f3a;font-size:14px;font-weight:600;line-height:1.35;padding:7px 44px 7px 16px;text-align:center;position:relative}" +
      ".announce__close{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:32px;height:32px;border:0;background:transparent;color:#0b1f3a;font-size:22px;line-height:1;cursor:pointer;border-radius:6px}" +
      ".announce__close:focus-visible{outline:2px solid #0b1f3a}";
    document.head.appendChild(st);
    var bar = document.createElement("div");
    bar.className = "announce"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Announcement");
    bar.innerHTML = '<span></span><button type="button" class="announce__close" aria-label="Dismiss announcement">\u00d7</button>';
    bar.firstChild.textContent = ANNOUNCE.text;
    bar.lastChild.addEventListener("click", function () { bar.remove(); try { localStorage.setItem(key, ANNOUNCE.id); } catch (e) {} });
    document.body.insertBefore(bar, document.body.firstChild);
  })();

  /* ---------- Supabase auth links (invite / recovery / magic link) ----------
     Links that fall back to the Site URL land here; hand them to the admin sign-in page,
     which knows how to finish them. Hash and query are kept intact. */
  (function () {
    if (/admin-login\.html$/.test(location.pathname)) return;
    var h = location.hash, q = location.search;
    if (/access_token|type=invite|type=recovery|error_description=/.test(h) || /[?&](code|token_hash)=/.test(q)) {
      var base = location.pathname.replace(/[^/]*$/, "");
      location.replace(base + "admin-login.html" + q + h);
    }
  })();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
  }
  var mqDesktop = window.matchMedia("(min-width: 1024px)");
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && !mqDesktop.matches) setMenu(false);
    });
    /* Escape closes the mobile menu and returns focus to the toggle */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var openSub = document.querySelector(".has-sub.is-open");
      if (openSub) { closeSub(openSub); openSub.querySelector(".nav__sub-toggle").focus(); return; }
      if (nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
    var onMq = function () { if (mqDesktop.matches) setMenu(false); };
    if (mqDesktop.addEventListener) mqDesktop.addEventListener("change", onMq);
  }

  /* Sub-menu toggle (click on mobile, also works with keyboard on desktop) */
  function closeSub(li) {
    li.classList.remove("is-open");
    li.querySelector(".nav__sub-toggle").setAttribute("aria-expanded", "false");
  }
  document.querySelectorAll(".nav__sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest(".has-sub");
      var open = !li.classList.contains("is-open");
      li.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  /* Desktop: close a keyboard-opened sub-menu when focus leaves it */
  document.querySelectorAll(".has-sub").forEach(function (li) {
    li.addEventListener("focusout", function (e) {
      if (mqDesktop.matches && li.classList.contains("is-open") && !li.contains(e.relatedTarget)) closeSub(li);
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".has-sub.is-open").forEach(function (li) {
      if (!li.contains(e.target)) closeSub(li);
    });
  });

  /* ---------- Tabs (accessible: click + arrow keys) ---------- */
  function activateTab(tab, focus) {
    var list = tab.closest("[role=tablist]");
    var tabs = list.querySelectorAll("[role=tab]");
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.classList.toggle("is-active", selected);
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) { panel.hidden = !selected; panel.classList.toggle("is-active", selected); }
    });
    if (focus) tab.focus();
    if (window.matchMedia("(max-width: 1023px)").matches) {
      tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }
  document.querySelectorAll("[role=tablist]").forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role=tab]"));
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activateTab(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); activateTab(next, true); }
      });
    });
  });

  /* Links that open a specific tab, e.g. nav "Trailer Hire" -> hire.html#trailer.
     Same page: switch tab in place. Other page: follow the link; the hash opens the tab on arrival. */
  function scrollToTabs(tab) {
    var box = tab.closest(".tabs") || tab.closest("[role=tablist]");
    var header = document.querySelector(".header");
    var offset = header && getComputedStyle(header).position === "sticky" ? header.offsetHeight + 12 : 12;
    var y = box.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }
  function tabFromHash(hash) {
    if (!hash || hash.length < 2) return null;
    return document.querySelector('[role=tab][data-hash="' + hash.slice(1).replace(/"/g, "") + '"]');
  }
  document.querySelectorAll("[data-tab-link]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var tab = document.getElementById(link.getAttribute("data-tab-link"));
      if (!tab) return;                       // tab lives on another page: normal navigation
      e.preventDefault();
      activateTab(tab);
      scrollToTabs(tab);
      if (tab.dataset.hash && history.replaceState) history.replaceState(null, "", "#" + tab.dataset.hash);
    });
  });
  function openHashTab() {
    var tab = tabFromHash(location.hash);
    if (tab) { activateTab(tab); setTimeout(function () { scrollToTabs(tab); }, 60); }
  }
  openHashTab();
  window.addEventListener("hashchange", openHashTab);
  /* Keep the URL in sync when a tab is clicked, so it can be shared/bookmarked */
  document.querySelectorAll("[role=tab][data-hash]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      if (history.replaceState) history.replaceState(null, "", "#" + tab.dataset.hash);
    });
  });

  /* ---------- Carousels (arrow buttons scroll the track) ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function (c) {
    var track = c.querySelector(".carousel__track");
    function step() {
      var item = track.firstElementChild;
      return item ? item.getBoundingClientRect().width + 14 : track.clientWidth;
    }
    c.querySelector("[data-prev]").addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    c.querySelector("[data-next]").addEventListener("click", function () {
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step(), behavior: "smooth" });
    });
  });

  /* ---------- Contact page: show which service the visitor came from ----------
     Links like contact.html?service=Trailer%20Hire#quote land on the call card. */
  var enquiryService = document.querySelector("[data-enquiry-service]");
  if (enquiryService && window.URLSearchParams) {
    var svc = new URLSearchParams(location.search).get("service");
    if (svc) {
      enquiryService.textContent = svc.slice(0, 80);
      enquiryService.closest(".enquiry-card__service").hidden = false;
      var mail = document.querySelector("[data-mailto-service]");
      if (mail) mail.href = mail.href.split("?")[0] + "?subject=" + encodeURIComponent("Enquiry: " + svc.slice(0, 80));
    }
  }

  /* =========================================================
     Membership mockup: Join/Login modal, members-only gating,
     demo "preview as member" switch. Front-end only, no auth.
     ========================================================= */
  var body = document.body;
  var modal = document.getElementById("auth-modal");
  var toastEl = null, toastTimer = null;

  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 3200);
  }

  function openAuth(mode, opts) {
    if (!modal) return;
    opts = opts || {};
    var gate = modal.querySelector(".modal__gate");
    if (opts.gate) {
      gate.hidden = false;
      modal.querySelector(".modal__gate-text").textContent = opts.gate;
    } else {
      gate.hidden = true;
    }
    var tier = document.getElementById("join-tier");
    if (opts.tier && tier) tier.value = opts.tier;
    modal.querySelector(".modal__title").textContent = mode === "login" ? "Log in to Real Time Traders"
      : (opts.tier === "Free" ? "Create a free account" : "Join Real Time Traders");
    var tab = document.getElementById(mode === "login" ? "tab-login" : "tab-join");
    if (tab) activateTab(tab);
    modal.querySelectorAll(".form-status").forEach(function (s) { s.textContent = ""; });
    if (typeof modal.showModal === "function") { if (!modal.open) modal.showModal(); }
    else modal.setAttribute("open", "");
  }
  function closeAuth() {
    if (!modal) return;
    if (typeof modal.close === "function") modal.close(); else modal.removeAttribute("open");
  }

  /* Capture phase: runs before any other click handler on the target.
     .members-only = paid membership needed; .account-only = a free account is enough (e.g. Post a job) */
  function cleanLabel(el) { return el.textContent.replace(/\((members only|free account).*\)/, "").trim(); }
  document.addEventListener("click", function (e) {
    var gated = e.target.closest(".members-only, .account-only");
    if (!gated) return;
    var member = body.classList.contains("is-member");
    var allowed = member || (gated.classList.contains("account-only") && body.classList.contains("has-account"));
    if (!allowed) {
      e.preventDefault();
      e.stopPropagation();
      var label = cleanLabel(gated);
      if (gated.classList.contains("account-only")) {
        openAuth("join", { gate: "“" + label + "” needs a free account. Sign up free: a connection fee applies when you accept a quote, or pay $0 with Basic.", tier: "Free" });
      } else {
        openAuth("join", { gate: "“" + label + "” needs " + gated.getAttribute("data-tip").toLowerCase().replace(/^(\w)/, function (c) { return c.toUpperCase(); }) + ".", tier: gated.getAttribute("data-tier") === "Bronze" ? "Bronze" : "Basic" });
      }
      return;
    }
    if ((gated.tagName === "A" && gated.getAttribute("href") === "#") || (gated.tagName === "BUTTON" && gated.type !== "submit")) {
      e.preventDefault();
      toast((member ? "Member" : "Free account") + " preview: “" + cleanLabel(gated) + "” goes live when accounts launch. Nothing was saved.");
    }
  }, true);

  document.querySelectorAll("[data-auth]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      if (body.classList.contains("is-signed-in")) { location.href = "account.html"; return; }
      openAuth(el.getAttribute("data-auth"), { tier: el.getAttribute("data-join-tier") });
    });
  });

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeAuth();            // backdrop click
      if (e.target.closest("[data-close]")) closeAuth();
    });
    /* Real accounts (Supabase Auth, email + password). Membership tiers are not charged here:
       every new account starts as a free account. */
    var ACCOUNT_URL = location.origin + location.pathname.replace(/[^\/]*$/, "") + "account.html";
    function authStatus(f, msg, isError) {
      var st = f.querySelector(".form-status");
      st.classList.toggle("is-error", !!isError);
      st.textContent = msg;
    }
    function authError(err) {
      var m = (err && (err.message || err.error_description)) || "";
      if (/already registered|already exists/i.test(m)) return "That email already has an account. Use Log in instead.";
      if (/invalid login credentials/i.test(m)) return "Wrong email or password.";
      if (/email not confirmed/i.test(m)) return "Please confirm your email first: check your inbox for the link we sent.";
      if (/password/i.test(m) && /least|short|characters/i.test(m)) return "Please use a password of at least 8 characters.";
      if (/rate limit|too many/i.test(m)) return "Too many attempts. Please wait a few minutes and try again.";
      if (m === "not_configured" || m === "load_failed" || /fetch/i.test(m)) return "We couldn't reach the sign-in service. Check your connection or call us.";
      return m && m.length < 160 ? m : "Something went wrong. Please try again or call us.";
    }
    var joinForm = modal.querySelector("#panel-join form"), loginForm = modal.querySelector("#panel-login form");
    if (joinForm) joinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = joinForm.elements.name.value.trim(), email = joinForm.elements.email.value.trim(), pw = joinForm.elements.password.value;
      if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return authStatus(joinForm, "Please add your name and a valid email.", true);
      if (pw.length < 8) return authStatus(joinForm, "Please use a password of at least 8 characters.", true);
      var btn = joinForm.querySelector("[type=submit]"); btn.disabled = true;
      authStatus(joinForm, "Creating your account…");
      hire().then(function (H) { return H.client(); }).then(function (sb) {
        return sb.auth.signUp({ email: email, password: pw, options: { data: { full_name: name }, emailRedirectTo: ACCOUNT_URL } });
      }).then(function (r) {
        if (r.error) throw r.error;
        if (r.data && r.data.session) { location.href = "account.html?welcome=1"; return; }
        // Supabase returns a user with no identities when the email is already registered.
        if (r.data && r.data.user && r.data.user.identities && r.data.user.identities.length === 0) throw new Error("already registered");
        joinForm.reset();
        authStatus(joinForm, "Almost done: we've emailed a confirmation link to " + email + ". Open it to finish creating your account; you'll be signed in automatically.");
      }).catch(function (err) { authStatus(joinForm, authError(err), true); })
        .then(function () { btn.disabled = false; });
    });
    if (loginForm) loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = loginForm.elements.email.value.trim(), pw = loginForm.elements.password.value;
      if (!email || !pw) return authStatus(loginForm, "Please enter your email and password.", true);
      var btn = loginForm.querySelector("[type=submit]"); btn.disabled = true;
      authStatus(loginForm, "Signing in…");
      hire().then(function (H) { return H.client(); }).then(function (sb) {
        return sb.auth.signInWithPassword({ email: email, password: pw });
      }).then(function (r) {
        if (r.error) throw r.error;
        location.href = "account.html";
      }).catch(function (err) { authStatus(loginForm, authError(err), true); btn.disabled = false; });
    });
    modal.querySelectorAll("[data-forgot]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.closest("form"), email = f.elements.email.value.trim();
        if (!email) return authStatus(f, "Enter your email above, then press Forgot password.", true);
        hire().then(function (H) { return H.client(); }).then(function (sb) {
          return sb.auth.resetPasswordForEmail(email, { redirectTo: ACCOUNT_URL + "?reset=1" });
        }).then(function (r) {
          if (r.error) throw r.error;
          authStatus(f, "If that email has an account, we've sent a link to reset your password.");
        }).catch(function (err) { authStatus(f, authError(err), true); });
      });
    });
  }

  /* Demo account state: "guest" (no account), "free" (free account) or "member" (paid). Kept per browser tab. */
  function setMode(mode) {
    body.classList.toggle("is-member", mode === "member");
    body.classList.toggle("has-account", mode === "free");
    try { sessionStorage.setItem("rtt-demo-mode", mode); } catch (err) {}
    document.querySelectorAll("[data-demo-toggle]").forEach(function (b) { b.textContent = mode === "member" ? "Back to guest view" : "Preview as member"; });
    document.querySelectorAll("[data-demo-free]").forEach(function (b) { b.textContent = mode === "free" ? "Back to guest view" : "Preview with free account"; });
    document.querySelectorAll(".header__login").forEach(function (a) {
      a.textContent = mode === "member" ? "My account (demo)" : mode === "free" ? "Free account (demo)" : "Login / Join";
    });
  }
  function currentMode() { return body.classList.contains("is-member") ? "member" : body.classList.contains("has-account") ? "free" : "guest"; }
  document.querySelectorAll("[data-demo-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var mode = currentMode() === "member" ? "guest" : "member";
      setMode(mode); closeAuth();
      toast(mode === "member" ? "Previewing as a paid member: all locks removed (demo only)." : "Back to guest view.");
    });
  });
  document.querySelectorAll("[data-demo-free]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var mode = currentMode() === "free" ? "guest" : "free";
      setMode(mode); closeAuth();
      toast(mode === "free" ? "Previewing with a free account: you can post jobs; buying, selling and quoting stay locked (demo only)." : "Back to guest view.");
    });
  });

  /* Remember the demo preview while moving between pages (this tab only) */
  try {
    var saved = sessionStorage.getItem("rtt-demo-mode");
    if (!saved && sessionStorage.getItem("rtt-demo-member") === "1") saved = "member";
    if (saved === "member" || saved === "free") setMode(saved);
  } catch (err) {}

  /* ---------- Join / Log in modal: Continue with Google (real Supabase Auth) ----------
     Loads js/hire-config.js + js/hire-common.js on demand (pages that already include them reuse them).
     Google accounts are normal accounts: no admin or paid-membership rights come from signing in. */
  function loadScriptOnce(src) {
    return new Promise(function (res, rej) {
      if (document.querySelector('script[src="' + src + '"]')) return res();
      var sc = document.createElement("script"); sc.src = src; sc.onload = function () { res(); }; sc.onerror = function () { rej(new Error("load_failed")); };
      document.head.appendChild(sc);
    });
  }
  function hire() {
    if (window.RTTHire) return Promise.resolve(window.RTTHire);
    return loadScriptOnce("js/hire-config.js").then(function () { return loadScriptOnce("js/hire-common.js"); })
      .then(function () { if (!window.RTTHire || !window.RTTHire.config()) throw new Error("not_configured"); return window.RTTHire; });
  }
  function showSignedIn(user) {
    var email = (user && user.email) || "your account";
    body.classList.add("has-account", "is-signed-in");
    document.querySelectorAll(".header__login").forEach(function (a) { a.textContent = "My account"; a.title = "Signed in as " + email; });
    if (!modal) return;
    modal.querySelectorAll("[data-gsi-account]").forEach(function (el) { el.remove(); });
    modal.querySelectorAll(".tab-panel").forEach(function (panel) {
      var p = document.createElement("p");
      p.className = "gsi-account"; p.setAttribute("data-gsi-account", "");
      p.innerHTML = 'Signed in as <strong></strong>. <button type="button" class="link-btn">Sign out</button>';
      p.querySelector("strong").textContent = email;
      p.querySelector("button").addEventListener("click", function () {
        hire().then(function (H) { return H.client(); }).then(function (sb) { return sb.auth.signOut(); }).then(function () { location.reload(); });
      });
      panel.insertBefore(p, panel.firstChild);
    });
  }
  function initGoogle() {
    if (!modal) return;
    modal.querySelectorAll(".tab-panel").forEach(function (panel) {
      var form = panel.querySelector("form");
      if (!form || panel.querySelector("[data-google-signin]")) return;
      var st = form.querySelector(".form-status");
      var wrap = document.createElement("div");
      wrap.className = "gsi-wrap";
      panel.insertBefore(wrap, form);
      hire().then(function (H) {
        var real = H.googleButton(function () { return H.client(); }, st);
        wrap.replaceWith(real);
      }).catch(function () { wrap.remove(); });
    });
    var returning = /(^#|&)(access_token|error)=/.test(location.hash) || /[?&]code=/.test(location.search);
    var stored = false;
    try { for (var i = 0; i < localStorage.length; i++) if (/^sb-.*-auth-token$/.test(localStorage.key(i))) stored = true; } catch (e) {}
    if (!returning && !stored) return;
    hire().then(function (H) {
      var err = returning && H.oauthReturnError();
      return H.client().then(function (sb) { return sb.auth.getSession(); }).then(function (r) {
        var session = r.data && r.data.session;
        if (session) { showSignedIn(session.user); if (returning) toast("Signed in as " + (session.user.email || "your account") + "."); }
        else if (err) { openAuth("login"); var st = modal.querySelector("#panel-login .form-status"); if (st) { st.classList.add("is-error"); st.textContent = err; } }
      });
    }).catch(function () {});
  }
  // Wait for DOMContentLoaded so deferred hire-config.js / hire-common.js later on the page have run.
  if (document.readyState !== "complete") document.addEventListener("DOMContentLoaded", initGoogle); else initGoogle();

  /* ---------- Header search: no search backend yet, so it opens the matching section ---------- */
  document.querySelectorAll("[data-site-search]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var target = (f.querySelector("select") || {}).value || "marketplace.html";
      var q = (f.querySelector("input[type=search]") || {}).value || "";
      var parts = target.split("#");
      location.href = parts[0] + (q.trim() ? "?q=" + encodeURIComponent(q.trim()) : "") + (parts[1] ? "#" + parts[1] : "");
    });
  });
  if (window.URLSearchParams) {
    var q = new URLSearchParams(location.search).get("q");
    if (q) setTimeout(function () { toast("Live search is coming soon. Browse this section, or call us and we'll help you find “" + q.slice(0, 40) + "”."); }, 300);
  }

  /* ---------- Filter / directory forms that are previews only ---------- */
  document.querySelectorAll("form[data-preview-msg]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = f.querySelector(".form-status");
      if (status) status.textContent = f.getAttribute("data-preview-msg");
    });
  });

  /* Post a job form (only reachable with an account preview; front-end only) */
  var jobForm = document.getElementById("post-job-form");
  if (jobForm) {
    jobForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = jobForm.querySelector(".form-status");
      var ok = true;
      jobForm.querySelectorAll("[required]").forEach(function (input) {
        var bad = !input.value.trim();
        input.closest(".field").classList.toggle("is-invalid", bad);
        if (bad) ok = false;
      });
      status.classList.toggle("is-error", !ok);
      status.textContent = ok ? "Preview only: posting goes live when accounts launch. Nothing was sent or saved." : "Please add a title, category, suburb and description.";
    });
  }


  /* ---------- Phone hours: "Open now" / "Closed – opens at X" (Australia/Brisbane, no DST) ----------
     Static hours stay in the HTML as the fallback if this doesn't run. */
  var RTT_HOURS = { label: "Mon–Fri 5am–9pm, Sat–Sun 7am–4pm", week: [[7, 16], [5, 21], [5, 21], [5, 21], [5, 21], [5, 21], [7, 16]] }; // index 0 = Sunday, [open, close) hours
  window.RTT_HOURS = RTT_HOURS;
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function fmtHour(h) { return (h % 12 || 12) + (h < 12 ? "am" : "pm"); }
  function brisbaneNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Brisbane", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var day = DAYS.indexOf(o.weekday.slice(0, 3));
      if (day < 0) return null;
      return { day: day, mins: parseInt(o.hour, 10) % 24 * 60 + parseInt(o.minute, 10) };
    } catch (e) { return null; }
  }
  function openStatus() {
    var now = brisbaneNow();
    if (!now) return null;
    var t = RTT_HOURS.week[now.day];
    if (now.mins >= t[0] * 60 && now.mins < t[1] * 60) return { open: true, text: "Open now – until " + fmtHour(t[1]) };
    for (var i = 0; i < 8; i++) {
      var d = (now.day + i) % 7, w = RTT_HOURS.week[d];
      if (i === 0 && now.mins >= w[0] * 60) continue;
      var when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAYS[d];
      return { open: false, text: "Closed – opens " + fmtHour(w[0]) + " " + when };
    }
    return null;
  }
  window.RTT_openStatus = openStatus;
  window.RTT_openAuth = openAuth;
  function renderStatus() {
    var st = openStatus();
    if (!st) return;
    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      var txt = st.text + (el.hasAttribute("data-open-long") ? " (Brisbane time)." : "");
      if (el.hasAttribute("data-open-hours")) {
        el.textContent = "";
        el.appendChild(document.createTextNode(txt));
        var h = document.createElement("span");
        h.className = "open-hours";
        h.textContent = " · " + RTT_HOURS.label;
        el.appendChild(h);
      } else {
        el.textContent = txt;
      }
      el.classList.toggle("is-open", st.open);
      el.classList.toggle("is-closed", !st.open);
      el.hidden = false;
    });
  }
  renderStatus();
  setInterval(renderStatus, 60000);

})();
