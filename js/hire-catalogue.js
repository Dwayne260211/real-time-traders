/* hire.html: category filters, and published equipment from Supabase when configured.
   Unconfigured or empty categories keep the honest "Equipment coming soon" state. */
(function () {
  "use strict";
  var H = window.RTTHire;
  if (!H) return;
  var status = document.querySelector("[data-hire-status]");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
  var sections = Array.prototype.slice.call(document.querySelectorAll(".hire-cat"));
  var HASH_TO_FILTER = { tool: "all", hire: "all", cleaning: "cleaning", gardening: "gardening",
    "power-tools": "power-tools", general: "general", plant: "plant", trailer: "trailers", trailers: "trailers" };

  function applyFilter(filter, announce) {
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-filter") === filter)); });
    sections.forEach(function (s) { s.hidden = filter !== "all" && s.getAttribute("data-cat") !== filter; });
    if (announce && status) {
      var cat = H.category(filter);
      status.textContent = filter === "all" ? "Showing all equipment categories." : "Showing " + cat.name + ".";
    }
  }
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      applyFilter(f, true);
      var cat = H.category(f);
      if (history.replaceState) history.replaceState(null, "", f === "all" ? location.pathname + location.search : "#" + (cat ? cat.hash : f));
    });
  });
  function fromHash() {
    var h = location.hash.replace(/^#/, "");
    if (HASH_TO_FILTER[h]) applyFilter(HASH_TO_FILTER[h], false);
  }
  fromHash();
  window.addEventListener("hashchange", fromHash);

  if (!H.config()) return;   // not configured: static coming-soon states stay as they are

  function rateChips(r) {
    if (!r) return '<li><strong>Price on request</strong></li>';
    var out = [];
    if (r.daily_cents) out.push("<li><strong>" + H.money(r.daily_cents) + "</strong> per day</li>");
    if (r.weekend_cents) out.push("<li><strong>" + H.money(r.weekend_cents) + "</strong> weekend</li>");
    if (r.weekly_cents) out.push("<li><strong>" + H.money(r.weekly_cents) + "</strong> per week</li>");
    return out.length ? out.join("") : '<li><strong>Price on request</strong></li>';
  }

  function card(item) {
    var cat = H.category(item.category) || { icon: "i-tools" };
    var photos = (item.equipment_photos || []).slice().sort(function (a, b) { return a.sort_order - b.sort_order; });
    var href = "hire-item.html?id=" + encodeURIComponent(item.id);
    var rates = Array.isArray(item.equipment_rates) ? item.equipment_rates[0] : item.equipment_rates;
    var media = photos.length
      ? '<img src="' + H.esc(H.photoUrl(photos[0].storage_path)) + '" alt="' + H.esc(photos[0].alt_text || item.name) + '" loading="lazy" width="400" height="300">'
      : H.icon(cat.icon);
    return '<article class="equip-card">' +
      '<a class="equip-card__media" href="' + href + '" tabindex="-1" aria-hidden="true">' + media + "</a>" +
      '<div class="equip-card__body">' +
        (item.enquiry_only ? '<span class="tag-enquiry">Call to book</span>' : "") +
        '<h3><a href="' + href + '">' + H.esc(item.name) + "</a></h3>" +
        "<p>" + H.esc(item.summary || "") + "</p>" +
        '<ul class="rate-list" aria-label="Rates">' + rateChips(rates) + "</ul>" +
        '<a class="btn btn--primary btn--sm btn--block" href="' + href + '">' + (item.enquiry_only ? "View details" : "View &amp; book") +
        '<span class="sr-only"> ' + H.esc(item.name) + "</span></a>" +
      "</div></article>";
  }

  if (status) status.textContent = "Loading equipment…";
  H.client().then(function (sb) {
    return Promise.all([
      sb.from("equipment")
        .select("id, category, name, summary, enquiry_only, sort_order, equipment_photos(storage_path, alt_text, sort_order), equipment_rates(daily_cents, weekend_cents, weekly_cents)")
        .eq("is_published", true).order("sort_order").order("name"),
      H.loadSettings(sb)
    ]);
  }).then(function (res) {
    var r = res[0];
    if (r.error) throw r.error;
    H.renderTerms(document.querySelector("[data-terms]"), res[1]);
    var items = r.data || [];
    var counts = { all: items.length };
    H.CATEGORIES.forEach(function (c) {
      var list = items.filter(function (i) { return i.category === c.slug; });
      counts[c.slug] = list.length;
      var grid = document.querySelector('[data-grid="' + c.slug + '"]');
      var empty = document.querySelector('[data-empty="' + c.slug + '"]');
      if (grid) grid.innerHTML = list.map(card).join("");
      if (empty) empty.hidden = list.length > 0;
    });
    document.querySelector(".hire-cats").classList.toggle("has-items", items.length > 0);
    Object.keys(counts).forEach(function (k) {
      var el = document.querySelector('[data-count="' + k + '"]');
      if (el) el.textContent = String(counts[k]);
    });
    if (status) status.textContent = items.length ? items.length + " item" + (items.length === 1 ? "" : "s") + " available to view." : "No equipment is listed online yet. Call us to ask about hire.";
  }).catch(function (err) {
    console.warn("Hire catalogue:", err);
    if (status) status.textContent = "We couldn't load the equipment list just now. Call us to ask about hire.";
  });
})();
