/* account.html: profile photo + display name (public_profiles, avatars bucket) and listing messages inbox/thread.
   Tables/RPCs: supabase/migrations/20261013210000_profiles_messaging.sql. Polls every 10 s while open. */
(function () {
  var H = window.RTTHire;
  if (!H || !H.config()) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = H.esc, REPORT = "realtimetraders101@gmail.com";
  var FIN = /\b(\d[ -]?){13,19}\b|\bBSB\b|\baccount number\b|\btax file\b|\bTFN\b|\bpassword\b|\bpin\b/i;
  var BAD = /\b(fuck\w*|cunt\w*|nigg\w*|fag\w*|retard\w*|slut\w*|whore\w*)\b/i;
  var URLISH = /(https?:\/\/|www\.)/i;
  function avatarUrl(p) { return p ? H.config().url + "/storage/v1/object/public/avatars/" + String(p).split("/").map(encodeURIComponent).join("/") : ""; }
  function listingPhoto(p) { return p ? H.config().url + "/storage/v1/object/public/listing-photos/" + String(p).split("/").map(encodeURIComponent).join("/") : ""; }
  function avatar(name, path, size) {
    size = size || 40;
    return path ? '<img class="avatar" src="' + esc(avatarUrl(path)) + '" alt="" width="' + size + '" height="' + size + '" style="width:' + size + "px;height:" + size + 'px">'
      : '<span class="avatar avatar--initial" style="width:' + size + "px;height:" + size + 'px">' + esc(String(name || "M").charAt(0).toUpperCase()) + "</span>";
  }
  window.RTTAvatar = avatar;
  function check(r) { if (r.error) throw r.error; return r.data; }
  function err(e) {
    var m = (e && e.message) || String(e);
    if (/message_rate_limited/.test(m)) return "You've sent a lot of messages in the last hour. Please wait a bit.";
    return H.errorText(e);
  }
  function squareJpeg(file) {
    return new Promise(function (resolve, reject) {
      if (!/^image\//.test(file.type)) return reject(new Error("Please choose an image."));
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(img.width, img.height), c = document.createElement("canvas"); c.width = c.height = 400;
        c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 400, 400); URL.revokeObjectURL(u);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error("Couldn't read that image.")); }, "image/jpeg", 0.88);
      };
      img.onerror = function () { URL.revokeObjectURL(u); reject(new Error("Couldn't read that image. Try a JPG or PNG.")); };
      img.src = u;
    });
  }

  var started = false;
  H.client().then(function (sb) {
    function go(session) { if (started || !session) return; started = true; initProfile(sb, session.user); initInbox(sb, session.user); }
    sb.auth.onAuthStateChange(function (e, s) { setTimeout(function () { go(s); }, 0); });
    sb.auth.getSession().then(function (r) { go(r.data && r.data.session); });
  }).catch(function () {});

  /* ---------- profile photo + display name ---------- */
  function initProfile(sb, user) {
    var card = $("[data-public-profile]"); if (!card) return;
    card.hidden = false;
    var form = $("form", card), st = $(".form-status", card), prev = $("[data-avatar-preview]", card), cur = null;
    function show(p) { cur = p; prev.innerHTML = avatar(p && p.display_name, p && p.avatar_path, 72); form.elements.display_name.value = (p && p.display_name) || ""; $("[data-avatar-remove]", card).hidden = !(p && p.avatar_path); }
    sb.from("public_profiles").select("*").eq("id", user.id).maybeSingle().then(check).then(function (p) {
      if (p) return show(p);
      return sb.from("public_profiles").insert({ id: user.id, display_name: "Member" }).select().single().then(check).then(show);
    }).catch(function (e) { st.textContent = err(e); });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = form.elements.display_name.value.trim(), file = form.elements.avatar.files[0];
      if (name.length < 1 || name.length > 40) { st.className = "form-status is-error"; st.textContent = "Display name: 1 to 40 characters."; return; }
      if (BAD.test(name) || URLISH.test(name)) { st.className = "form-status is-error"; st.textContent = "Please choose a different display name."; return; }
      st.className = "form-status"; st.textContent = "Saving…";
      var up = file ? squareJpeg(file).then(function (blob) {
        var path = user.id + "/avatar-" + Date.now() + ".jpg";
        return sb.storage.from("avatars").upload(path, blob, { contentType: "image/jpeg" }).then(function (r) { if (r.error) throw r.error; return path; });
      }) : Promise.resolve(cur && cur.avatar_path);
      up.then(function (path) {
        var old = cur && cur.avatar_path;
        return sb.from("public_profiles").update({ display_name: name, avatar_path: path || null }).eq("id", user.id).select().single().then(check).then(function (p) {
          if (old && old !== path) sb.storage.from("avatars").remove([old]);
          show(p); form.elements.avatar.value = ""; st.className = "form-status is-success"; st.textContent = "Saved. Your name and photo show on your listings and messages.";
        });
      }).catch(function (e) { st.className = "form-status is-error"; st.textContent = err(e); });
    });
    $("[data-avatar-remove]", card).addEventListener("click", function () {
      var old = cur && cur.avatar_path; if (!old) return;
      sb.from("public_profiles").update({ avatar_path: null }).eq("id", user.id).select().single().then(check).then(function (p) { sb.storage.from("avatars").remove([old]); show(p); })
        .catch(function (e) { st.textContent = err(e); });
    });
  }

  /* ---------- inbox + thread ---------- */
  function initInbox(sb, user) {
    var card = $("[data-messages-card]"); if (!card) return;
    card.hidden = false;
    var list = $("[data-inbox]", card), thread = $("[data-thread]", card), timer = null, openId = new URLSearchParams(location.search).get("c"), convs = [];
    function badge(n) { var b = document.querySelector("[data-unread-badge]"); if (b) { b.textContent = n ? n + " unread" : ""; b.hidden = !n; } }
    function loadInbox() {
      return sb.rpc("my_conversations").then(check).then(function (rows) {
        convs = rows; var total = 0;
        list.innerHTML = rows.length ? '<ul class="inbox">' + rows.map(function (c) {
          total += c.unread;
          var ph = c.listing_photo ? '<img class="inbox__thumb" src="' + esc(listingPhoto(c.listing_photo)) + '" alt="">' : "";
          return '<li><button type="button" class="inbox__row' + (c.id === openId ? " is-open" : "") + '" data-conv="' + esc(c.id) + '">' + avatar(c.other_name, c.other_avatar, 36) +
            '<span class="inbox__main"><strong>' + esc(c.other_name) + "</strong> · " + esc(c.listing_title) + (c.i_am_seller ? " (your listing)" : "") +
            "<br><small>" + esc(c.last_body || "No messages yet") + "</small></span>" + ph + (c.unread ? '<span class="unread-dot">' + c.unread + "</span>" : "") + "</button></li>";
        }).join("") + "</ul>" : "<p>No messages yet. Use <strong>Message seller</strong> on a listing to start a conversation.</p>";
        badge(total);
      }).catch(function (e) { list.textContent = err(e); });
    }
    function loadThread() {
      if (!openId) { thread.hidden = true; return Promise.resolve(); }
      var c = convs.filter(function (x) { return x.id === openId; })[0];
      return sb.from("messages").select("id,sender,body,created_at,read_at").eq("conversation_id", openId).order("created_at").limit(500).then(check).then(function (msgs) {
        thread.hidden = false;
        var head = c ? '<div class="thread__head">' + avatar(c.other_name, c.other_avatar, 40) + "<div><strong>" + esc(c.other_name) + '</strong><br><a href="marketplace.html?listing=' + encodeURIComponent(c.listing_id) + '">' + esc(c.listing_title) + "</a></div></div>" : "";
        var body = msgs.map(function (m) {
          var mine = m.sender === user.id;
          return '<div class="msg ' + (mine ? "msg--mine" : "msg--theirs") + '"><p>' + esc(m.body).replace(/\n/g, "<br>") + "</p><small>" + esc(new Date(m.created_at).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" })) + (mine && m.read_at ? " · Seen" : "") + "</small></div>";
        }).join("") || '<p class="note">Say hello and ask about the item.</p>';
        var report = "mailto:" + REPORT + "?subject=" + encodeURIComponent("Report conversation " + openId) + "&body=" + encodeURIComponent("Conversation: " + openId + "\nListing: " + (c ? c.listing_title : "") + "\nWhat happened: ");
        var cnt = thread.querySelector(".thread__msgs"), atBottom = !cnt || cnt.scrollTop + cnt.clientHeight >= cnt.scrollHeight - 20;
        if (cnt && thread.getAttribute("data-open") === openId) {   // poll refresh: keep the composer (and focus) as is
          cnt.innerHTML = body; if (atBottom) cnt.scrollTop = cnt.scrollHeight;
        } else {
        thread.setAttribute("data-open", openId);
        thread.innerHTML = head + '<div class="thread__msgs">' + body + "</div>" +
          '<form class="thread__form" data-send novalidate><label class="sr-only" for="msg-body">Message</label><textarea id="msg-body" name="body" rows="2" maxlength="1000" placeholder="Write a message…"></textarea>' +
          '<button type="submit" class="btn btn--primary btn--sm">Send</button></form><p class="form-status" role="status" aria-live="polite" data-send-status></p>' +
          '<p class="note">Never share bank, card or password details. Meet in a public place. <a href="' + esc(report) + '">Report conversation</a></p>';
        var nc = thread.querySelector(".thread__msgs"); nc.scrollTop = nc.scrollHeight;
        }
        if (msgs.some(function (m) { return m.sender !== user.id && !m.read_at; })) sb.rpc("mark_conversation_read", { p_conversation: openId }).then(loadInbox);
      }).catch(function (e) { thread.hidden = false; thread.textContent = err(e); });
    }
    list.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-conv]"); if (!b) return;
      openId = b.getAttribute("data-conv"); history.replaceState(null, "", "account.html?c=" + encodeURIComponent(openId) + "#messages");
      loadInbox().then(function () { thread.innerHTML = ""; thread.removeAttribute("data-open"); return loadThread(); }).then(function () { thread.scrollIntoView({ block: "nearest" }); });
    });
    thread.addEventListener("submit", function (ev) {
      if (!ev.target.matches("[data-send]")) return;
      ev.preventDefault();
      var ta = ev.target.elements.body, txt = ta.value.trim(), st = thread.querySelector("[data-send-status]");
      if (!txt) return;
      if (FIN.test(txt)) { st.className = "form-status is-error"; st.textContent = "For your safety, don't send card, bank, tax file, PIN or password details."; return; }
      if (BAD.test(txt)) { st.className = "form-status is-error"; st.textContent = "Please keep messages respectful."; return; }
      if (URLISH.test(txt)) { st.className = "form-status is-error"; st.textContent = "Links aren't allowed in messages."; return; }
      var btn = ev.target.querySelector("button"); btn.disabled = true;
      sb.from("messages").insert({ conversation_id: openId, sender: user.id, body: txt }).then(check).then(function () { ta.value = ""; return loadInbox().then(loadThread); })
        .catch(function (e) { st.className = "form-status is-error"; st.textContent = err(e); }).then(function () { btn.disabled = false; });
    });
    loadInbox().then(loadThread).then(function () { if (location.hash === "#messages") card.scrollIntoView({ block: "start" }); });
    timer = setInterval(function () { if (!document.hidden) loadInbox().then(loadThread); }, 10000);
  }
})();
