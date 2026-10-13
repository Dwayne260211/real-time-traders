/*
 * Real Time Traders: "Coming soon" lock with admin-only access.
 * Runs on the custom domain (realtimetradersbrisbane.au + www); the github.io address is left open.
 * Add ?gate=preview to any URL to see the coming-soon screen on other hosts for testing.
 * admin-login.html is never gated (admins must be able to sign in).
 * Admins get in by either:
 *   a) entering the shared password (Admin link > password), or
 *   b) signing in at admin-login.html with an account where public.is_admin() is true.
 * Both set localStorage[KEY] = GATE_HASH so the full site opens in that browser.
 * Visit counter: public.record_visit() (supabase/migrations/20261012000000_site_visits.sql), counted
 * once per browser session (sessionStorage), no cookies, no personal data. Fails silently if not set up.
 * To change the password: printf %s 'new-password' | sha256sum  and paste the hash into GATE_HASH.
 * To remove the lock: set GATED_HOSTS = [].
 * Note: a client-side lock to keep the site private until launch. Data security stays in Supabase RLS.
 */
(function () {
  var GATE_HASH = '0719008ba43e17b27edf02d5c8884b86e605342b8b7c96dca58a15a0a9a6979f';
  var GATED_HOSTS = ['realtimetradersbrisbane.au', 'www.realtimetradersbrisbane.au'];
  var KEY = 'rtt_site_gate';
  var VISIT_KEY = 'rtt_visit_counted';
  var PHONE = '+61422909739';
  var EMAIL = 'realtimetraders101@gmail.com';

  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/js\/site-gate\.js(\?.*)?$/, '') : '';
  window.RTTGate = { unlock: function () { try { localStorage.setItem(KEY, GATE_HASH); } catch (e) {} } };

  var preview = /[?&]gate=preview\b/.test(location.search);
  if (GATED_HOSTS.indexOf(location.hostname.toLowerCase()) === -1 && !preview) return;
  if (/(^|\/)(admin-login|privacy|terms)\.html$/.test(location.pathname)) return;
  try { if (!preview && localStorage.getItem(KEY) === GATE_HASH) return; } catch (e) {}

  var hide = document.createElement('style');
  hide.id = 'rtt-gate-hide';
  hide.textContent = 'html,body{background:#011839 !important}body > *:not(#rtt-gate){display:none !important}';
  document.head.appendChild(hide);

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = base + src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  /* Supabase client: reuse the hire system's client if the page has one, otherwise make our own. */
  var sbPromise = null;
  function supabaseClient() {
    if (sbPromise) return sbPromise;
    sbPromise = Promise.resolve().then(function () {
      if (window.RTTHire && window.RTTHire.client) return window.RTTHire.client();
      return (window.RTT_HIRE_CONFIG ? Promise.resolve() : loadScript('js/hire-config.js')).then(function () {
        return window.supabase && window.supabase.createClient ? null : loadScript('js/vendor/supabase-js-2.117.3.min.js');
      }).then(function () {
        var c = window.RTT_HIRE_CONFIG || {};
        if (!c.supabaseUrl || !c.supabaseAnonKey) throw new Error('not_configured');
        return window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
      });
    });
    return sbPromise;
  }

  function hasStoredSession() {
    try {
      for (var i = 0; i < localStorage.length; i++) if (/^sb-.*-auth-token$/.test(localStorage.key(i))) return true;
    } catch (e) {}
    return false;
  }

  function unlock(box) {
    window.RTTGate.unlock();
    if (box) box.remove();
    var s = document.getElementById('rtt-gate-hide');
    if (s) s.remove();
    document.documentElement.style.overflow = '';
  }

  var CSS =
    '#rtt-gate{position:fixed;inset:0;z-index:2147483647;overflow-y:auto;background:#011839;background:radial-gradient(120% 80% at 50% 0%,#0a3a8a 0%,#011839 60%);color:#fff;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:flex;flex-direction:column}' +
    '#rtt-gate *{box-sizing:border-box}' +
    '#rtt-gate .g-bar{height:6px;flex:none;background:linear-gradient(90deg,#015dd9 0 33.3%,#dd0302 33.3% 66.6%,#fdd323 66.6%)}' +
    '#rtt-gate main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px 20px 24px}' +
    '#rtt-gate .g-logo{background:#fff;border-radius:24px;padding:16px;box-shadow:0 18px 40px rgba(0,0,0,.35);margin-bottom:28px}' +
    '#rtt-gate .g-logo img{display:block;width:150px;height:auto}' +
    '#rtt-gate h1{color:#fff !important;margin:0 0 14px;font-size:clamp(28px,6vw,52px);line-height:1.1;font-weight:800;letter-spacing:-.02em}' +
    '#rtt-gate .g-soon{display:inline-block;margin:0 0 16px;padding:6px 16px;border-radius:999px;background:#fdd323;color:#011839;font-weight:800;font-size:clamp(15px,2.4vw,18px);text-transform:uppercase;letter-spacing:.08em}' +
    '#rtt-gate .g-sub{margin:0 0 28px;max-width:34em;font-size:clamp(16px,2.4vw,20px);line-height:1.5;color:#e6ecf7}' +
    '#rtt-gate .g-ctas{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:22px}' +
    '#rtt-gate .g-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 24px;border-radius:10px;font-weight:700;font-size:17px;text-decoration:none;border:2px solid transparent;cursor:pointer;font-family:inherit}' +
    '#rtt-gate .g-call{background:#dd0302;color:#fff}' +
    '#rtt-gate .g-call:hover{background:#b80201}' +
    '#rtt-gate .g-mail{background:transparent;color:#fff;border-color:#fff}' +
    '#rtt-gate .g-mail:hover{background:rgba(255,255,255,.12)}' +
    '#rtt-gate a:focus-visible,#rtt-gate button:focus-visible,#rtt-gate input:focus-visible{outline:3px solid #fdd323;outline-offset:3px}' +
    '#rtt-gate .g-email{margin:0;font-size:15px;color:#e6ecf7;word-break:break-all}' +
    '#rtt-gate .g-email a{color:#fff}' +
    '#rtt-gate .g-visits{margin:18px 0 0;font-size:14px;color:#c9d4e8}' +
    '#rtt-gate footer{flex:none;text-align:center;padding:16px 20px 22px;font-size:13px;color:#c9d4e8}' +
    '#rtt-gate .g-admin-link{background:none;border:0;padding:6px 10px;color:#c9d4e8;font:inherit;text-decoration:underline;cursor:pointer;border-radius:6px}' +
    '#rtt-gate .g-admin-link:hover{color:#fff}' +
    '#rtt-gate .g-panel{width:100%;max-width:340px;margin:12px auto 0;text-align:left;background:#fff;color:#1c2433;border-radius:12px;padding:20px;box-shadow:0 18px 40px rgba(0,0,0,.35)}' +
    '#rtt-gate .g-panel h2{margin:0 0 12px;font-size:18px;color:#011839 !important}' +
    '#rtt-gate .g-panel label{display:block;font-size:14px;font-weight:600;margin-bottom:6px;color:#011839}' +
    '#rtt-gate .g-panel input{width:100%;padding:11px 12px;font-size:16px;border:1px solid #5d6675;border-radius:8px;color:#1c2433}' +
    '#rtt-gate .g-err{min-height:20px;margin:6px 0 0;font-size:14px;color:#b91c1c}' +
    '#rtt-gate .g-panel .g-btn{width:100%;margin-top:6px;background:#015dd9;color:#fff;font-size:16px}' +
    '#rtt-gate .g-panel .g-btn:hover{background:#014bb0}' +
    '#rtt-gate .g-panel p.g-alt{margin:14px 0 0;font-size:14px;color:#1c2433}' +
    '#rtt-gate .g-panel p.g-alt a{color:#015dd9;font-weight:600}' +
    '@media (max-width:480px){#rtt-gate .g-logo img{width:120px}#rtt-gate .g-ctas{flex-direction:column;width:100%;max-width:320px}#rtt-gate .g-btn{width:100%}}' +
    '@media (prefers-reduced-motion:no-preference){#rtt-gate main>*{animation:rttIn .5s ease both}}' +
    '@keyframes rttIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}';

  var PHONE_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>';
  var MAIL_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';

  function recordVisit(box) {
    var el = box.querySelector('.g-visits');
    var counted = false;
    try { counted = sessionStorage.getItem(VISIT_KEY) === '1'; } catch (e) {}
    supabaseClient().then(function (sb) {
      return counted ? sb.rpc('visit_count') : sb.rpc('record_visit', { p_path: location.pathname });
    }).then(function (r) {
      if (!r || r.error || r.data === null || r.data === undefined) return;
      if (!counted) { try { sessionStorage.setItem(VISIT_KEY, '1'); } catch (e) {} }
      var n = Number(r.data);
      if (!isFinite(n) || n < 1) return;
      el.textContent = n.toLocaleString('en-AU') + (n === 1 ? ' visit so far' : ' visits so far');
      el.hidden = false;
    }).catch(function () {});
  }

  function checkAdminSession(box) {
    if (!hasStoredSession()) return;
    supabaseClient().then(function (sb) {
      return sb.auth.getSession().then(function (r) {
        if (!r.data || !r.data.session) return;
        return sb.rpc('is_admin').then(function (res) { if (!res.error && res.data === true) unlock(box); });
      });
    }).catch(function () {});
  }

  function show() {
    if (document.getElementById('rtt-gate')) return;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    document.documentElement.style.overflow = 'hidden';

    var box = document.createElement('div');
    box.id = 'rtt-gate';
    box.innerHTML =
      '<div class="g-bar" aria-hidden="true"></div>' +
      '<main aria-labelledby="rtt-gate-title">' +
        '<div class="g-logo"><img src="' + base + 'images/logo-full.png" width="372" height="400" alt="Real Time Traders logo"></div>' +
        '<h1 id="rtt-gate-title">Real Time Traders Brisbane</h1>' +
        '<p class="g-soon">Launching soon</p>' +
        '<p class="g-sub">Buy, sell and hire, all in one place in Brisbane.</p>' +
        '<div class="g-ctas">' +
          '<a class="g-btn g-call" href="tel:' + PHONE + '">' + PHONE_SVG + 'Call now</a>' +
          '<a class="g-btn g-mail" href="mailto:' + EMAIL + '">' + MAIL_SVG + 'Email us</a>' +
        '</div>' +
        '<p class="g-email"><a href="mailto:' + EMAIL + '">' + EMAIL + '</a></p>' +
        '<p class="g-visits" aria-live="polite" hidden></p>' +
      '</main>' +
      '<footer>' +
        '<button type="button" class="g-admin-link" aria-expanded="false" aria-controls="rtt-gate-panel">Admin</button>' +
        '<form class="g-panel" id="rtt-gate-panel" hidden>' +
          '<h2>Admin access</h2>' +
          '<label for="rtt-gate-pw">Site password</label>' +
          '<input id="rtt-gate-pw" type="password" autocomplete="current-password" required>' +
          '<p class="g-err" id="rtt-gate-err" role="alert"></p>' +
          '<button type="submit" class="g-btn">Enter site</button>' +
          '<p class="g-alt">Have an admin account? <a href="' + base + 'admin-login.html">Sign in to admin</a></p>' +
        '</form>' +
      '</footer>';
    document.body.appendChild(box);

    var toggle = box.querySelector('.g-admin-link');
    var panel = box.querySelector('.g-panel');
    var input = box.querySelector('#rtt-gate-pw');
    var err = box.querySelector('#rtt-gate-err');
    toggle.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) { input.focus(); panel.scrollIntoView({ block: 'nearest' }); }
    });
    panel.addEventListener('submit', function (ev) {
      ev.preventDefault();
      sha256(input.value).then(function (h) {
        if (h === GATE_HASH) unlock(box);
        else { err.textContent = 'That password is not right. Please try again.'; input.select(); }
      });
    });

    recordVisit(box);
    checkAdminSession(box);
  }

  if (document.readyState !== 'loading') show();
  else document.addEventListener('DOMContentLoaded', show);
})();
