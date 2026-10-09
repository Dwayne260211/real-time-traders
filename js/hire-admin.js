/* admin.html: hire administration. Every read and write here is checked by Row Level
   Security in the database (public.is_admin()); hiding this page is NOT the protection. */
(function () {
  "use strict";
  var H = window.RTTHire;
  if (!H || !H.config()) return;
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var sb, equipment = [], adminStatus = $("[data-admin-status]");
  var IMG_TYPES = ["image/jpeg", "image/png", "image/webp"];

  $("[data-unconfigured]").hidden = true;

  function flash(msg, isError) {
    adminStatus.hidden = !msg;
    adminStatus.classList.toggle("is-error", !!isError);
    adminStatus.textContent = msg || "";
  }
  function setStatus(form, msg, isError) {
    var st = form.querySelector(".form-status");
    st.classList.toggle("is-error", !!isError);
    st.textContent = msg;
  }
  function toCents(v, label) {
    v = String(v || "").trim().replace(/^\$/, "");
    if (!v) return null;
    if (!/^\d+(\.\d{1,2})?$/.test(v)) throw new Error(label + ": enter an amount like 45 or 45.50");
    return Math.round(parseFloat(v) * 100);
  }
  function centsToInput(c) { return c === null || c === undefined ? "" : (c / 100).toFixed(2); }
  function toInt(v, label, min, max) {
    v = String(v || "").trim();
    if (!v) return null;
    if (!/^\d+$/.test(v) || +v < min || +v > max) throw new Error(label + ": enter a whole number from " + min + " to " + max);
    return +v;
  }
  function textOrNull(v) { v = String(v || "").trim(); return v ? v : null; }
  function boolOrNull(v) { return v === "true" ? true : v === "false" ? false : null; }
  function check(r) { if (r.error) throw r.error; return r.data; }
  function ext(file) { return { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[file.type]; }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); });
  }
  function validImages(files) {
    files.forEach(function (f) {
      if (IMG_TYPES.indexOf(f.type) < 0) throw new Error(f.name + ": use a JPG, PNG or WebP image.");
      if (f.size > 5 * 1024 * 1024) throw new Error(f.name + " is larger than 5 MB.");
    });
  }

  /* ---------------- Equipment ---------------- */
  var eqForm = $("[data-equipment-form]"), eqTable = $("[data-equipment-table]");
  function loadEquipment() {
    return sb.from("equipment").select("*, equipment_rates(*), equipment_photos(*)").order("category").order("sort_order").order("name")
      .then(check).then(function (rows) {
        equipment = rows || [];
        renderEquipment();
        fillEquipmentSelects();
      });
  }
  function ratesOf(e) { return (Array.isArray(e.equipment_rates) ? e.equipment_rates[0] : e.equipment_rates) || {}; }
  function renderEquipment() {
    if (!equipment.length) {
      eqTable.innerHTML = '<caption class="sr-only">Equipment</caption><tbody><tr><td>No equipment yet. Use <strong>Add equipment</strong> to add your first item.</td></tr></tbody>';
      return;
    }
    eqTable.innerHTML = '<caption class="sr-only">Equipment</caption><thead><tr><th scope="col">Item</th><th scope="col">Category</th><th scope="col">Day / weekend / week</th><th scope="col">Photos</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody>' +
      equipment.map(function (e) {
        var r = ratesOf(e), cat = H.category(e.category);
        return "<tr><th scope=\"row\">" + H.esc(e.name) + (e.enquiry_only ? " <span class=\"tag-enquiry\">Enquiry only</span>" : "") + "</th>" +
          "<td>" + H.esc(cat ? cat.name : e.category) + "</td>" +
          "<td>" + [r.daily_cents, r.weekend_cents, r.weekly_cents].map(function (c) { return H.esc(H.money(c) || "–"); }).join(" / ") + "</td>" +
          "<td>" + (e.equipment_photos || []).length + "</td>" +
          "<td>" + (e.is_published ? '<span class="status-badge status-badge--confirmed">Published</span>' : '<span class="status-badge status-badge--cancelled">Draft</span>') + "</td>" +
          '<td><div class="cell-actions"><button type="button" class="btn btn--light btn--sm" data-edit="' + e.id + '">Edit<span class="sr-only"> ' + H.esc(e.name) + "</span></button>" +
          '<button type="button" class="btn btn--outline btn--sm" data-publish="' + e.id + '">' + (e.is_published ? "Unpublish" : "Publish") + '<span class="sr-only"> ' + H.esc(e.name) + "</span></button></div></td></tr>";
      }).join("") + "</tbody>";
  }
  function fillEquipmentSelects() {
    $$("[data-equipment-select]").forEach(function (sel) {
      var keep = sel.value;
      sel.innerHTML = equipment.length ? equipment.map(function (e) { return '<option value="' + e.id + '">' + H.esc(e.name) + (e.is_published ? "" : " (draft)") + "</option>"; }).join("")
        : '<option value="">Add equipment first</option>';
      if (keep) sel.value = keep;
    });
    loadConditionBookings();
  }
  function openEquipmentForm(e) {
    eqForm.reset();
    eqForm.hidden = false;
    setStatus(eqForm, "");
    var f = eqForm.elements;
    $("[data-equipment-form-title]").textContent = e ? "Edit: " + e.name : "Add equipment";
    f.id.value = e ? e.id : "";
    if (e) {
      var r = ratesOf(e);
      f.name.value = e.name; f.category.value = e.category; f.summary.value = e.summary || "";
      f.description.value = e.description || ""; f.specs.value = e.specs || "";
      f.daily.value = centsToInput(r.daily_cents); f.weekend.value = centsToInput(r.weekend_cents); f.weekly.value = centsToInput(r.weekly_cents);
      f.sort_order.value = e.sort_order; f.enquiry_only.checked = e.enquiry_only; f.is_published.checked = e.is_published;
    }
    $("[data-delete-equipment]").hidden = !e;
    renderPhotos(e);
    f.name.focus();
  }
  function renderPhotos(e) {
    var pm = $("[data-photo-manager]");
    pm.hidden = !e;
    if (!e) return;
    var photos = (e.equipment_photos || []).slice().sort(function (a, b) { return a.sort_order - b.sort_order; });
    $("[data-photo-grid]").innerHTML = photos.length ? photos.map(function (p) {
      return '<figure><img src="' + H.esc(H.photoUrl(p.storage_path)) + '" alt="' + H.esc(p.alt_text || "") + '"><figcaption>' + H.esc(p.alt_text || "No description") +
        '<button type="button" class="btn btn--light btn--sm admin-danger" data-delete-photo="' + p.id + '">Delete photo</button></figcaption></figure>';
    }).join("") : '<p class="note">No photos yet.</p>';
  }
  function current() { var id = eqForm.elements.id.value; return equipment.filter(function (e) { return e.id === id; })[0]; }

  $("[data-new-equipment]").addEventListener("click", function () { openEquipmentForm(null); });
  $("[data-cancel-equipment]").addEventListener("click", function () { eqForm.hidden = true; });
  eqTable.addEventListener("click", function (ev) {
    var ed = ev.target.closest("[data-edit]"), pub = ev.target.closest("[data-publish]");
    if (ed) openEquipmentForm(equipment.filter(function (e) { return e.id === ed.getAttribute("data-edit"); })[0]);
    if (pub) {
      var e = equipment.filter(function (x) { return x.id === pub.getAttribute("data-publish"); })[0];
      sb.from("equipment").update({ is_published: !e.is_published }).eq("id", e.id).then(check)
        .then(function () { flash(e.name + (e.is_published ? " is now hidden from customers." : " is now published.")); return loadEquipment(); })
        .catch(function (err) { flash(H.errorText(err), true); });
    }
  });
  eqForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = eqForm.elements, row, rates;
    try {
      if (!f.name.value.trim()) throw new Error("Add a name.");
      row = { name: f.name.value.trim(), category: f.category.value, summary: textOrNull(f.summary.value), description: textOrNull(f.description.value),
              specs: textOrNull(f.specs.value), enquiry_only: f.enquiry_only.checked, is_published: f.is_published.checked,
              sort_order: toInt(f.sort_order.value, "Sort order", 0, 9999) || 0 };
      rates = { daily_cents: toCents(f.daily.value, "Daily rate"), weekend_cents: toCents(f.weekend.value, "Weekend rate"), weekly_cents: toCents(f.weekly.value, "Weekly rate") };
    } catch (err) { setStatus(eqForm, err.message, true); return; }
    setStatus(eqForm, "Saving…");
    var id = f.id.value;
    var save = id ? sb.from("equipment").update(row).eq("id", id).select().single() : sb.from("equipment").insert(row).select().single();
    save.then(check).then(function (saved) {
      f.id.value = saved.id;
      rates.equipment_id = saved.id;
      return sb.from("equipment_rates").upsert(rates).then(check);
    }).then(loadEquipment).then(function () {
      var e = current();
      $("[data-equipment-form-title]").textContent = "Edit: " + e.name;
      $("[data-delete-equipment]").hidden = false;
      renderPhotos(e);
      setStatus(eqForm, "Saved." + (row.is_published ? " Customers can see this item." : " It's a draft: customers can't see it until you publish it."));
    }).catch(function (err) { setStatus(eqForm, H.errorText(err), true); });
  });
  $("[data-delete-equipment]").addEventListener("click", function () {
    var e = current();
    if (!e || !window.confirm("Delete " + e.name + "? This can't be undone.")) return;
    var paths = (e.equipment_photos || []).map(function (p) { return p.storage_path; });
    sb.from("equipment").delete().eq("id", e.id).then(check).then(function () {
      if (paths.length) sb.storage.from("equipment-photos").remove(paths);
      eqForm.hidden = true; flash(e.name + " deleted."); return loadEquipment();
    }).catch(function (err) {
      setStatus(eqForm, /foreign key|violates/.test(err.message || "") ? "This item has bookings, so it can't be deleted. Unpublish it instead." : H.errorText(err), true);
    });
  });
  $("[data-upload-photos]").addEventListener("click", function () {
    var e = current(), st = $("[data-photo-status]"), input = eqForm.elements.photos;
    var files = Array.prototype.slice.call(input.files || []);
    st.classList.remove("is-error");
    try { if (!files.length) throw new Error("Choose one or more photos first."); validImages(files); }
    catch (err) { st.classList.add("is-error"); st.textContent = err.message; return; }
    st.textContent = "Uploading " + files.length + " photo" + (files.length === 1 ? "" : "s") + "…";
    var start = (e.equipment_photos || []).length, alt = textOrNull(eqForm.elements.alt.value);
    files.reduce(function (p, file, i) {
      return p.then(function () {
        var path = e.id + "/" + uuid() + "." + ext(file);
        return sb.storage.from("equipment-photos").upload(path, file, { contentType: file.type, upsert: false }).then(check).then(function () {
          return sb.from("equipment_photos").insert({ equipment_id: e.id, storage_path: path, alt_text: alt || e.name, sort_order: start + i }).then(check);
        });
      });
    }, Promise.resolve()).then(loadEquipment).then(function () {
      input.value = ""; renderPhotos(current()); st.textContent = "Photos uploaded.";
    }).catch(function (err) { st.classList.add("is-error"); st.textContent = H.errorText(err); });
  });
  $("[data-photo-grid]").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-delete-photo]");
    if (!b || !window.confirm("Delete this photo?")) return;
    var e = current(), p = (e.equipment_photos || []).filter(function (x) { return x.id === b.getAttribute("data-delete-photo"); })[0];
    sb.from("equipment_photos").delete().eq("id", p.id).then(check)
      .then(function () { return sb.storage.from("equipment-photos").remove([p.storage_path]); })
      .then(loadEquipment).then(function () { renderPhotos(current()); })
      .catch(function (err) { $("[data-photo-status]").textContent = H.errorText(err); });
  });

  /* ---------------- Bookings ---------------- */
  var bookingList = $("[data-admin-bookings]"), bookingFilter = $("[data-booking-filter]"), adminBookings = [];
  function loadBookings() {
    var q = sb.from("bookings").select("*").order("start_date", { ascending: true }).limit(300);
    var f = bookingFilter.value;
    if (f === "open") q = q.in("status", ["pending", "confirmed"]);
    else if (f !== "all") q = q.eq("status", f);
    return q.then(check).then(function (rows) {
      adminBookings = rows || [];
      if (!adminBookings.length) { bookingList.innerHTML = '<p class="note">No bookings to show.</p>'; return; }
      bookingList.innerHTML = adminBookings.map(function (b) {
        var opts = ["pending", "confirmed", "completed", "cancelled"].map(function (s) { return '<option value="' + s + '"' + (s === b.status ? " selected" : "") + ">" + s.charAt(0).toUpperCase() + s.slice(1) + "</option>"; }).join("");
        return '<article class="booking-card" data-booking="' + b.id + '">' +
          '<div class="booking-card__head"><h3>' + H.esc(b.equipment_name) + " · " + H.esc(b.reference) + "</h3>" + H.statusBadge(b.status) + "</div>" +
          "<dl>" +
            "<div><dt>Dates</dt><dd>" + H.esc(H.fmtDate(b.start_date)) + " to " + H.esc(H.fmtDate(b.end_date)) + " (" + b.hire_days + " d)</dd></div>" +
            "<div><dt>Customer</dt><dd>" + H.esc(b.customer_name) + "<br>" + H.esc(b.customer_email) + (b.customer_phone ? "<br>" + H.esc(b.customer_phone) : "") + "</dd></div>" +
            "<div><dt>Price</dt><dd>" + H.esc(H.money(b.hire_total_cents) || "To be confirmed") + (b.discount_percent > 0 ? " (" + b.discount_percent + "% off at payment)" : "") + "</dd></div>" +
            "<div><dt>Payment</dt><dd>" + H.esc(H.PAYMENT_LABELS[b.payment_status] || b.payment_status) + (b.amount_paid_cents ? " · " + H.esc(H.money(b.amount_paid_cents)) : "") + "</dd></div>" +
            "<div><dt>Pickup / delivery</dt><dd>" + H.esc(b.fulfilment || "Not chosen") + (b.delivery_address ? ": " + H.esc(b.delivery_address) : "") + "</dd></div>" +
            (b.customer_notes ? "<div><dt>Customer notes</dt><dd>" + H.esc(b.customer_notes) + "</dd></div>" : "") +
          "</dl>" +
          (b.cancel_requested_at && b.status !== "cancelled" ? '<p class="notice is-error">Cancellation requested' + (b.cancel_reason ? ": " + H.esc(b.cancel_reason) : "") + ". Review it under your terms, refund in Stripe if due, then set the status.</p>" : "") +
          (b.payment_status === "paid_conflict" ? '<p class="notice is-error">Paid, but the dates clash. Contact the customer: move the booking or refund in Stripe.</p>' : "") +
          '<form class="admin-booking-edit" novalidate><div class="form-grid">' +
            '<label class="field"><span>Status</span><select name="status">' + opts + "</select></label>" +
            '<label class="field"><span>Member discount % (applied at online payment)</span><input name="discount" inputmode="decimal" value="' + (b.discount_percent || 0) + '"></label>' +
            '<label class="field field--wide"><span>Staff notes</span><textarea name="admin_notes" rows="2" maxlength="4000">' + H.esc(b.admin_notes || "") + "</textarea></label>" +
          '</div><div class="booking-card__actions"><button type="submit" class="btn btn--primary btn--sm">Save<span class="sr-only"> booking ' + H.esc(b.reference) + "</span></button></div>" +
          '<p class="form-status" role="status" aria-live="polite"></p></form></article>';
      }).join("");
    }).catch(function (err) { bookingList.innerHTML = ""; flash(H.errorText(err), true); });
  }
  bookingFilter.addEventListener("change", loadBookings);
  bookingList.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var form = ev.target, id = form.closest("[data-booking]").getAttribute("data-booking");
    var d = parseFloat(form.elements.discount.value || "0");
    if (!(d >= 0 && d <= 100)) { setStatus(form, "Discount must be between 0 and 100.", true); return; }
    var prev = (adminBookings.filter(function (b) { return b.id === id; })[0] || {}).status, next = form.elements.status.value;
    setStatus(form, "Saving…");
    sb.from("bookings").update({ status: next, discount_percent: d, admin_notes: textOrNull(form.elements.admin_notes.value) })
      .eq("id", id).then(check).then(function () {
        if (next === prev || (next !== "confirmed" && next !== "cancelled")) { flash("Booking updated."); return loadBookings(); }
        // Tell the customer. Reports honestly when no email provider is set up.
        return H.callFunction("send-confirmation", { booking_id: id, kind: next }).then(function (res) {
          flash(res && res.sent ? "Booking updated and the customer was emailed." : res && res.reason === "already_sent" ? "Booking updated. The customer was already emailed about this." : res && res.reason === "email_not_configured" ? "Booking updated. No email was sent (email isn't set up yet), so contact the customer yourself." : "Booking updated, but the email couldn't be sent. Contact the customer yourself.");
        }, function () { flash("Booking updated, but the email couldn't be sent. Contact the customer yourself.", true); }).then(loadBookings);
      })
      .catch(function (err) { setStatus(form, H.errorText(err), true); });
  });

  /* ---------------- Maintenance ---------------- */
  var maintForm = $("[data-maint-form]"), maintTable = $("[data-maint-table]");
  function loadMaint() {
    return sb.from("maintenance_blocks").select("id, start_date, end_date, reason, equipment(name)").order("start_date", { ascending: false }).limit(200)
      .then(check).then(function (rows) {
        maintTable.innerHTML = '<caption class="sr-only">Maintenance blocks</caption>' + (rows.length
          ? "<thead><tr><th scope=\"col\">Item</th><th scope=\"col\">Dates</th><th scope=\"col\">Reason</th><th scope=\"col\">Actions</th></tr></thead><tbody>" + rows.map(function (m) {
              return "<tr><th scope=\"row\">" + H.esc(m.equipment ? m.equipment.name : "") + "</th><td>" + H.esc(H.fmtDate(m.start_date)) + " to " + H.esc(H.fmtDate(m.end_date)) + "</td><td>" + H.esc(m.reason || "") +
                '</td><td><button type="button" class="btn btn--light btn--sm admin-danger" data-delete-maint="' + m.id + '">Remove block</button></td></tr>';
            }).join("") + "</tbody>"
          : "<tbody><tr><td>No maintenance blocks.</td></tr></tbody>");
      }).catch(function (err) { flash(H.errorText(err), true); });
  }
  maintForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = maintForm.elements;
    if (!f.equipment_id.value || !f.start.value || !f.end.value) { setStatus(maintForm, "Choose an item and both dates.", true); return; }
    if (f.end.value < f.start.value) { setStatus(maintForm, "The end date must be on or after the start date.", true); return; }
    sb.from("maintenance_blocks").insert({ equipment_id: f.equipment_id.value, start_date: f.start.value, end_date: f.end.value, reason: textOrNull(f.reason.value) })
      .then(check).then(function () { setStatus(maintForm, "Dates blocked."); f.reason.value = ""; return loadMaint(); })
      .catch(function (err) { setStatus(maintForm, H.errorText(err), true); });
  });
  maintTable.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-delete-maint]");
    if (!b || !window.confirm("Remove this maintenance block? Customers will be able to book these dates.")) return;
    sb.from("maintenance_blocks").delete().eq("id", b.getAttribute("data-delete-maint")).then(check).then(loadMaint)
      .catch(function (err) { flash(H.errorText(err), true); });
  });

  /* ---------------- Condition reports ---------------- */
  var condForm = $("[data-condition-form]"), condList = $("[data-condition-list]");
  var CONDITION = { good: "Good", minor_wear: "Minor wear", damaged: "Damaged", needs_service: "Needs service", out_of_service: "Out of service" };
  var STAGE = { before_hire: "Before hire", on_return: "On return", maintenance: "Maintenance", other: "Other" };
  function loadConditionBookings() {
    var sel = $("[data-condition-booking]"), item = condForm.elements.equipment_id.value;
    if (!item) return;
    sb.from("bookings").select("id, reference, start_date, end_date, customer_name").eq("equipment_id", item).in("status", ["confirmed", "completed"])
      .order("start_date", { ascending: false }).limit(50).then(check).then(function (rows) {
        sel.innerHTML = '<option value="">Not linked to a booking</option>' + rows.map(function (b) {
          return '<option value="' + b.id + '">' + H.esc(b.reference + " · " + b.customer_name + " · " + b.start_date) + "</option>";
        }).join("");
      }).catch(function () {});
  }
  condForm.elements.equipment_id.addEventListener("change", loadConditionBookings);
  function loadReports() {
    return sb.from("condition_reports").select("*, equipment(name), bookings(reference), condition_report_photos(storage_path)")
      .order("recorded_at", { ascending: false }).limit(50).then(check).then(function (rows) {
        if (!rows.length) { condList.innerHTML = '<p class="note">No condition reports yet.</p>'; return; }
        var paths = [];
        rows.forEach(function (r) { (r.condition_report_photos || []).forEach(function (p) { paths.push(p.storage_path); }); });
        var signed = paths.length ? sb.storage.from("condition-photos").createSignedUrls(paths, 3600).then(function (s) { return s.data || []; }) : Promise.resolve([]);
        return signed.then(function (urls) {
          var map = {};
          urls.forEach(function (u) { if (u.signedUrl) map[u.path] = u.signedUrl; });
          condList.innerHTML = rows.map(function (r) {
            return '<article class="booking-card"><div class="booking-card__head"><h3>' + H.esc(r.equipment ? r.equipment.name : "") + "</h3><span class=\"status-badge status-badge--" +
              (r.condition === "good" ? "confirmed" : r.condition === "minor_wear" ? "completed" : "pending") + '">' + H.esc(CONDITION[r.condition]) + "</span></div>" +
              "<dl><div><dt>When</dt><dd>" + H.esc(STAGE[r.stage]) + " · " + H.esc(new Date(r.recorded_at).toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })) + "</dd></div>" +
              "<div><dt>Booking</dt><dd>" + H.esc(r.bookings ? r.bookings.reference : "None") + "</dd></div></dl>" +
              (r.notes ? '<p class="booking-card__note">' + H.esc(r.notes) + "</p>" : "") +
              '<div class="report-photos">' + (r.condition_report_photos || []).map(function (p) {
                return map[p.storage_path] ? '<a href="' + H.esc(map[p.storage_path]) + '" target="_blank" rel="noopener"><img src="' + H.esc(map[p.storage_path]) + '" alt="Condition photo of ' + H.esc(r.equipment ? r.equipment.name : "item") + '"></a>' : "";
              }).join("") + "</div></article>";
          }).join("");
        });
      }).catch(function (err) { flash(H.errorText(err), true); });
  }
  condForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = condForm.elements, files = Array.prototype.slice.call(f.photos.files || []);
    try { if (!f.equipment_id.value) throw new Error("Choose an item."); validImages(files); }
    catch (err) { setStatus(condForm, err.message, true); return; }
    setStatus(condForm, "Saving…");
    sb.from("condition_reports").insert({ equipment_id: f.equipment_id.value, booking_id: f.booking_id.value || null, stage: f.stage.value,
      condition: f.condition.value, notes: textOrNull(f.notes.value) }).select().single().then(check).then(function (report) {
      return files.reduce(function (p, file) {
        return p.then(function () {
          var path = report.id + "/" + uuid() + "." + ext(file);
          return sb.storage.from("condition-photos").upload(path, file, { contentType: file.type }).then(check)
            .then(function () { return sb.from("condition_report_photos").insert({ report_id: report.id, storage_path: path }).then(check); });
        });
      }, Promise.resolve());
    }).then(function () { setStatus(condForm, "Condition report saved."); f.notes.value = ""; f.photos.value = ""; return loadReports(); })
      .catch(function (err) { setStatus(condForm, H.errorText(err), true); });
  });

  /* ---------------- Settings ---------------- */
  var setForm = $("[data-settings-form]");
  var TEXT_FIELDS = ["deposit_terms", "id_requirements", "pickup_options", "delivery_options", "late_return_policy", "damage_policy", "cancellation_terms"];
  function loadSettingsForm() {
    return H.loadSettings(sb).then(function (s) {
      var f = setForm.elements;
      f.payments_live.checked = !!s.payments_live;
      f.pricing_rule.value = s.pricing_rule || "";
      f.security_deposit.value = centsToInput(s.security_deposit_cents);
      f.deposit_collected_online.value = s.deposit_collected_online === null || s.deposit_collected_online === undefined ? "" : String(s.deposit_collected_online);
      f.delivery_available.value = s.delivery_available === null || s.delivery_available === undefined ? "" : String(s.delivery_available);
      TEXT_FIELDS.forEach(function (k) { f[k].value = s[k] || ""; });
      f.cancel_auto_refund_min_hours.value = s.cancel_auto_refund_min_hours === null || s.cancel_auto_refund_min_hours === undefined ? "" : s.cancel_auto_refund_min_hours;
      f.cancel_auto_refund_percent.value = s.cancel_auto_refund_percent === null || s.cancel_auto_refund_percent === undefined ? "" : s.cancel_auto_refund_percent;
    });
  }
  setForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = setForm.elements, row;
    try {
      row = {
        payments_live: f.payments_live.checked, pricing_rule: f.pricing_rule.value || null,
        security_deposit_cents: toCents(f.security_deposit.value, "Deposit amount"),
        deposit_collected_online: boolOrNull(f.deposit_collected_online.value), delivery_available: boolOrNull(f.delivery_available.value),
        cancel_auto_refund_min_hours: toInt(f.cancel_auto_refund_min_hours.value, "Automatic refund hours", 0, 8760),
        cancel_auto_refund_percent: toInt(f.cancel_auto_refund_percent.value, "Automatic refund %", 0, 100)
      };
      TEXT_FIELDS.forEach(function (k) { row[k] = textOrNull(f[k].value); });
      if ((row.cancel_auto_refund_min_hours === null) !== (row.cancel_auto_refund_percent === null)) throw new Error("Fill in both automatic refund boxes, or leave both blank.");
      if (row.payments_live && !row.pricing_rule) throw new Error("Choose a pricing rule before switching on online payments.");
    } catch (err) { setStatus(setForm, err.message, true); return; }
    setStatus(setForm, "Saving…");
    sb.from("hire_settings").update(row).eq("id", true).select().then(check).then(function (rows) {
      if (!rows.length) throw new Error("Not saved: this account isn't allowed to change settings.");
      setStatus(setForm, "Settings saved.");
    }).catch(function (err) { setStatus(setForm, H.errorText(err), true); });
  });

  /* ---------------- Start ---------------- */
  var signinBox = $("[data-signin-box]"), notAdmin = $("[data-not-admin]"), adminBox = $("[data-admin]"), started;
  function setSession(s) {
    var uid = s ? s.user.id : null;
    if (uid === started) return;
    started = uid;
    signinBox.hidden = !!s; notAdmin.hidden = true; adminBox.hidden = true;
    if (!s) return;
    $$("[data-email]").forEach(function (el) { el.textContent = s.user.email || ""; });
    sb.rpc("is_admin").then(check).then(function (isAdmin) {
      if (!isAdmin) { notAdmin.hidden = false; return; }
      adminBox.hidden = false;
      return Promise.all([loadEquipment(), loadBookings(), loadMaint(), loadReports(), loadSettingsForm()]);
    }).catch(function (err) { flash(H.errorText(err), true); adminBox.hidden = false; });
  }
  H.client().then(function (client) {
    sb = client;
    H.wireSignIn(signinBox.querySelector("[data-signin]"), sb, function () { return location.origin + location.pathname; });
    $$("[data-signout]").forEach(function (b) { b.addEventListener("click", function () { sb.auth.signOut().then(function () { setSession(null); }); }); });
    return sb.auth.getSession();
  }).then(function (r) {
    setSession(r.data.session);
    sb.auth.onAuthStateChange(function (_e, s) { setSession(s); });
  }).catch(function (err) {
    $("[data-unconfigured]").hidden = false;
    $("[data-unconfigured] p:not(.empty-state__title)").textContent = H.errorText(err);
  });
})();
