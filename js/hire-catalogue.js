/* hire.html: the hire range.
   Static catalogue from data/hire-items.json (edit that file or run scripts/build-hire-data.py; see docs/hire-catalogue.md),
   with search, category filters and a Light / Heavy toggle.
   If Supabase is configured (js/hire-config.js), published live equipment is merged in first: a live item replaces a
   static item with the same name, and links to its booking page. */
(function () {
  "use strict";
  var H = window.RTTHire || {};
  var EMAIL = "itsreallymejohnnyc@gmail.com";
  function mailto(name) { return "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Hire enquiry: " + name); }
  var results = document.querySelector("[data-hire-results]");
  var status = document.querySelector("[data-hire-status]");
  var filterBar = document.querySelector("[data-hire-filters]");
  var search = document.querySelector("[data-hire-search]");
  var weightBtns = Array.prototype.slice.call(document.querySelectorAll("[data-weight]"));
  if (!results) return;

  var HASH_TO_FILTER = { tool: "all", hire: "all", cleaning: "cleaning", gardening: "gardening", "power-tools": "drilling",
    general: "access", plant: "compaction", trailer: "trailers", trailers: "trailers" };
  var DB_TO_FILTER = { cleaning: "cleaning", gardening: "gardening", "power-tools": "drilling", general: "access", plant: "compaction", trailers: "trailers" };

  var state = { filter: "all", weight: "all", q: "" };
  var FILTERS = [], ITEMS = [];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function icon(name) { return '<svg class="icon" aria-hidden="true"><use href="#' + esc(name) + '"/></svg>'; }
  function money(v) { v = Number(v); return "$" + (v % 1 ? v.toFixed(2) : String(v)); }
  function filterOf(slug) { for (var i = 0; i < FILTERS.length; i++) if (FILTERS[i].slug === slug) return FILTERS[i]; return null; }

  function rateHtml(it) {
    if (it.rates && it.rates.day != null) {
      var extra = [];
      if (it.rates.weekend != null) extra.push("<li>Weekend <strong>" + money(it.rates.weekend) + "</strong></li>");
      if (it.rates.week != null) extra.push("<li>Week <strong>" + money(it.rates.week) + "</strong></li>");
      return '<p class="equip-price">From <strong>' + money(it.rates.day) + "</strong>/day</p>" +
        (extra.length ? '<ul class="rate-list" aria-label="Other rates">' + extra.join("") + "</ul>" : "");
    }
    if (it.flat != null) return '<p class="equip-price"><strong>' + money(it.flat) + "</strong> per hire <span>(flat rate)</span></p>";
    return '<p class="equip-price equip-price--por"><strong>Price on request</strong></p>';
  }

  /* Photos: 4:3 WebP with a 400w and an 800w variant. Only the first few cards (above the fold) load eagerly. */
  var SIZES = "(max-width: 379px) 92vw, (max-width: 559px) 46vw, 320px";
  var eagerLeft = 0;
  function photoImg(p, name) {
    var eager = eagerLeft > 0; eagerLeft--;
    return '<img src="' + esc(p.src) + '"' + (p.srcset ? ' srcset="' + esc(p.srcset) + '" sizes="' + SIZES + '"' : "") +
      ' alt="' + esc(p.alt || name) + '" width="' + (p.width || 640) + '" height="' + (p.height || 480) + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }

  function card(it) {
    var f = filterOf(it.filter) || { icon: "i-tools" };
    var media = it.photo ? photoImg(it.photo, it.name) : icon(it.icon || f.icon);
    var href = it.href || "hire-item.html?item=" + encodeURIComponent(it.id);
    var title = '<a href="' + esc(href) + '">' + esc(it.name) + "</a>";
    var tags = '<span class="tag-weight tag-weight--' + esc(it.weight) + '">' + (it.weight === "heavy" ? "Heavy" : "Light") + "</span>" +
      (it.owner_item ? '<span class="tag-owner">' + icon("i-star") + " Our own kit</span>" : "");
    var book = '<a class="btn btn--outline btn--sm btn--block" href="' + esc(href) + '">View details<span class="sr-only"> for ' + esc(it.name) + "</span></a>";
    return '<article class="equip-card' + (it.pinned ? " equip-card--pinned" : "") + (it.photo ? "" : " equip-card--icon") + '">' +
      '<div class="equip-card__media">' + media + "</div>" +
      '<div class="equip-card__body">' +
        '<div class="equip-card__tags">' + tags + "</div>" +
        "<h4>" + title + "</h4>" +
        (it.summary ? "<p>" + esc(it.summary) + "</p>" : "") +
        rateHtml(it) +
        '<p class="equip-avail">Call or email to check availability</p>' +
        '<div class="equip-card__ctas"><a class="btn btn--primary btn--sm btn--block" href="' + esc(mailto(it.name)) + '">' + icon("i-mail") + " Enquire<span class=\"sr-only\"> about " + esc(it.name) + " by email</span></a>" + book + "</div>" +
      "</div></article>";
  }

  function matches(it) {
    if (state.filter !== "all" && it.filter !== state.filter) return false;
    if (state.weight !== "all" && it.weight !== state.weight) return false;
    if (state.q) {
      var hay = (it.name + " " + (it.type || "") + " " + (it.category || "") + " " + ((filterOf(it.filter) || {}).name || "")).toLowerCase();
      var words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < words.length; i++) {
        var w = words[i].replace(/(es|s)$/, "");
        if (hay.indexOf(w) < 0) return false;
      }
    }
    return true;
  }

  function group(list, heading, id) {
    var light = list.filter(function (i) { return i.weight !== "heavy"; });
    var heavy = list.filter(function (i) { return i.weight === "heavy"; });
    var out = '<section class="hire-group" aria-labelledby="' + id + '"><h2 id="' + id + '" class="hire-group__title">' + heading + ' <span class="hire-group__count">' + list.length + "</span></h2>";
    [["Light tools", light, "light"], ["Heavy tools", heavy, "heavy"]].forEach(function (g) {
      if (!g[1].length) return;
      out += '<h3 class="hire-sub">' + g[0] + '</h3><div class="equip-grid">' + g[1].map(card).join("") + "</div>";
    });
    return out + "</section>";
  }

  function render(announce) {
    var list = ITEMS.filter(matches);
    eagerLeft = 3;
    var html = "";
    var pinned = list.filter(function (i) { return i.pinned; });
    var rest = list;
    if (state.filter === "all" && pinned.length) {
      html += '<section class="hire-group hire-group--pinned" aria-labelledby="hg-pinned"><h2 id="hg-pinned" class="hire-group__title">' + icon("i-star") + ' Our own gear</h2><h3 class="hire-sub">Light tools</h3><div class="equip-grid">' + pinned.map(card).join("") + "</div></section>";
      rest = list.filter(function (i) { return !i.pinned; });
    }
    FILTERS.forEach(function (f) {
      var inF = rest.filter(function (i) { return i.filter === f.slug; });
      inF.sort(function (a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); });
      if (inF.length) html += group(inF, esc(f.name), "hg-" + f.slug);
    });
    if (!list.length) {
      html = '<div class="empty-state"><p class="empty-state__title">No matching equipment in our list.</p><p>We may still be able to help: call or email us and ask, or clear the search and filters.</p>' +
        '<div class="empty-state__ctas"><a href="mailto:' + EMAIL + '?subject=' + encodeURIComponent("Hire enquiry") + '" class="btn btn--primary btn--sm">Email us</a> <button type="button" class="btn btn--outline btn--sm" data-hire-clear>Clear search &amp; filters</button></div></div>';
    }
    results.innerHTML = html;
    var clr = results.querySelector("[data-hire-clear]");
    if (clr) clr.addEventListener("click", function () { state = { filter: "all", weight: "all", q: "" }; if (search) search.value = ""; sync(); render(true); });
    if (status && announce) status.textContent = "Showing " + list.length + " item" + (list.length === 1 ? "" : "s") + (state.filter !== "all" ? " in " + (filterOf(state.filter) || {}).name : "") + (state.weight !== "all" ? " (" + state.weight + " tools)" : "") + (state.q ? ' matching "' + state.q + '"' : "") + ".";
  }

  function sync() {
    Array.prototype.forEach.call(filterBar.querySelectorAll(".filter-chip"), function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-filter") === state.filter)); });
    weightBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-weight") === state.weight)); });
  }

  function counts() {
    var c = { all: ITEMS.length };
    ITEMS.forEach(function (i) { c[i.filter] = (c[i.filter] || 0) + 1; });
    Object.keys(c).forEach(function (k) { var el = filterBar.querySelector('[data-count="' + k + '"]'); if (el) el.textContent = String(c[k]); });
  }

  function buildFilters() {
    FILTERS.forEach(function (f) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "filter-chip"; b.setAttribute("aria-pressed", "false"); b.setAttribute("data-filter", f.slug);
      b.innerHTML = icon(f.icon) + " " + esc(f.name) + '<span class="filter-chip__count" data-count="' + esc(f.slug) + '"></span>';
      filterBar.appendChild(b);
    });
    filterBar.addEventListener("click", function (e) {
      var chip = e.target.closest(".filter-chip"); if (!chip) return;
      state.filter = chip.getAttribute("data-filter"); sync(); render(true);
      if (history.replaceState) history.replaceState(null, "", state.filter === "all" ? location.pathname + location.search : "#" + state.filter);
    });
  }
  weightBtns.forEach(function (b) { b.addEventListener("click", function () { state.weight = b.getAttribute("data-weight"); sync(); render(true); }); });
  var t;
  if (search) search.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { state.q = search.value.trim(); render(true); }, 150); });

  function fromHash() {
    var h = location.hash.replace(/^#/, "");
    var f = HASH_TO_FILTER[h] || (filterOf(h) ? h : null);
    if (f) { state.filter = f; sync(); render(false); }
  }

  /* ---------- live equipment from Supabase (optional) ---------- */
  function mergeLive() {
    if (!H.config || !H.config()) return;
    H.client().then(function (sb) {
      return Promise.all([
        sb.from("equipment").select("id, category, name, summary, enquiry_only, sort_order, equipment_photos(storage_path, alt_text, sort_order), equipment_rates(daily_cents, weekend_cents, weekly_cents)")
          .eq("is_published", true).order("sort_order").order("name"),
        H.loadSettings(sb)
      ]);
    }).then(function (res) {
      if (res[0].error) throw res[0].error;
      if (H.renderTerms) H.renderTerms(document.querySelector("[data-terms]"), res[1]);
      var live = (res[0].data || []).map(function (d) {
        var photos = (d.equipment_photos || []).slice().sort(function (a, b) { return a.sort_order - b.sort_order; });
        var r = Array.isArray(d.equipment_rates) ? d.equipment_rates[0] : d.equipment_rates;
        return { id: "db-" + d.id, name: d.name, summary: d.summary, filter: DB_TO_FILTER[d.category] || "access", weight: "light",
          href: "hire-item.html?id=" + encodeURIComponent(d.id),
          photo: photos.length ? { src: H.photoUrl(photos[0].storage_path), alt: photos[0].alt_text || d.name } : null,
          rates: r && r.daily_cents ? { day: r.daily_cents / 100, weekend: r.weekend_cents ? r.weekend_cents / 100 : null, week: r.weekly_cents ? r.weekly_cents / 100 : null } : null };
      });
      if (!live.length) return;
      var names = {}; live.forEach(function (l) { names[l.name.toLowerCase()] = true; });
      ITEMS = live.concat(ITEMS.filter(function (i) { return !names[i.name.toLowerCase()]; }));
      counts(); render(true);
    }).catch(function (err) { console.warn("Hire catalogue (live):", err); });
  }

  if (status) status.textContent = "Loading the hire range…";
  fetch("data/hire-items.json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (d) {
      FILTERS = d.filters || []; ITEMS = d.items || [];
      buildFilters(); counts();
      var h = location.hash.replace(/^#/, "");
      state.filter = HASH_TO_FILTER[h] || (filterOf(h) ? h : "all");
      sync(); render(true);
      window.addEventListener("hashchange", fromHash);
      mergeLive();
    })
    .catch(function (err) {
      console.warn("Hire catalogue:", err);
      results.innerHTML = '<div class="empty-state"><p class="empty-state__title">We couldn\'t load the hire range just now.</p><p>Please call us (button above) or email us and we\'ll tell you what\'s available.</p><div class="empty-state__ctas"><a href="mailto:' + EMAIL + '" class="btn btn--primary btn--sm">Email us</a></div></div>';
      if (status) status.textContent = "The hire range didn't load. Call us to ask about hire.";
    });
})();
