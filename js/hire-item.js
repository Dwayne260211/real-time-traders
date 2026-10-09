/* hire-item.html?id=<uuid>: photos, description, rates, terms, live availability and
   booking requests. Bookings are PENDING until an admin confirms them or (only when the
   owner has switched payments on) Stripe confirms payment through the webhook. */
(function () {
  "use strict";
  var H = window.RTTHire;
  if (!H) return;
  var $ = function (s) { return document.querySelector(s); };
  var params = new URLSearchParams(location.search);
  var id = params.get("id") || "";
  var notice = $("[data-item-notice]"), noticeText = $("[data-item-notice-text]");
  var layout = $("[data-item]");

  if (!H.config()) return;                                  // static "coming soon" notice stays
  if (!/^[0-9a-f-]{36}$/i.test(id)) { noticeText.textContent = "No item was selected. Browse the hire catalogue to choose one."; return; }

  var sb, item, settings, session, lastQuote = null;
  var datesForm = $("[data-dates]"), avail = $("[data-avail]");
  var startIn = datesForm.elements.start, endIn = datesForm.elements.end;
  var signinBox = $("[data-book-signin]"), bookForm = $("[data-book-form]"), enquiryBox = $("[data-enquiry-only]");

  function paymentsOn() { return !!(settings && settings.payments_live && settings.pricing_rule); }

  function renderGallery(photos) {
    var g = $("[data-gallery]");
    var cat = H.category(item.category) || { icon: "i-tools" };
    if (!photos.length) { g.innerHTML = '<div class="gallery__main">' + H.icon(cat.icon) + "</div>"; return; }
    function main(i) {
      return '<img src="' + H.esc(H.photoUrl(photos[i].storage_path)) + '" alt="' + H.esc(photos[i].alt_text || item.name) + '" width="800" height="600">';
    }
    g.innerHTML = '<div class="gallery__main" data-main>' + main(0) + "</div>" + (photos.length > 1
      ? '<div class="gallery__thumbs">' + photos.map(function (p, i) {
          return '<button type="button" data-i="' + i + '" aria-label="Show photo ' + (i + 1) + ' of ' + photos.length + '"' + (i === 0 ? ' aria-current="true"' : "") +
            '><img src="' + H.esc(H.photoUrl(p.storage_path)) + '" alt="" loading="lazy" width="76" height="60"></button>';
        }).join("") + "</div>" : "");
    g.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-i]");
      if (!b) return;
      g.querySelector("[data-main]").innerHTML = main(Number(b.getAttribute("data-i")));
      g.querySelectorAll("button[data-i]").forEach(function (x) { x.setAttribute("aria-current", String(x === b)); });
    });
  }

  function renderRates(r) {
    var rows = [["Daily", r && r.daily_cents, "per day"], ["Weekend", r && r.weekend_cents, "Saturday to Sunday"], ["Weekly", r && r.weekly_cents, "per 7 days"]];
    $("[data-rates]").innerHTML = '<caption class="sr-only">Hire rates</caption><thead><tr><th scope="col">Rate</th><th scope="col">Price</th><th scope="col">Covers</th></tr></thead><tbody>' +
      rows.map(function (row) {
        return "<tr><th scope=\"row\">" + row[0] + "</th>" + (row[1] ? "<td>" + H.money(row[1]) + "</td><td>" + row[2] + "</td>" : '<td class="is-na" colspan="2">Not offered online. Call us</td>') + "</tr>";
      }).join("") + "</tbody>";
    var note = "Prices in AUD. No GST (Real Time Traders is not registered for GST).";
    if (!settings.pricing_rule) note += " Totals shown when you pick dates are estimates until our pricing is finalised; we'll confirm your price.";
    else if (settings.pricing_rule === "exact_period") note += " Your total uses the weekend rate for a Saturday to Sunday hire, the weekly rate for whole weeks, and otherwise the daily rate for each day.";
    else note += " Choose daily, weekend (Saturday to Sunday) or weekly (whole weeks, rounded up) when you pick your dates.";
    $("[data-pricing-note]").textContent = note;
  }

  function mergeRanges(list) {
    var out = [];
    list.forEach(function (r) {
      var last = out[out.length - 1];
      if (last && H.addDays(last.end_date, 1) >= r.start_date) { if (r.end_date > last.end_date) last.end_date = r.end_date; }
      else out.push({ start_date: r.start_date, end_date: r.end_date });
    });
    return out;
  }
  function loadUnavailable() {
    var from = H.todayBrisbane(), to = H.addDays(from, 92);
    return sb.rpc("get_unavailable_periods", { p_equipment_id: id, p_from: from, p_to: to }).then(function (r) {
      if (r.error) throw r.error;
      var list = mergeRanges(r.data || []);
      var box = $("[data-unavailable]");
      box.hidden = !list.length;
      $("[data-unavailable-list]").innerHTML = list.map(function (p) {
        return "<li>" + H.esc(p.start_date === p.end_date ? H.fmtDate(p.start_date) : H.fmtDate(p.start_date) + " to " + H.fmtDate(p.end_date)) + "</li>";
      }).join("");
    }).catch(function (e) { console.warn(e); });
  }

  function showBookingStep() {
    var ok = lastQuote && lastQuote.available;
    signinBox.hidden = !ok || !!session;
    bookForm.hidden = !ok || !session;
  }

  function checkAvailability() {
    var s = startIn.value, e = endIn.value;
    lastQuote = null; showBookingStep();
    avail.className = "avail-result";
    if (!s || !e) { avail.textContent = "Choose a hire start and a return date."; return Promise.resolve(); }
    if (e < s) { avail.classList.add("is-bad"); avail.textContent = "The return date must be on or after the hire start date."; return Promise.resolve(); }
    if (s < H.todayBrisbane()) { avail.classList.add("is-bad"); avail.textContent = "The hire start date can't be in the past."; return Promise.resolve(); }
    var rt = datesForm.querySelector("input[name=rate_type]:checked");
    avail.textContent = "Checking…";
    return sb.rpc("quote_hire", { p_equipment_id: id, p_start: s, p_end: e, p_rate_type: settings.pricing_rule === "customer_choice" && rt ? rt.value : null })
      .then(function (r) {
        if (r.error) throw r.error;
        var q = r.data;
        var days = H.daysBetween(s, e);
        var period = H.fmtDate(s) + " to " + H.fmtDate(e) + " (" + days + " day" + (days === 1 ? "" : "s") + ")";
        if (!q.ok) { avail.classList.add("is-bad"); avail.innerHTML = "<strong>" + H.esc(H.errorText({ message: q.reason })) + "</strong>"; return; }
        if (!q.available) {
          avail.classList.add("is-bad");
          avail.innerHTML = "<strong>Not available for those dates.</strong>" + H.esc(period) + ". Please try other dates.";
          return;
        }
        lastQuote = q;
        avail.classList.add("is-ok");
        var price = q.total_cents === null || q.total_cents === undefined
          ? "<span>Price on request: we'll confirm it with you.</span>"
          : '<span class="price">' + H.money(q.total_cents) + "</span> " + (q.pricing_rule_approved ? "hire total" : "estimated hire total") +
            (q.rate_type ? " (" + q.rate_type + " rate)" : "");
        var deposit = q.deposit_cents !== null && q.deposit_cents !== undefined ? "<br>Security deposit: " + H.money(q.deposit_cents) : "<br>Security deposit: " + H.TBC;
        avail.innerHTML = "<strong>Available.</strong>" + H.esc(period) + "<br>" + price + deposit;
        showBookingStep();
      }).catch(function (err) { avail.classList.add("is-bad"); avail.textContent = H.errorText(err); });
  }

  datesForm.addEventListener("submit", function (e) { e.preventDefault(); checkAvailability(); });
  startIn.addEventListener("change", function () {
    endIn.min = startIn.value || H.todayBrisbane();
    if (startIn.value && (!endIn.value || endIn.value < startIn.value)) endIn.value = startIn.value;
  });
  [startIn, endIn].forEach(function (inp) { inp.addEventListener("change", function () { if (startIn.value && endIn.value) checkAvailability(); }); });
  datesForm.querySelectorAll("input[name=rate_type]").forEach(function (r) { r.addEventListener("change", checkAvailability); });

  function setSession(s) {
    session = s;
    if (s) {
      bookForm.querySelector("[data-email]").textContent = s.user.email || "";
      var nameIn = bookForm.elements.name;
      if (!nameIn.value && s.user.user_metadata && s.user.user_metadata.full_name) nameIn.value = s.user.user_metadata.full_name;
    }
    showBookingStep();
  }

  bookForm.elements.fulfilment.addEventListener("change", function () {
    $("[data-address-wrap]").hidden = bookForm.elements.fulfilment.value !== "delivery";
  });

  bookForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var st = bookForm.querySelector(".form-status");
    st.classList.remove("is-error");
    var f = bookForm.elements;
    var problems = [];
    if (!lastQuote || !lastQuote.available) problems.push("Check availability for your dates first.");
    if (!f.name.value.trim()) problems.push("Please add your name.");
    if (f.fulfilment.value === "delivery" && !$("[data-fulfilment-wrap]").hidden && !f.address.value.trim()) problems.push("Please add the delivery address.");
    if (!f.ack.checked) problems.push("Please tick the box to confirm you understand how booking works.");
    if (problems.length) { st.classList.add("is-error"); st.textContent = problems.join("\n"); return; }
    var btn = $("[data-book-btn]"); btn.disabled = true;
    st.textContent = "Sending your request…";
    var rt = datesForm.querySelector("input[name=rate_type]:checked");
    sb.rpc("request_booking", {
      p_equipment_id: id, p_start: startIn.value, p_end: endIn.value,
      p_customer_name: f.name.value.trim(), p_customer_phone: f.phone.value.trim() || null,
      p_rate_type: settings.pricing_rule === "customer_choice" && rt ? rt.value : null,
      p_fulfilment: $("[data-fulfilment-wrap]").hidden ? null : f.fulfilment.value,
      p_delivery_address: f.fulfilment.value === "delivery" ? f.address.value.trim() : null,
      p_notes: f.notes.value.trim() || null
    }).then(function (r) {
      if (r.error) throw r.error;
      var b = r.data;
      if (paymentsOn() && b.hire_total_cents) {
        st.textContent = "Request saved (reference " + b.reference + "). Taking you to secure payment…";
        return H.callFunction("create-checkout-session", { booking_id: b.id }).then(function (res) {
          location.href = res.url;
        }).catch(function (err) {
          st.textContent = "Your request is saved (reference " + b.reference + ") but online payment isn't available right now: " +
            H.errorText(err) + "\nWe'll contact you to confirm. See it any time in My hire bookings.";
        });
      }
      st.textContent = "Booking request sent. Reference " + b.reference + ".\nIt is pending: we'll contact you to confirm the dates and price. No payment has been taken.";
      bookForm.querySelectorAll("input, select, textarea").forEach(function (x) { x.disabled = true; });
      var link = document.createElement("p");
      link.innerHTML = '<a class="btn btn--outline btn--block" href="my-bookings.html">View my hire bookings</a>';
      bookForm.appendChild(link);
      H.callFunction("send-confirmation", { booking_id: b.id, kind: "request_received" }).then(function (res) {
        st.textContent += res && res.sent ? "\nWe've emailed you a copy." : "\nYou can see it in My hire bookings.";
      }).catch(function () { st.textContent += "\nYou can see it in My hire bookings."; });
      loadUnavailable();
    }).catch(function (err) {
      st.classList.add("is-error"); st.textContent = H.errorText(err); btn.disabled = false;
    });
  });

  H.client().then(function (client) {
    sb = client;
    return Promise.all([
      sb.from("equipment").select("id, category, name, summary, description, specs, enquiry_only, equipment_photos(storage_path, alt_text, sort_order), equipment_rates(daily_cents, weekend_cents, weekly_cents)")
        .eq("id", id).eq("is_published", true).maybeSingle(),
      H.loadSettings(sb),
      sb.auth.getSession()
    ]);
  }).then(function (res) {
    if (res[0].error) throw res[0].error;
    item = res[0].data; settings = res[1];
    if (!item) { noticeText.textContent = "This item isn't available online. It may have been removed. Browse the catalogue or call us."; return; }
    notice.hidden = true; layout.hidden = false;
    document.title = item.name + " hire | Real Time Traders";
    $("[data-item-title]").textContent = item.name;
    $("[data-crumb]").textContent = item.name;
    var cat = H.category(item.category);
    $("[data-cat]").textContent = cat ? cat.name : "";
    $("[data-desc]").textContent = item.description || item.summary || "";
    if (item.specs) {
      $("[data-specs-wrap]").hidden = false;
      $("[data-specs]").innerHTML = "<ul>" + item.specs.split(/\n+/).filter(Boolean).map(function (l) { return "<li>" + H.esc(l) + "</li>"; }).join("") + "</ul>";
    }
    var photos = (item.equipment_photos || []).slice().sort(function (a, b) { return a.sort_order - b.sort_order; });
    renderGallery(photos);
    renderRates(Array.isArray(item.equipment_rates) ? item.equipment_rates[0] : item.equipment_rates);
    H.renderTerms($("[data-terms]"), settings);
    if (item.enquiry_only) {
      datesForm.hidden = true; enquiryBox.hidden = false;
      $("[data-item-jump]").lastChild.textContent = " How to book";
      return;
    }
    $("[data-rate-choice]").hidden = settings.pricing_rule !== "customer_choice";
    $("[data-fulfilment-wrap]").hidden = settings.delivery_available !== true;
    if (paymentsOn()) {
      $("[data-book-btn]").textContent = "Book and pay online";
      $("[data-ack-text]").textContent = "I've read the hire terms. My booking is confirmed once payment is complete.";
    }
    var today = H.todayBrisbane();
    startIn.min = today; endIn.min = today;
    var ps = params.get("start"), pe = params.get("end");
    if (ps && /^\d{4}-\d{2}-\d{2}$/.test(ps)) startIn.value = ps;
    if (pe && /^\d{4}-\d{2}-\d{2}$/.test(pe)) endIn.value = pe;
    H.wireSignIn(signinBox.querySelector("[data-signin]"), sb, function () {
      var u = new URL(location.href);
      u.hash = "";
      if (startIn.value) u.searchParams.set("start", startIn.value);
      if (endIn.value) u.searchParams.set("end", endIn.value);
      return u.toString();
    });
    $("[data-signout]").addEventListener("click", function () { sb.auth.signOut().then(function () { setSession(null); }); });
    sb.auth.onAuthStateChange(function (_e, s) { setSession(s); });
    setSession(res[2].data.session);
    loadUnavailable();
    if (startIn.value && endIn.value) checkAvailability();
  }).catch(function (err) {
    console.warn("Hire item:", err);
    noticeText.textContent = "We couldn't load this item just now. Please call us to ask about hire.";
  });
})();
