/* Member marketplace listings (free, no payments). Supabase table public.marketplace_listings
   (migration 20261013120000_marketplace_listings.sql), photos in the public "listing-photos" bucket.
   Hooks (any page): [data-listing-post] post form (post.html), [data-member-listings] marketplace grids,
   [data-listing-detail] detail view (marketplace.html?listing=<id>), [data-my-listings] (account.html),
   [data-admin-listings] moderation (admin.html). */
(function () {
  var H = window.RTTHire;
  if (!H || !H.config()) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = H.esc;
  var BUCKET = "listing-photos", MAX_PHOTOS = 6, MAX_BYTES = 5 * 1024 * 1024, MAX_SIDE = 1600;
  var REPORT = "realtimetraders101@gmail.com";
  var CATS = { "buy-sell": "Buy & sell", rare: "Antiques & rare finds", donated: "Donated / free" };
  var LABEL = { pending: "Awaiting approval", active: "Live", sold: "Sold", removed: "Rejected / removed" };
  var CONDS = { "new": "New", "like-new": "Like new", good: "Good", fair: "Fair", "for-parts": "For parts / repair" };
  var BAD = /\b(fuck\w*|shit\w*|cunt\w*|bitch\w*|nigg\w*|fag\w*|retard\w*|wank\w*|slut\w*|whore\w*)\b/i;
  var URLISH = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|xyz|ru|info|biz|top|click|link)\b)/i;
  var FIN = /\b(\d[ -]?){13,19}\b|\bBSB\b|\b\d{3}-\d{3}\b|\baccount number\b|\btax file\b|\bTFN\b|\bpassword\b/i;

  function photoUrl(p) { return H.config().url + "/storage/v1/object/public/" + BUCKET + "/" + String(p).split("/").map(encodeURIComponent).join("/"); }
  function price(l) { return l.price_cents == null ? "Contact seller" : (l.price_cents === 0 ? "Free" : "$" + (l.price_cents / 100).toLocaleString("en-AU", { minimumFractionDigits: l.price_cents % 100 ? 2 : 0 })); }
  function check(r) { if (r.error) throw r.error; return r.data; }
  function errText(e) {
    var m = (e && (e.message || e.error_description)) || String(e);
    if (/listing_limit_reached/.test(m)) return "You already have 10 active listings. Mark one as sold or delete it first.";
    return H.errorText(e);
  }
  function validate(f) {
    var text = [f.title, f.description, f.suburb].join(" ");
    if (BAD.test(text)) return "Please remove offensive language.";
    if (URLISH.test(text)) return "Links and web addresses aren't allowed in listings.";
    if (FIN.test(text)) return "Please don't include card, bank, tax file or password details.";
    if ((f.title || "").trim().length < 3) return "Please add a title (at least 3 characters).";
    if ((f.suburb || "").trim().length < 2) return "Please add your suburb (no street address).";
    if (/\d+\s+\w+\s+(st|street|rd|road|ave|avenue|ct|court|dr|drive|pl|place|cres|crescent|tce|terrace)\b/i.test(f.suburb)) return "Suburb only please, not your street address.";
    return null;
  }
  function resize(file) {
    return new Promise(function (resolve, reject) {
      if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type) && !/^image\//.test(file.type)) return reject(new Error("Photos must be images."));
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        var c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        c.toBlob(function (b) { if (!b) return reject(new Error("Couldn't read that photo.")); if (b.size > MAX_BYTES) return reject(new Error("Photo is too large (max 5 MB).")); resolve(b); }, "image/jpeg", 0.85);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("Couldn't read that photo. Try a JPG or PNG.")); };
      img.src = url;
    });
  }
  function uploadPhotos(sb, uid, files) {
    return Promise.all(Array.prototype.map.call(files, function (f, i) {
      return resize(f).then(function (blob) {
        var path = uid + "/" + Date.now() + "-" + i + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
        return sb.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", upsert: false }).then(function (r) { if (r.error) throw r.error; return path; });
      });
    }));
  }
  function card(l) {
    var img = l.photos && l.photos.length ? '<img src="' + esc(photoUrl(l.photos[0])) + '" alt="' + esc(l.title) + '" loading="lazy">' : '<div class="listing-noimg">' + H.icon("i-tag") + "</div>";
    return '<article class="product-card member-listing" data-listing-id="' + esc(l.id) + '">' +
      '<div class="product-card__media">' + (l.status === "sold" ? '<span class="sample-tag sold-tag">Sold</span>' : '<span class="sample-tag member-tag">Member listing</span>') + img + "</div>" +
      '<div class="product-card__body"><p class="product-card__price' + (l.price_cents === 0 ? " product-card__price--free" : "") + '">' + esc(price(l)) + "</p>" +
      '<h3 class="product-card__title"><a href="marketplace.html?listing=' + encodeURIComponent(l.id) + '">' + esc(l.title) + "</a></h3>" +
      '<p class="product-card__desc">' + esc((l.condition ? CONDS[l.condition] + ". " : "") + (l.description || "").slice(0, 80)) + "</p>" +
      '<p class="product-card__meta">' + H.icon("i-pin") + " " + esc(l.suburb) + "</p>" +
      '<div class="product-card__actions"><a class="btn btn--primary btn--sm btn--block" href="marketplace.html?listing=' + encodeURIComponent(l.id) + '">View listing</a></div></div></article>';
  }

  H.client().then(function (sb) {
    initMarket(sb);
    /* user-dependent parts wait for the auth state (getSession can race the client's start-up) */
    var done = false, signedOutShown = false;
    function go(session) {
      if (done) return;
      if (!session) { if (!signedOutShown) { signedOutShown = true; initDetail(sb, null); initPost(sb, null); } return; }
      done = true;
      if (!signedOutShown) initDetail(sb, session.user);
      else { var c = $("[data-contact]"); if (c) initDetail(sb, session.user); var si = $("[data-listing-signin]"); if (si) si.hidden = true; }
      initPost(sb, session.user); initMine(sb, session.user); initAdmin(sb, session.user);
    }
    sb.auth.onAuthStateChange(function (evt, session) { setTimeout(function () { go(session); }, 0); });
    sb.auth.getSession().then(function (r) { if (r.data && r.data.session) go(r.data.session); else setTimeout(function () { if (!done) go(null); }, 1500); });
  }).catch(function () {});

  /* ---------- marketplace grids ---------- */
  function initMarket(sb) {
    var grids = document.querySelectorAll("[data-member-listings]");
    if (!grids.length) return;
    sb.from("marketplace_listings").select("id,title,description,category,price_cents,condition,suburb,photos,status,created_at")
      .in("status", ["active", "sold"]).order("status").order("created_at", { ascending: false }).limit(200).then(check).then(function (rows) {
        grids.forEach(function (g) {
          var cat = g.getAttribute("data-member-listings");
          var list = rows.filter(function (l) { return l.category === cat; });
          g.innerHTML = list.length ? list.map(card).join("") :
            '<div class="empty-state listings-empty"><p class="empty-state__title">No listings here yet.</p><p>Got something to sell or give away? Listing is free.</p><a class="btn btn--primary btn--sm" href="post.html#listing-form">Post the first listing</a></div>';
          g.hidden = false;
        });
      }).catch(function () {});
  }

  /* ---------- detail ---------- */
  function initDetail(sb, user) {
    var box = $("[data-listing-detail]"), id = new URLSearchParams(location.search).get("listing");
    if (!box || !id) return;
    box.hidden = false; box.innerHTML = '<p class="note">Loading listing…</p>';
    box.scrollIntoView({ block: "start" });
    sb.from("marketplace_listings").select("*").eq("id", id).maybeSingle().then(check).then(function (l) {
      if (!l) { box.innerHTML = '<p class="empty-state__title">This listing isn\u2019t available.</p><p><a href="marketplace.html">Back to the marketplace</a></p>'; return; }
      var photos = (l.photos || []).map(function (p) { return '<img src="' + esc(photoUrl(p)) + '" alt="' + esc(l.title) + '" loading="lazy">'; }).join("");
      var report = "mailto:" + REPORT + "?subject=" + encodeURIComponent("Report listing: " + l.title + " (" + l.id + ")") + "&body=" + encodeURIComponent("Listing: " + location.href + "\nReason: ");
      box.innerHTML = '<div class="listing-detail">' +
        '<p class="breadcrumb-mini"><a href="marketplace.html">Marketplace</a> › ' + esc(CATS[l.category] || "") + "</p>" +
        (photos ? '<div class="listing-photos">' + photos + "</div>" : "") +
        "<div><h2>" + esc(l.title) + (l.status === "sold" ? ' <span class="sold-tag">Sold</span>' : "") + "</h2>" +
        '<p class="product-card__price' + (l.price_cents === 0 ? " product-card__price--free" : "") + '">' + esc(price(l)) + "</p>" +
        '<p class="listing-meta">' + H.icon("i-pin") + " " + esc(l.suburb) + (l.condition ? " · " + esc(CONDS[l.condition]) : "") + " · Listed " + esc(new Date(l.created_at).toLocaleDateString("en-AU")) + "</p>" +
        '<p class="listing-desc">' + esc(l.description || "").replace(/\n/g, "<br>") + "</p>" +
        '<div class="listing-contact" data-contact></div>' +
        '<p class="note">Private sale between members. Real Time Traders isn\u2019t a party to the sale. Meet in a public place and never send money or bank details before you see the item. <a href="' + esc(report) + '">Report listing</a></p></div></div>';
      var c = $("[data-contact]", box);
      if (l.status !== "active") { c.innerHTML = "<p><strong>This item has been sold.</strong></p>"; return; }
      if (!user) { c.innerHTML = '<p><strong>Sign in to see the seller\u2019s contact details.</strong></p><p><button type="button" class="btn btn--primary btn--sm" data-open-login>Log in / Join free</button></p>';
        $("[data-open-login]", c).addEventListener("click", function () { var b = document.querySelector('[data-auth="login"]'); if (b) b.click(); }); return; }
      sb.from("marketplace_listing_contacts").select("phone,email").eq("listing_id", l.id).maybeSingle().then(check).then(function (k) {
        var out = [];
        if (k && k.phone && l.contact_pref !== "email") out.push('<a class="btn btn--primary btn--sm" href="tel:' + esc(k.phone.replace(/[^\d+]/g, "")) + '">' + H.icon("i-phone") + " " + esc(k.phone) + "</a>");
        if (k && k.email && l.contact_pref !== "phone") out.push('<a class="btn btn--outline btn--sm" href="mailto:' + esc(k.email) + "?subject=" + encodeURIComponent("Your listing: " + l.title) + '">' + H.icon("i-mail") + " " + esc(k.email) + "</a>");
        c.innerHTML = "<p><strong>Contact the seller</strong></p><p class=\"listing-contact__btns\">" + (out.join(" ") || "No contact details given.") + "</p>";
      }).catch(function (e) { c.textContent = errText(e); });
    }).catch(function (e) { box.textContent = errText(e); });
  }

  /* ---------- post / edit form ---------- */
  function initPost(sb, user) {
    var wrap = $("[data-listing-post]");
    if (!wrap) return;
    var signin = $("[data-listing-signin]"), form = $("[data-listing-form]"), st = $("[data-listing-status]");
    if (!user) { signin.hidden = false; return; }
    form.hidden = false;
    var editId = new URLSearchParams(location.search).get("edit"), existing = [];
    if (form.elements.email && !form.elements.email.value) form.elements.email.value = user.email || "";
    if (editId) {
      $("[data-listing-form-title]").textContent = "Edit your listing";
      Promise.all([sb.from("marketplace_listings").select("*").eq("id", editId).eq("owner", user.id).maybeSingle().then(check),
        sb.from("marketplace_listing_contacts").select("*").eq("listing_id", editId).maybeSingle().then(check)]).then(function (r) {
        var l = r[0], k = r[1] || {}; if (!l) return;
        var e = form.elements; e.title.value = l.title; e.description.value = l.description; e.category.value = l.category;
        e.price.value = l.price_cents == null ? "" : (l.price_cents / 100); e.condition.value = l.condition || ""; e.suburb.value = l.suburb;
        e.contact_pref.value = l.contact_pref; e.phone.value = k.phone || ""; e.email.value = k.email || "";
        existing = l.photos || [];
        $("[data-existing-photos]").textContent = existing.length ? existing.length + " photo(s) kept. Adding new photos replaces them." : "";
      });
    }
    form.elements.category.addEventListener("change", function () { if (form.elements.category.value === "donated") form.elements.price.value = "0"; });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var e = form.elements, files = e.photos.files;
      var f = { title: e.title.value.trim(), description: e.description.value.trim(), suburb: e.suburb.value.trim() };
      var bad = validate(f);
      if (!bad && files.length > MAX_PHOTOS) bad = "Up to " + MAX_PHOTOS + " photos.";
      if (!bad && !e.agree.checked) bad = "Please confirm the item is yours to sell and allowed.";
      var pref = e.contact_pref.value, phone = e.phone.value.trim(), email = e.email.value.trim();
      if (!bad && pref !== "email" && !/^[\d +()-]{8,20}$/.test(phone)) bad = "Please add a valid phone number, or choose email contact.";
      if (!bad && pref !== "phone" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) bad = "Please add a valid email address.";
      var pr = e.price.value.trim();
      if (!bad && pr !== "" && !(Number(pr) >= 0)) bad = "Price must be 0 (free) or more.";
      if (bad) { st.className = "form-status is-error"; st.textContent = bad; return; }
      st.className = "form-status"; st.textContent = files.length ? "Uploading photos…" : "Saving…";
      var btn = form.querySelector('[type="submit"]'); btn.disabled = true;
      (files.length ? uploadPhotos(sb, user.id, files) : Promise.resolve(existing)).then(function (paths) {
        var row = { title: f.title, description: f.description, category: e.category.value, price_cents: pr === "" ? null : Math.round(Number(pr) * 100),
          condition: e.condition.value || null, suburb: f.suburb, contact_pref: pref, photos: paths };
        var q = editId ? sb.from("marketplace_listings").update(row).eq("id", editId).select().single()
                       : sb.from("marketplace_listings").insert(Object.assign({ owner: user.id, status: "pending" }, row)).select().single();
        return q.then(check).then(function (l) {
          var old = editId && files.length ? existing : [];
          if (old.length) sb.storage.from(BUCKET).remove(old);
          return sb.from("marketplace_listing_contacts").upsert({ listing_id: l.id, phone: pref === "email" ? null : phone, email: pref === "phone" ? null : email }).then(check).then(function () { return l; });
        });
      }).then(function (l) {
        st.className = "form-status is-success";
        st.innerHTML = (editId ? "Changes saved. Your listing" : "Thanks! Your listing") + " will appear in the marketplace once we\u2019ve approved it (usually within a day). Track it in <a href=\"account.html#my-listings\">My listings</a>.";
        if (!editId) form.reset();
      }).catch(function (err) { st.className = "form-status is-error"; st.textContent = errText(err); })
        .then(function () { btn.disabled = false; });
    });
  }

  /* ---------- account: my listings ---------- */
  function initMine(sb, user) {
    var box = $("[data-my-listings]");
    if (!box || !user) return;
    box.closest("[data-my-listings-card]").hidden = false;
    function load() {
      sb.from("marketplace_listings").select("id,title,status,price_cents,photos,created_at,removed_reason").eq("owner", user.id).order("created_at", { ascending: false }).then(check).then(function (rows) {
        if (!rows.length) { box.innerHTML = '<p>No listings yet.</p><a class="btn btn--primary btn--sm" href="post.html#listing-form">Post a listing</a>'; return; }
        box.innerHTML = '<ul class="my-listings">' + rows.map(function (l) {
          return '<li data-id="' + esc(l.id) + '"><div><a href="marketplace.html?listing=' + encodeURIComponent(l.id) + '"><strong>' + esc(l.title) + "</strong></a> · " + esc(price(l)) +
            ' <span class="status-pill status-pill--' + esc(l.status) + '">' + esc(LABEL[l.status] || l.status) + "</span>" + (l.status === "removed" && l.removed_reason ? "<br><small>Reason: " + esc(l.removed_reason) + "</small>" : "") + "</div><div class=\"my-listings__btns\">" +
            (l.status !== "removed" ? '<a class="btn btn--light btn--sm" href="post.html?edit=' + encodeURIComponent(l.id) + '#listing-form">Edit</a>' : "") +
            (l.status === "active" ? '<button type="button" class="btn btn--light btn--sm" data-act="sold">Mark sold</button>' : "") +
            (l.status === "sold" ? '<button type="button" class="btn btn--light btn--sm" data-act="active">Relist</button>' : "") +
            '<button type="button" class="btn btn--light btn--sm" data-act="delete">Delete</button></div></li>';
        }).join("") + '</ul><p><a class="btn btn--primary btn--sm" href="post.html#listing-form">Post another</a></p>';
        box._rows = rows;
      }).catch(function (e) { box.textContent = errText(e); });
    }
    box.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-act]"); if (!b) return;
      var id = b.closest("li").getAttribute("data-id"), act = b.getAttribute("data-act");
      var row = (box._rows || []).filter(function (r) { return r.id === id; })[0] || {};
      var p = act === "delete"
        ? (confirm("Delete this listing? This can't be undone.") ? sb.from("marketplace_listings").delete().eq("id", id).then(check).then(function () { if (row.photos && row.photos.length) sb.storage.from(BUCKET).remove(row.photos); }) : null)
        : sb.from("marketplace_listings").update({ status: act }).eq("id", id).then(check);
      if (p) p.then(load).catch(function (e) { alert(errText(e)); });
    });
    load();
  }

  /* ---------- admin moderation ---------- */
  function initAdmin(sb, user) {
    var box = $("[data-admin-listings]"), queue = $("[data-admin-queue]");
    if (!box || !user) return;
    function row(l, btns) {
      var thumb = l.photos && l.photos.length ? '<img class="adm-thumb" src="' + esc(photoUrl(l.photos[0])) + '" alt="">' : "";
      return '<li data-id="' + esc(l.id) + '"><div>' + thumb + '<a href="marketplace.html?listing=' + encodeURIComponent(l.id) + '"><strong>' + esc(l.title) + "</strong></a> · " + esc(price(l)) + " · " + esc(l.suburb) +
        ' <span class="status-pill status-pill--' + esc(l.status) + '">' + esc(LABEL[l.status] || l.status) + "</span><br><small>" + esc(CATS[l.category] || "") + " · " + esc(new Date(l.updated_at).toLocaleString("en-AU")) + " · owner " + esc(l.owner.slice(0, 8)) + (l.removed_reason ? " · " + esc(l.removed_reason) : "") + "</small>" +
        (l.description ? '<p class="adm-desc">' + esc(l.description.slice(0, 300)) + "</p>" : "") + '</div><div class="my-listings__btns">' + btns + "</div></li>";
    }
    function load() {
      sb.from("marketplace_listings").select("*").order("updated_at", { ascending: false }).limit(300).then(check).then(function (rows) {
        var pend = rows.filter(function (l) { return l.status === "pending"; }), rest = rows.filter(function (l) { return l.status !== "pending"; });
        var tab = $("#tab-a-listings"); if (tab) tab.textContent = "Member listings" + (pend.length ? " (" + pend.length + " to approve)" : "");
        queue.innerHTML = pend.length ? '<ul class="my-listings">' + pend.map(function (l) { return row(l, '<button type="button" class="btn btn--primary btn--sm" data-act="approve">Approve</button><button type="button" class="btn btn--light btn--sm" data-act="reject">Reject</button>'); }).join("") + "</ul>" : "<p>Nothing waiting for approval.</p>";
        box.innerHTML = rest.length ? '<ul class="my-listings">' + rest.map(function (l) { return row(l, l.status === "removed" ? '<button type="button" class="btn btn--light btn--sm" data-act="approve">Restore</button>' : '<button type="button" class="btn btn--light btn--sm" data-act="reject">Remove</button>'); }).join("") + "</ul>" : "<p>No other member listings.</p>";
      }).catch(function (e) { box.textContent = errText(e); });
    }
    function act(ev) {
      var b = ev.target.closest("[data-act]"); if (!b) return;
      var id = b.closest("li").getAttribute("data-id"), upd;
      if (b.getAttribute("data-act") === "approve") upd = { status: "active", removed_reason: null };
      else { var why = prompt("Reason (shown to the member):", "Doesn\u2019t meet our listing rules"); if (why === null) return; upd = { status: "removed", removed_reason: why || "Doesn\u2019t meet our listing rules" }; }
      sb.from("marketplace_listings").update(upd).eq("id", id).then(check).then(load).catch(function (e) { alert(errText(e)); });
    }
    box.addEventListener("click", act); queue.addEventListener("click", act);
    load();
  }
})();
