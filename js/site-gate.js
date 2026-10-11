/*
 * Real Time Traders: temporary shared-password gate.
 * Only runs on the custom domain (realtimetradersbrisbane.au); the github.io address is left open.
 * Add ?gate=preview to any URL to see the gate on other hosts for testing.
 * To change the password: printf %s 'new-password' | sha256sum  and paste the hash into GATE_HASH.
 * To remove the gate: delete this file and the <script src="js/site-gate.js"> line in each page's <head>.
 * Note: this is a light, client-side lock to keep the site private until hand-over. It is not real security.
 */
(function () {
  var GATE_HASH = '0719008ba43e17b27edf02d5c8884b86e605342b8b7c96dca58a15a0a9a6979f';
  var GATED_HOSTS = ['realtimetradersbrisbane.au', 'www.realtimetradersbrisbane.au'];
  var KEY = 'rtt_site_gate';
  var preview = /[?&]gate=preview\b/.test(location.search);
  if (GATED_HOSTS.indexOf(location.hostname.toLowerCase()) === -1 && !preview) return;
  try { if (!preview && localStorage.getItem(KEY) === GATE_HASH) return; } catch (e) {}

  var hide = document.createElement('style');
  hide.id = 'rtt-gate-hide';
  hide.textContent = 'body > *:not(#rtt-gate){display:none !important}';
  document.head.appendChild(hide);

  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  function show() {
    var box = document.createElement('div');
    box.id = 'rtt-gate';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'rtt-gate-title');
    box.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:#0f172a;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
    box.innerHTML =
      '<form style="width:100%;max-width:360px;background:#fff;border-radius:14px;padding:28px;box-shadow:0 20px 50px rgba(0,0,0,.35)">' +
      '<h1 id="rtt-gate-title" style="margin:0 0 6px;font-size:22px;color:#0f172a">Real Time Traders</h1>' +
      '<p style="margin:0 0 18px;color:#475569;font-size:15px;line-height:1.45">This site is private while it is being finished. Enter the password to continue.</p>' +
      '<label for="rtt-gate-pw" style="display:block;font-size:14px;font-weight:600;color:#0f172a;margin-bottom:6px">Password</label>' +
      '<input id="rtt-gate-pw" type="password" autocomplete="current-password" required style="width:100%;box-sizing:border-box;padding:12px;font-size:16px;border:1px solid #cbd5e1;border-radius:8px">' +
      '<p id="rtt-gate-err" role="alert" style="min-height:20px;margin:8px 0 0;color:#b91c1c;font-size:14px"></p>' +
      '<button type="submit" style="width:100%;margin-top:8px;padding:12px;font-size:16px;font-weight:600;color:#fff;background:#f97316;border:0;border-radius:8px;cursor:pointer">Enter site</button>' +
      '</form>';
    document.body.appendChild(box);
    var input = box.querySelector('input');
    var err = box.querySelector('#rtt-gate-err');
    input.focus();
    box.querySelector('form').addEventListener('submit', function (ev) {
      ev.preventDefault();
      sha256(input.value).then(function (h) {
        if (h === GATE_HASH) {
          try { localStorage.setItem(KEY, GATE_HASH); } catch (e) {}
          box.remove();
          var s = document.getElementById('rtt-gate-hide');
          if (s) s.remove();
        } else {
          err.textContent = 'That password is not right. Please try again.';
          input.select();
        }
      });
    });
  }

  if (document.body) show();
  else document.addEventListener('DOMContentLoaded', show);
})();
