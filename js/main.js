/* Real Time Traders: small vanilla JS helpers (no dependencies) */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.matchMedia("(max-width: 1023px)").matches) setMenu(false);
    });
  }

  /* Sub-menu toggle (click on mobile, also works with keyboard on desktop) */
  document.querySelectorAll(".nav__sub-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest(".has-sub");
      var open = !li.classList.contains("is-open");
      li.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".has-sub.is-open").forEach(function (li) {
      if (!li.contains(e.target)) {
        li.classList.remove("is-open");
        li.querySelector(".nav__sub-toggle").setAttribute("aria-expanded", "false");
      }
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

  /* ---------- Wishlist hearts (visual only) ---------- */
  document.querySelectorAll(".product-card .icon-btn--plain").forEach(function (btn) {
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", function () {
      var on = btn.classList.toggle("is-saved");
      btn.setAttribute("aria-pressed", String(on));
    });
  });

  /* ---------- "Book" buttons preselect the service in the quote form ----------
     The form lives on contact.html. Elsewhere the link goes to contact.html?service=...#quote */
  var serviceSelect = document.getElementById("quote-service");
  function prefillService(service) {
    if (!serviceSelect || !service) return;
    var wanted = service.toLowerCase();
    var opts = Array.prototype.slice.call(serviceSelect.options);
    var match = opts.find(function (o) {
      var t = o.text.toLowerCase();
      return wanted.indexOf(t.split(" (")[0].split(" /")[0]) === 0 || t.indexOf(wanted) === 0;
    }) || opts.find(function (o) { return wanted.indexOf(o.text.toLowerCase().split(" ")[0]) === 0; });
    if (match) serviceSelect.value = match.value || match.text;
    var details = document.querySelector("#quote-form textarea");
    if (details && !details.value && wanted.indexOf("–") > -1) details.value = service + ": ";
  }
  document.querySelectorAll("[data-service]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (!serviceSelect) return;             // no form here: go to contact.html?service=...
      e.preventDefault();
      prefillService(el.getAttribute("data-service"));
      var target = document.getElementById("quote");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  if (serviceSelect && window.URLSearchParams) {
    var qsService = new URLSearchParams(location.search).get("service");
    if (qsService) prefillService(qsService);
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
    if (gated.tagName === "A" && gated.getAttribute("href") === "#") {
      e.preventDefault();
      toast((member ? "Member" : "Free account") + " preview: this would open the “" + cleanLabel(gated) + "” flow (needs a backend).");
    }
  }, true);

  document.querySelectorAll("[data-auth]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openAuth(el.getAttribute("data-auth"), { tier: el.getAttribute("data-join-tier") });
    });
  });

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeAuth();            // backdrop click
      if (e.target.closest("[data-close]")) closeAuth();
    });
    modal.querySelectorAll("[data-demo-form]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        f.querySelector(".form-status").textContent = "Mockup only: no account was created. Real sign-up and payments need a backend.";
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

  /* Post a job form (only reachable as a member, front-end only) */
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
      status.textContent = ok ? "Job ready to post (demo only: nothing was sent or saved)." : "Please add a title, category, suburb and description.";
      if (ok) jobForm.reset();
    });
  }

  /* ---------- Quote form (front-end only placeholder) ---------- */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var bad = !input.value.trim();
        input.closest(".field").classList.toggle("is-invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) {
        status.textContent = "Please fill in your name, phone and suburb.";
        status.classList.add("is-error");
        return;
      }
      status.classList.remove("is-error");
      status.textContent = "Thanks! Your request is ready to send. (Demo only: connect this form to email or a booking system.)";
      form.reset();
    });
  }
})();
