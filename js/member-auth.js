/* Member accounts with Supabase Auth: login.html, join.html and portal.html.
   - Uses the shared client from js/hire-common.js (window.RTTHire.client) and the PUBLIC
     anon key in js/hire-config.js. No keys live in this file.
   - login.html: email + password, "Forgot password?" (resetPasswordForEmail), email sign-in link
     (signInWithOtp), recovery links open a "Choose a new password" form (updateUser), Google.
   - join.html: signUp with the name and chosen tier in user metadata, then either opens the
     portal (no email confirmation) or asks the member to confirm their email.
   - portal.html: needs a session, otherwise sends you to login.html. Shows your name, email
     and tier, your own hire bookings (RLS), and saves basic settings.
   - The membership tier you pick is a REQUEST until billing exists: public.profiles keeps
     membership_tier = 'free' and requested_tier = your choice (see supabase/migrations).
   Validation runs first in js/member-portal.js, which then calls RTTMemberAuth.submit(). */
(function () {
  "use strict";
  var H = window.RTTHire;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var page = /join\.html$/.test(location.pathname) ? "join" : /portal\.html$/.test(location.pathname) ? "portal" : "login";
  var base = location.origin + location.pathname.replace(/[^/]*$/, "");
  var URLS = { portal: base + "portal.html", login: base + "login.html" };
  var TIERS = { free: "Free account", basic: "Basic", bronze: "Bronze", silver: "Silver", gold: "Gold" };
  var cfg = H && H.config ? H.config() : null;

  /* Read auth link details BEFORE the Supabase client starts (it clears the hash). */
  var hashP = new URLSearchParams(location.hash.replace(/^#/, ""));
  var queryP = new URLSearchParams(location.search);
  var linkType = hashP.get("type") || queryP.get("type") || "";
  var linkCode = queryP.get("code");
  var linkTokenHash = queryP.get("token_hash");
  var linkError = hashP.get("error_description") || queryP.get("error_description") || hashP.get("error") || queryP.get("error");
  var recovering = linkType === "recovery";
  var LINK_FAILED = "This link is invalid or has expired. Please sign in, or ask for a fresh link.";

  function cleanUrl() {
    if (!history.replaceState) return;
    var keep = new URLSearchParams(location.search);
    ["code", "token_hash", "type", "error", "error_code", "error_description", "redirect_to", "reason"].forEach(function (k) { keep.delete(k); });
    var q = keep.toString();
    history.replaceState(null, "", location.pathname + (q ? "?" + q : ""));
  }
  var msgEl = $("[data-member-msg]");
  function note(text, isError) {
    if (!msgEl) return;
    msgEl.hidden = !text; msgEl.textContent = text || "";
    msgEl.classList.toggle("is-error", !!isError);
  }
  function status(form, text, isError) {
    var el = form && form.querySelector(".form-status");
    if (!el) return;
    el.textContent = text || ""; el.classList.toggle("is-error", !!isError);
  }
  function busy(form, on) { $$("button", form).forEach(function (b) { b.disabled = on; }); }
  function friendly(err) {
    var m = String((err && (err.message || err.error_description || err.msg)) || err || "");
    if (/invalid login credentials|invalid_grant|invalid_credentials/i.test(m)) return "Email or password is incorrect.";
    if (/email not confirmed/i.test(m)) return "Please confirm your email first: open the link in the email we sent you.";
    if (/already registered|already been registered|user_already_exists/i.test(m)) return "An account with this email already exists. Please sign in, or use “Forgot password?”.";
    if (/signups not allowed|otp_disabled|user not found/i.test(m)) return "If that email has an account, we've sent a sign-in link. New here? Create an account instead.";
    if (/signups? (are )?disabled|signup_disabled/i.test(m)) return "New accounts can't be created online right now. Please call us.";
    if (/password should be|weak_password|at least \d+ characters/i.test(m)) return "Please choose a stronger password (at least 8 characters, mixing letters and numbers).";
    if (/provider is not enabled|unsupported provider/i.test(m)) return "Google sign-in isn't switched on yet. Please use your email and password for now.";
    if (/rate limit|too many|security purposes/i.test(m)) return "Too many attempts. Please wait a few minutes and try again.";
    if (/failed to fetch|network|load_failed/i.test(m)) return "We couldn't reach the sign-in service. Check your connection and try again.";
    return H && H.errorText ? H.errorText(err) : "Something went wrong. Please try again.";
  }
  function showView(name) {
    $$("[data-member-view]").forEach(function (v) { v.hidden = v.getAttribute("data-member-view") !== name; });
  }

  /* Not connected: leave the pages in preview mode (js/member-portal.js shows preview messages). */
  if (!cfg) { window.RTTMemberAuth = { live: false }; return; }
  document.body.classList.add("is-member-live");

  var sbPromise = H.client();

  /* Which external providers are switched on (public GoTrue settings endpoint, anon key only). */
  var settingsPromise = null;
  function authSettings() {
    if (!settingsPromise) {
      settingsPromise = fetch(cfg.url + "/auth/v1/settings", { headers: { apikey: cfg.key } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    }
    return settingsPromise;
  }

  /* ---------- Google ---------- */
  $$("[data-member-google]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var holder = btn.closest("[data-member-oauth]") || btn.parentNode;
      var st = holder.querySelector(".form-status");
      function say(t, bad) { if (st) { st.textContent = t; st.classList.toggle("is-error", !!bad); } }
      btn.disabled = true; say("Opening Google…");
      authSettings().then(function (s) {
        if (s && s.external && s.external.google === false) throw new Error("provider is not enabled");
        return sbPromise;
      }).then(function (sb) {
        return sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: URLS.portal, skipBrowserRedirect: true } });
      }).then(function (r) {
        if (r.error) throw r.error;
        if (!r.data || !r.data.url) throw new Error("provider is not enabled");
        location.assign(r.data.url);
      }).catch(function (err) {
        btn.disabled = false; say(friendly(err), true);
      });
    });
  });

  /* ---------- form handlers (called by js/member-portal.js after validation) ---------- */
  var handlers = {
    login: function (sb, f) {
      busy(f, true); status(f, "Signing in…");
      return sb.auth.signInWithPassword({ email: f.elements.email.value.trim(), password: f.elements.password.value }).then(function (r) {
        if (r.error) throw r.error;
        f.elements.password.value = "";
        status(f, "Signed in. Opening your portal…");
        location.replace(URLS.portal);
      });
    },
    reset: function (sb, f) {
      var email = f.elements.email.value.trim();
      busy(f, true); status(f, "Sending…");
      return sb.auth.resetPasswordForEmail(email, { redirectTo: URLS.login }).then(function (r) {
        if (r.error) throw r.error;
        status(f, "If an account exists for " + email + ", we've emailed a link to choose a new password.");
      });
    },
    magic: function (sb, f) {
      var email = f.elements.email.value.trim();
      busy(f, true); status(f, "Sending…");
      return sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: URLS.portal, shouldCreateUser: false } }).then(function (r) {
        if (r.error && !/signups not allowed|otp_disabled|user not found/i.test(r.error.message || "")) throw r.error;
        status(f, "If " + email + " has an account, we've emailed a sign-in link. Open it on this device.");
      });
    },
    newpw: function (sb, f) {
      var pw = f.elements.password.value;
      if (pw !== f.elements.confirm.value) { status(f, "The two passwords don't match.", true); return Promise.resolve(); }
      busy(f, true); status(f, "Saving…");
      return sb.auth.updateUser({ password: pw }).then(function (r) {
        if (r.error) throw r.error;
        f.reset(); recovering = false;
        status(f, "Password saved. Opening your portal…");
        location.replace(URLS.portal);
      });
    },
    join: function (sb, f) {
      var tierInput = f.querySelector("input[name=tier]:checked");
      var billing = f.querySelector("input[name=billing]:checked");
      var tier = String(tierInput ? tierInput.value : "Free").toLowerCase();
      var email = f.elements.email.value.trim();
      busy(f, true); status(f, "Creating your account…");
      return sb.auth.signUp({
        email: email,
        password: f.elements.password.value,
        options: {
          emailRedirectTo: URLS.portal,
          data: { full_name: f.elements.name.value.trim(), requested_tier: TIERS[tier] ? tier : "free", billing: billing ? billing.value : "monthly" }
        }
      }).then(function (r) {
        if (r.error) throw r.error;
        f.elements.password.value = "";
        if (r.data && r.data.session) { status(f, "Account created. Opening your portal…"); location.replace(URLS.portal); return; }
        /* Email confirmation is on (or the email is already registered: Supabase answers the same way on purpose). */
        f.hidden = true;
        note("Check your email: we've sent a confirmation link to " + email + ". Open it on this device to finish creating your account.");
        if (msgEl) { msgEl.setAttribute("tabindex", "-1"); msgEl.focus(); }
      });
    },
    settings: function (sb, f) {
      var name = f.elements.name.value.trim();
      var meta = { full_name: name, suburb: f.elements.suburb.value.trim(), email_alerts: f.elements.alerts.value };
      busy(f, true); status(f, "Saving…");
      return sb.auth.updateUser({ data: meta }).then(function (r) {
        if (r.error) throw r.error;
        return sb.auth.getUser().then(function (u) {
          var id = u.data && u.data.user && u.data.user.id;
          /* profiles may not exist until the migration is applied: ignore that quietly */
          return id ? sb.from("profiles").update({ full_name: name }).eq("id", id).then(function () {}) : null;
        });
      }).then(function () {
        status(f, "Saved.");
        $$("[data-member-name]").forEach(function (el) { el.textContent = name || "member"; });
      });
    }
  };

  window.RTTMemberAuth = {
    live: true,
    submit: function (kind, form) {
      var fn = handlers[kind];
      if (!fn) return false;
      sbPromise.then(function (sb) { return fn(sb, form); })
        .catch(function (err) { status(form, friendly(err), true); })
        .then(function () { busy(form, false); });
      return true;
    }
  };

  /* ---------- page start-up ---------- */
  function finishLinks(sb) {
    return sb.auth.getSession().then(function (r) {
      var session = r.data && r.data.session;
      if (linkTokenHash && !session) {
        return sb.auth.verifyOtp({ token_hash: linkTokenHash, type: linkType || "email" }).then(function (v) {
          if (v.error) throw v.error; return v.data.session;
        });
      }
      if (linkCode && !session) {
        return sb.auth.exchangeCodeForSession(linkCode).then(function (v) {
          if (v.error) throw v.error; return v.data.session;
        });
      }
      return session;
    });
  }

  sbPromise.then(function (sb) {
    sb.auth.onAuthStateChange(function (evt) {
      if (evt === "PASSWORD_RECOVERY") recovering = true;
      if (evt === "SIGNED_OUT" && page === "portal") location.replace(URLS.login + "?reason=signed-out");
    });
    return finishLinks(sb).then(function (session) {
      var hadLink = !!(linkType || linkCode || linkTokenHash || linkError);
      if (page === "portal") {
        if (!session) {
          var extra = linkError ? "?error_description=" + encodeURIComponent(linkError) : "?reason=sign-in";
          location.replace(URLS.login + extra);
          return;
        }
        if (hadLink) cleanUrl();
        return startPortal(sb, session);
      }
      if (hadLink) cleanUrl();
      if (page === "login") {
        if (linkError && !session) { recovering = false; note(LINK_FAILED, true); return; }
        if (recovering && session) { showView("newpw"); note(""); return; }
        if (recovering && !session) { recovering = false; note(LINK_FAILED, true); return; }
        if (/[?&]reason=signed-out/.test(location.search)) note("You're signed out.");
        if (/[?&]reason=sign-in/.test(location.search)) note("Please sign in to open the members portal.");
        if (hadLink || /[?&]reason=/.test(location.search)) cleanUrl();
      }
      if (session) location.replace(URLS.portal);   // already signed in
    });
  }).catch(function (err) {
    recovering = false; cleanUrl();
    if (page === "portal") { location.replace(URLS.login + "?reason=sign-in"); return; }
    note(/expired|invalid|not found|code verifier|both auth code/i.test(String(err && err.message)) ? LINK_FAILED : friendly(err), true);
  });

  /* ---------- portal ---------- */
  function startPortal(sb, session) {
    var user = session.user || {};
    var meta = user.user_metadata || {};
    var name = meta.full_name || meta.name || "";
    function fill(sel, text) { $$(sel).forEach(function (el) { el.textContent = text; }); }
    fill("[data-member-email]", user.email || "");
    fill("[data-member-name]", name ? name.split(" ")[0] : "member");
    var sf = $("[data-member-form=settings]");
    if (sf) {
      sf.elements.name.value = name;
      sf.elements.email.value = user.email || "";
      if (meta.suburb) sf.elements.suburb.value = meta.suburb;
      if (meta.email_alerts) sf.elements.alerts.value = meta.email_alerts;
    }
    function showTier(current, requested) {
      current = TIERS[current] ? current : "free";
      fill("[data-member-tier]", TIERS[current]);
      var req = $("[data-member-requested]");
      if (req) {
        var pending = requested && TIERS[requested] && requested !== current;
        req.hidden = !pending;
        if (pending) req.textContent = "You chose " + TIERS[requested] + " when you joined. Paid memberships open when online billing launches; until then you're on a free account and nothing is charged.";
      }
    }
    showTier("free", meta.requested_tier);
    sb.from("profiles").select("full_name, membership_tier, requested_tier").eq("id", user.id).maybeSingle().then(function (r) {
      if (r.error || !r.data) return;   // migration not applied yet: metadata is enough
      if (r.data.full_name && !name) fill("[data-member-name]", r.data.full_name.split(" ")[0]);
      showTier(r.data.membership_tier, r.data.requested_tier || meta.requested_tier);
    });
    document.body.classList.add("is-member-ready");

    /* Hire bookings: read-only, own rows only (RLS "customers read own bookings"; the explicit
       customer_id filter keeps admins to their own bookings here too). */
    var list = $("[data-member-bookings]");
    if (list) {
      sb.from("bookings")
        .select("id, reference, equipment_name, start_date, end_date, status")
        .eq("customer_id", user.id)
        .order("start_date", { ascending: false })
        .limit(5)
        .then(function (r) {
          if (r.error || !r.data || !r.data.length) return;
          fill("[data-member-count=bookings]", String(r.data.length) + (r.data.length === 5 ? "+" : ""));
          list.innerHTML = '<ul class="member-list">' + r.data.map(function (b) {
            return '<li><div><strong>' + H.esc(b.equipment_name) + '</strong><span>' + H.esc(H.fmtDate(b.start_date)) +
              (b.end_date && b.end_date !== b.start_date ? " to " + H.esc(H.fmtDate(b.end_date)) : "") +
              (b.reference ? " · Ref " + H.esc(b.reference) : "") + '</span></div>' + H.statusBadge(b.status) + '</li>';
          }).join("") + '</ul><div class="empty-state__ctas"><a href="my-bookings.html" class="btn btn--light btn--sm">Manage hire bookings</a></div>';
        }).catch(function () {});
    }

    $$("[data-member-signout]").forEach(function (b) {
      b.addEventListener("click", function () {
        b.disabled = true;
        sb.auth.signOut().then(function () { location.replace(URLS.login + "?reason=signed-out"); })
          .catch(function () { location.replace(URLS.login + "?reason=signed-out"); });
      });
    });
    $$("[data-member-password]").forEach(function (b) {
      b.addEventListener("click", function () {
        var st = $("[data-member-portal-status]");
        b.disabled = true;
        sb.auth.resetPasswordForEmail(user.email, { redirectTo: URLS.login }).then(function (r) {
          if (r.error) throw r.error;
          st.hidden = false; st.classList.remove("is-error");
          st.textContent = "We've emailed " + user.email + " a link to choose a new password.";
        }).catch(function (err) {
          st.hidden = false; st.classList.add("is-error"); st.textContent = friendly(err);
        }).then(function () { b.disabled = false; });
      });
    });
  }
})();
