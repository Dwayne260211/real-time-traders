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

  /* Links that open a specific tab, e.g. nav "Trailer Hire" -> services tab */
  document.querySelectorAll("[data-tab-link]").forEach(function (link) {
    link.addEventListener("click", function () {
      var tab = document.getElementById(link.getAttribute("data-tab-link"));
      if (tab) activateTab(tab);
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

  /* ---------- "Book" buttons preselect the service in the quote form ---------- */
  var serviceSelect = document.getElementById("quote-service");
  document.querySelectorAll("[data-service]").forEach(function (el) {
    el.addEventListener("click", function () {
      if (!serviceSelect) return;
      var wanted = el.getAttribute("data-service").toLowerCase();
      var opts = Array.prototype.slice.call(serviceSelect.options);
      var match = opts.find(function (o) {
        var t = o.text.toLowerCase();
        return wanted.indexOf(t.split(" (")[0].split(" /")[0]) === 0 || t.indexOf(wanted) === 0;
      }) || opts.find(function (o) { return wanted.indexOf(o.text.toLowerCase().split(" ")[0]) === 0; });
      if (match) serviceSelect.value = match.value || match.text;
      var details = document.querySelector("#quote-form textarea");
      if (details && !details.value && wanted.indexOf("–") > -1) details.value = el.getAttribute("data-service") + ": ";
    });
  });

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
    modal.querySelector(".modal__title").textContent = mode === "login" ? "Log in to Real Time Traders" : "Join Real Time Traders";
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

  /* Capture phase: runs before any other click handler on the target */
  document.addEventListener("click", function (e) {
    var gated = e.target.closest(".members-only");
    if (gated && !body.classList.contains("is-member")) {
      e.preventDefault();
      e.stopPropagation();
      var label = gated.textContent.replace(/\(members only.*\)/, "").trim();
      openAuth("join", { gate: "“" + label + "” needs " + gated.getAttribute("data-tip").toLowerCase().replace(/^(\w)/, function (c) { return c.toUpperCase(); }) + ".", tier: gated.getAttribute("data-tier") === "Bronze" ? "Bronze" : "Basic" });
      return;
    }
    if (gated && body.classList.contains("is-member") && gated.tagName === "A" && gated.getAttribute("href") === "#") {
      e.preventDefault();
      toast("Member preview: this would open the “" + gated.textContent.replace(/\(members only.*\)/, "").trim() + "” flow (needs a backend).");
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

  function setMember(on) {
    body.classList.toggle("is-member", on);
    document.querySelectorAll("[data-demo-toggle]").forEach(function (b) { b.textContent = on ? "Back to guest view" : "Preview as member"; });
    document.querySelectorAll(".header__login").forEach(function (a) { a.textContent = on ? "My account (demo)" : "Login / Join"; });
  }
  document.querySelectorAll("[data-demo-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var on = !body.classList.contains("is-member");
      setMember(on);
      closeAuth();
      toast(on ? "Previewing as a member: locks removed (demo only)." : "Back to guest view.");
    });
  });

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
