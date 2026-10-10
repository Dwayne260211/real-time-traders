/* Member sign-in, join and portal pages (login.html, join.html, portal.html).
   Client-side checks and view switching. When js/member-auth.js is connected to Supabase
   (window.RTTMemberAuth.live), valid forms are handed to it; otherwise the preview
   messages below are shown and nothing is sent or saved. */
(function () {
  "use strict";
  var PREVIEW = "Preview: member accounts are coming soon, so nothing was sent or saved. Questions? Call us.";
  var MSG = {
    login: "Preview: member sign-in is coming soon, so you weren't signed in and nothing was sent.",
    reset: "Preview: password reset is coming soon, so no email was sent.",
    magic: "Preview: email sign-in links are coming soon, so no email was sent.",
    join: "Preview: accounts are coming soon, so no account was created and no payment was taken.",
    settings: "Preview: account settings are coming soon, so nothing was saved."
  };
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function check(input) {
    var v = input.type === "checkbox" ? input.checked : input.value.trim();
    var bad = input.required && !v;
    if (!bad && input.type === "email" && v) bad = !EMAIL.test(v);
    if (!bad && input.minLength > 0 && v && input.value.length < input.minLength) bad = true;
    var field = input.closest(".field");
    if (field) field.classList.toggle("is-invalid", bad);
    input.setAttribute("aria-invalid", bad ? "true" : "false");
    return !bad;
  }

  document.querySelectorAll("form[data-member-form]").forEach(function (form) {
    var kind = form.getAttribute("data-member-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var first = null;
      form.querySelectorAll("input[required]").forEach(function (input) {
        if (!check(input) && !first) first = input;
      });
      var auth = window.RTTMemberAuth;
      if (!first && auth && auth.live && auth.submit(kind, form)) return;
      if (status) {
        status.classList.toggle("is-error", !!first);
        status.textContent = first
          ? (first.type === "checkbox" ? "Please agree to the terms to continue."
            : !first.value.trim() ? "Please fill in the highlighted fields."
            : first.type === "email" ? "Please enter a valid email address."
            : first.minLength > 0 ? "Your password needs at least " + first.minLength + " characters."
            : "Please fill in the highlighted fields.")
          : (MSG[kind] || PREVIEW);
      }
      if (first) first.focus();
    });
    form.addEventListener("input", function (e) {
      if (e.target.closest(".field.is-invalid")) check(e.target);
    });
  });

  /* login.html: switch between sign in, reset and email-link views */
  var views = document.querySelectorAll("[data-member-view]");
  document.querySelectorAll("[data-member-show]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var want = btn.getAttribute("data-member-show"), shown = null;
      var email = btn.closest("form").querySelector("input[type=email]");
      views.forEach(function (v) {
        v.hidden = v.getAttribute("data-member-view") !== want;
        if (!v.hidden) shown = v;
      });
      if (shown) {
        var to = shown.querySelector("input[type=email]");
        if (to && email && email.value) to.value = email.value;
        var h = shown.querySelector("h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
      }
    });
  });

  /* join.html: preselect a tier from ?tier=, and show yearly prices when chosen */
  var tierInputs = document.querySelectorAll("input[name=tier]");
  if (tierInputs.length && window.URLSearchParams) {
    var t = new URLSearchParams(location.search).get("tier");
    tierInputs.forEach(function (i) { if (t && i.value.toLowerCase() === t.toLowerCase()) i.checked = true; });
  }
  document.querySelectorAll("input[name=billing]").forEach(function (b) {
    b.addEventListener("change", function () {
      document.body.classList.toggle("is-yearly", b.value === "yearly" && b.checked);
    });
  });

  /* portal.html: preview sign out, and highlight the side nav item */
  var pStatus = document.querySelector("[data-member-portal-status]");
  document.querySelectorAll("[data-member-signout]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!pStatus || (window.RTTMemberAuth && window.RTTMemberAuth.live)) return;
      pStatus.hidden = false;
      pStatus.textContent = "Preview: sign-in is coming soon, so there's nothing to sign out of yet.";
    });
  });
  var navLinks = document.querySelectorAll(".member-portal__nav a");
  navLinks.forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.forEach(function (o) { o.removeAttribute("aria-current"); });
      a.setAttribute("aria-current", "true");
    });
  });
})();
