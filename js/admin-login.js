/* admin-login.html: staff sign-in with Supabase Auth.
   - Email + password (signInWithPassword), "Forgot password" (resetPasswordForEmail), optional email link (signInWithOtp).
   - After sign-in, public.is_admin() (user_roles + RLS) decides: admins go to admin.html; anyone else is signed out.
   - No passwords are checked or stored in this file. This page is only the door: the database enforces access. */
(function () {
  "use strict";
  var H = window.RTTHire;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var forms = { login: $("[data-login-form]"), reset: $("[data-reset-form]"), magic: $("[data-magic-form]"), newpw: $("[data-newpw-form]") };
  var msg = $("[data-login-msg]");
  var here = location.origin + location.pathname;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var sb = null, recovering = /type=recovery/.test(location.hash);

  function show(name, focus) {
    Object.keys(forms).forEach(function (k) { forms[k].hidden = k !== name; });
    if (focus !== false) { var i = forms[name].querySelector("input"); if (i && !i.disabled) i.focus(); }
  }
  function note(text, isError) {
    msg.hidden = !text; msg.textContent = text || "";
    msg.classList.toggle("is-error", !!isError);
  }
  function status(form, text, isError) {
    var el = form.querySelector(".form-status");
    el.textContent = text || ""; el.classList.toggle("is-error", !!isError);
  }
  function busy(form, on) { $$("button", form).forEach(function (b) { b.disabled = on; }); }
  function emailOf(form) { return form.elements.email.value.trim(); }
  function friendly(err) {
    var m = String((err && (err.message || err.error_description)) || err || "");
    if (/invalid login credentials|invalid_grant|invalid_credentials/i.test(m)) return "Email or password is incorrect.";
    if (/email not confirmed/i.test(m)) return "This email address hasn't been confirmed yet. Check your inbox for the confirmation email.";
    if (/rate limit|too many/i.test(m)) return "Too many attempts. Please wait a few minutes and try again.";
    return H && H.errorText ? H.errorText(err) : "Something went wrong. Please try again.";
  }

  $$("[data-show]").forEach(function (b) {
    b.addEventListener("click", function () {
      var target = b.getAttribute("data-show");
      var cur = Object.keys(forms).filter(function (k) { return !forms[k].hidden; })[0];
      if (cur && forms[target].elements.email && forms[cur].elements.email && !forms[target].elements.email.value) forms[target].elements.email.value = emailOf(forms[cur]);
      note(""); show(target);
    });
  });

  /* ---------- not configured: honest notice, forms stay disabled ---------- */
  if (!H || !H.config()) {
    $("[data-login-unconfigured]").hidden = false;
    return;
  }

  /* ---------- after sign-in: check the admin role ---------- */
  var checking = false;
  function checkAdmin(session) {
    if (!session || checking || recovering) return;
    checking = true;
    note("Checking admin access…");
    sb.rpc("is_admin").then(function (r) {
      if (r.error) throw r.error;
      if (r.data === true) { note("Signed in. Opening the admin page…"); location.replace("admin.html"); return; }
      return sb.auth.signOut().then(function () {
        note("This account doesn't have admin access. You've been signed out.", true);
        show("login", false);
      });
    }).catch(function (err) {
      note(friendly(err), true);
    }).then(function () { checking = false; });
  }

  H.client().then(function (client) {
    sb = client;
    $$("[data-login-fields]").forEach(function (f) { f.disabled = false; });
    if (/[?&]reason=not-admin/.test(location.search)) note("This account doesn't have admin access. You've been signed out.", true);
    if (/[?&]reason=signed-out/.test(location.search)) note("You're signed out.");

    forms.login.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = forms.login, email = emailOf(f), pw = f.elements.password.value;
      note("");
      if (!EMAIL_RE.test(email) || !pw) { status(f, "Enter your email and password.", true); return; }
      busy(f, true); status(f, "Signing in…");
      sb.auth.signInWithPassword({ email: email, password: pw }).then(function (r) {
        if (r.error) throw r.error;
        f.elements.password.value = "";
        status(f, "");
        checkAdmin(r.data.session);
      }).catch(function (err) { status(f, friendly(err), true); })
        .then(function () { busy(f, false); });
    });

    forms.reset.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = forms.reset, email = emailOf(f);
      if (!EMAIL_RE.test(email)) { status(f, "Please enter a valid email address.", true); return; }
      busy(f, true); status(f, "Sending…");
      sb.auth.resetPasswordForEmail(email, { redirectTo: here }).then(function (r) {
        if (r.error) throw r.error;
        status(f, "If an account exists for " + email + ", we've emailed a link to set a new password.");
      }).catch(function (err) { status(f, friendly(err), true); })
        .then(function () { busy(f, false); });
    });

    forms.magic.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = forms.magic, email = emailOf(f);
      if (!EMAIL_RE.test(email)) { status(f, "Please enter a valid email address.", true); return; }
      busy(f, true); status(f, "Sending…");
      sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: here, shouldCreateUser: false } }).then(function (r) {
        if (r.error) throw r.error;
        status(f, "If " + email + " has an admin account, we've emailed a sign-in link. Open it on this device.");
      }).catch(function (err) { status(f, friendly(err), true); })
        .then(function () { busy(f, false); });
    });

    forms.newpw.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = forms.newpw, pw = f.elements.password.value;
      if (!pw || pw !== f.elements.confirm.value) { status(f, "The two passwords don't match.", true); return; }
      busy(f, true); status(f, "Saving…");
      sb.auth.updateUser({ password: pw }).then(function (r) {
        if (r.error) throw r.error;
        f.reset(); recovering = false;
        status(f, "");
        note("Password updated.");
        return sb.auth.getSession().then(function (s) { checkAdmin(s.data.session); });
      }).catch(function (err) { status(f, friendly(err), true); })
        .then(function () { busy(f, false); });
    });

    sb.auth.onAuthStateChange(function (evt, session) {
      if (evt === "PASSWORD_RECOVERY") { recovering = true; note("Choose a new password for your admin account."); show("newpw"); return; }
      if (evt === "SIGNED_IN" && !recovering) checkAdmin(session);
    });
    return sb.auth.getSession().then(function (r) {
      if (recovering) { note("Choose a new password for your admin account."); show("newpw"); return; }
      if (r.data.session) checkAdmin(r.data.session);
    });
  }).catch(function (err) {
    note(friendly(err), true);
  });
})();
