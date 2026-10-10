/* Real Time Traders assistant (automated)
   A small client-side FAQ matcher. No external services, no API keys, nothing is sent anywhere.
   It only answers from the facts below (the same facts published on the site) and links to the right page.
   If it doesn't know, it says so and offers Call us + the Contact page.
   Editing answers: change ENTRIES below. Hire items come from data/hire-items.json (see docs/hire-catalogue.md).
   AI upgrade notes: docs/chat-assistant.md */
(function () {
  "use strict";
  if (window.__rttChat) return;
  window.__rttChat = true;

  var TEL = "tel:+61422909739";
  var HOURS = "Mon–Fri 5am–9pm, Sat–Sun 7am–4pm (Brisbane time)";
  var EMAIL = "itsreallymejohnnyc@gmail.com";

  function hoursLine() {
    var st = window.RTT_openStatus ? window.RTT_openStatus() : null;
    return "Phone hours: " + HOURS + "." + (st ? " " + st.text + "." : "");
  }

  /* Each entry: keywords (phrases, lower case), answer paragraphs, links [label, href], call (show Call us). */
  var ENTRIES = [
    { id: "buy_sell", chip: "Buy & Sell", kw: ["buy", "sell", "selling", "marketplace", "for sale", "second hand", "secondhand", "used", "list an item", "listing an item"],
      a: ["Browse the marketplace free, no account needed. To buy or message sellers you need Basic ($4.99/month). To sell: Basic gives 10 active listings, Bronze 30, Silver 100 and Gold unlimited (fair use).", "Accounts and online posting are coming soon."],
      links: [["Go to the marketplace", "marketplace.html"], ["Compare memberships", "membership.html"]] },
    { id: "hire", chip: "Hire equipment", kw: ["hire", "rent", "rental", "renting", "equipment", "tool hire", "plant hire", "trailer", "portable toilet", "toilet"],
      a: ["Our hire range has about 150 items: cleaning, gardening, power tools, concreting, compaction & earthmoving, generators, ladders & access, plumbing, trailers and more. Most show a daily, weekend and weekly rate (AUD, no GST added); price, availability and terms are confirmed when you call.", "Pickup or delivery: to be confirmed. Silver and Gold members get 5% or 10% off hire."],
      links: [["See the hire range", "hire.html"]], call: true },
    { id: "tradie", chip: "Find a tradie", kw: ["tradie", "tradies", "tradesman", "tradesperson", "plumber", "electrician", "carpenter", "painter", "handyman", "builder", "quote for", "find someone"],
      a: ["Post your job free (free account) and local tradies can quote. Tradies come to your place. Free accounts pay a connection fee of $9.95–$59.95 when they accept a quote; members pay nothing."],
      links: [["Find a tradie", "jobs.html#tradie"], ["Post a job", "jobs.html#post"]] },
    { id: "post_job", chip: "Post a job", kw: ["post a job", "post job", "job", "jobs", "tender", "tenders", "get quotes", "get a quote"],
      a: ["Posting a job needs a free account. Free and Basic accounts can have up to 5 open jobs; Bronze and higher are unlimited. A connection fee of $9.95–$59.95 applies when a free account accepts a quote, waived for members.", "Online posting is coming soon. Until then we can set it up with you by phone."],
      links: [["Post a job", "jobs.html#post"], ["How job fees work", "jobs.html#fees"]], call: true },
    { id: "post_listing", chip: "Post a listing", kw: ["post a listing", "listing", "advertise", "advertising", "post an ad", "ad", "list my", "put up"],
      a: ["You can post a job (free account), sell items (Basic or higher), advertise a trade or service and quote on jobs (Bronze or higher). Equipment owners will be able to list hire gear once owner hire listings go live.", "Online posting and accounts are coming soon. Call us and we'll set it up with you."],
      links: [["Post a listing", "post.html"]], call: true },
    { id: "scrap", chip: "Scrap metal pickup", kw: ["scrap", "metal", "copper", "brass", "aluminium", "aluminum", "gold", "silver scrap", "catalytic", "converter", "recycling", "scrap car", "car removal"],
      a: ["We come to you to collect scrap metal: gold, silver, copper, brass, aluminium, catalytic converters and more. You get a quote first, then pickup at a time that suits you. Call to check your suburb."],
      links: [["Scrap metal pickup", "services.html#scrap"]], call: true },
    { id: "fees_membership", chip: "Fees & membership", kw: ["membership", "member", "price", "prices", "pricing", "cost", "costs", "how much", "fee", "fees", "basic", "bronze", "gold plan", "silver plan", "subscription", "annual", "commission", "service fee"],
      a: ["Memberships (AUD per month): Basic $4.99, Bronze $19.99, Silver $39.99, Gold $79.99. Annual billing gives 2 months free.", "Job fees: free accounts pay a connection fee of $9.95–$59.95 per job, waived for members. Workers pay a service fee of 20%, 18.5%, 14.9% or 12.5% on jobs won.", "Accounts and payments are coming soon, so nobody can be charged yet."],
      links: [["Compare memberships", "membership.html"], ["How job fees work", "jobs.html#fees"]] },
    { id: "contact_hours", chip: "Contact & hours", kw: ["hours", "open", "opening", "close", "closed", "when can i call", "phone", "call", "contact", "number", "email", "e-mail", "mail", "talk", "speak", "24/7", "weekend", "saturday", "sunday"],
      a: function () { return [hoursLine(), "You can also email us at " + EMAIL + ". The online enquiry form is coming soon."]; },
      links: [["Email us", "mailto:" + EMAIL], ["Contact page", "contact.html"]], call: true },
    { id: "featured", kw: ["featured", "feature my", "top of", "boost", "promote"],
      a: ["A featured listing shows at the top of its category results with a Featured badge. Silver includes 2 a month and Gold 10 a month plus top placement. It's planned and arrives with accounts."],
      links: [["Featured listings", "membership.html#featured-listings"]] },
    { id: "company", kw: ["abn", "gst", "company", "business details", "who are you", "pty ltd", "legit"],
      a: ["Real Time Traders Pty Ltd, ABN 54 642 170 438, based in Brisbane, QLD. We're not registered for GST."],
      links: [["Contact page", "contact.html"]] },
    { id: "community", kw: ["community", "donate", "donation", "give away", "free stuff", "need help", "can't afford"],
      a: ["The Community page is for giving unwanted items to people who need them, or asking for help. Donating and requesting are included with Bronze and higher."],
      links: [["Community", "community.html"]] },
    { id: "location", kw: ["where are you", "location", "address", "located", "brisbane", "suburb", "area", "deliver", "delivery", "come to me", "come to you"],
      a: ["We're based in Brisbane and serve South East Queensland. We come to you to collect scrap metal, and tradies come to your place. For hire, pickup or delivery is to be confirmed."],
      links: [["Contact page", "contact.html"]], call: true },
    { id: "accounts", kw: ["account", "sign up", "signup", "register", "login", "log in", "join", "password"],
      a: ["Accounts are coming soon. For now you can preview the site as a free account or member, but no account is created and nobody is charged. Browsing needs no account."],
      links: [["Memberships", "membership.html"]] },
    { id: "booking", kw: ["book", "booking", "reserve", "appointment", "message you", "leave a message"],
      a: ["I can't take bookings or messages. To book a pickup, hire or service, please call us during phone hours."],
      links: [["Contact page", "contact.html"]], call: true },
    { id: "greeting", kw: ["hi", "hello", "hey", "g'day", "gday", "good morning", "good afternoon", "thanks", "thank you"],
      a: ["Hi! Pick a topic below or type a question, for example \"how much is membership\"."], links: [] }
  ];

  /* ---------- hire items (data/hire-items.json, loaded on demand) ---------- */
  var FALLBACK_HIRE = ["pressure washer", "carpet cleaner", "wet & dry vacuum", "steam cleaner", "floor scrubber", "lawnmower", "whipper snipper", "hedge trimmer", "leaf blower", "chainsaw", "drill", "impact driver", "grinder", "sander", "demolition hammer", "ladder", "generator", "extension lead", "portable toilet", "trailer"];
  var hireItems = null, hirePromise = null;
  function loadHire() {
    if (hirePromise) return hirePromise;
    hirePromise = fetch("data/hire-items.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { var list = d && (d.items || d); hireItems = Array.isArray(list) ? list : []; return hireItems; })
      .catch(function () { hireItems = []; return hireItems; });
    return hirePromise;
  }
  function stem(w) { return w.replace(/(es|s)$/, ""); }
  function words(s) { return String(s).toLowerCase().replace(/[^a-z0-9&\/ ]+/g, " ").split(/\s+/).filter(Boolean); }
  var STOP = { hire: 1, rent: 1, do: 1, you: 1, a: 1, an: 1, the: 1, have: 1, any: 1, can: 1, i: 1, kit: 1, and: 1, "&": 1, or: 1, for: 1, of: 1, with: 1, xr: 1, "18v": 1, tool: 1, tools: 1 };
  function findHire(q) {
    var qs = words(q).filter(function (w) { return !STOP[w]; }).map(stem).filter(function (w) { return w.length > 2; });
    if (!qs.length) return [];
    var list = hireItems && hireItems.length ? hireItems : FALLBACK_HIRE.map(function (n) { return { name: n }; });
    var scored = [];
    list.forEach(function (it) {
      var ws = words((it.name || "") + " " + (it.type || "") + " " + (it.category || "")).filter(function (w) { return !STOP[w]; }).map(stem);
      var hits = 0;
      qs.forEach(function (w) { if (ws.indexOf(w) >= 0) hits++; });
      if (hits) scored.push([hits, it]);
    });
    if (!scored.length) return [];
    var best = Math.max.apply(null, scored.map(function (x) { return x[0]; }));
    return scored.filter(function (x) { return x[0] === best; }).map(function (x) { return x[1]; });
  }
  function money(v) { v = Number(v); return "$" + (v % 1 ? v.toFixed(2) : String(v)); }
  function rateText(it) {
    if (it.rates && it.rates.day != null) {
      var extra = [];
      if (it.rates.weekend != null) extra.push("weekend " + money(it.rates.weekend));
      if (it.rates.week != null) extra.push("week " + money(it.rates.week));
      return "from " + money(it.rates.day) + "/day" + (extra.length ? " (" + extra.join(", ") + ")" : "");
    }
    if (it.flat != null) return money(it.flat) + " per hire (flat rate)";
    return "price on request";
  }

  /* ---------- matcher ---------- */
  function norm(s) { return " " + String(s).toLowerCase().replace(/[^a-z0-9'&\/$ ]+/g, " ").replace(/\s+/g, " ").trim() + " "; }
  function match(q) {
    var n = norm(q), best = null, score = 0;
    ENTRIES.forEach(function (e) {
      var s = 0;
      e.kw.forEach(function (k) { if (n.indexOf(" " + k + " ") >= 0 || (k.length > 4 && n.indexOf(" " + k) >= 0)) s += k.split(" ").length; });
      if (s > score) { score = s; best = e; }
    });
    return best;
  }

  /* ---------- UI ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function svg(name) {
    var ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg"), u = document.createElementNS(ns, "use");
    s.setAttribute("class", "icon"); s.setAttribute("aria-hidden", "true"); u.setAttribute("href", "#" + name); s.appendChild(u); return s;
  }

  var launcher, panel, log, input, opened = false, greeted = false;

  function build() {
    launcher = el("button", "chat-launcher");
    launcher.type = "button";
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "rtt-chat");
    launcher.setAttribute("aria-label", "Ask us: open the Real Time Traders assistant (automated)");
    launcher.appendChild(svg("i-message"));
    launcher.appendChild(el("span", "chat-launcher__label", "Ask us"));

    panel = el("div", "chat-panel");
    panel.id = "rtt-chat";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-labelledby", "rtt-chat-title");
    panel.hidden = true;

    var head = el("div", "chat-panel__head");
    var h = el("h2", null, "Real Time Traders assistant (automated)"); h.id = "rtt-chat-title";
    var close = el("button", "chat-panel__close"); close.type = "button"; close.setAttribute("aria-label", "Close assistant"); close.appendChild(svg("i-close"));
    close.addEventListener("click", function () { setOpen(false); });
    head.appendChild(h); head.appendChild(close);

    log = el("div", "chat-log");
    log.setAttribute("role", "log");
    log.setAttribute("aria-live", "polite");
    log.setAttribute("aria-label", "Conversation");
    log.tabIndex = 0;

    var chips = el("div", "chat-chips");
    chips.setAttribute("role", "group");
    chips.setAttribute("aria-label", "Suggested topics");
    ENTRIES.forEach(function (e) {
      if (!e.chip) return;
      var c = el("button", "chat-chip", e.chip); c.type = "button";
      c.addEventListener("click", function () { userSays(e.chip); answer(e); });
      chips.appendChild(c);
    });

    var form = el("form", "chat-form");
    form.setAttribute("autocomplete", "off");
    var lab = el("label", "sr-only", "Type your question"); lab.htmlFor = "rtt-chat-input";
    input = el("input"); input.id = "rtt-chat-input"; input.type = "text"; input.maxLength = 200; input.placeholder = "Type a question…";
    var send = el("button", "btn btn--primary btn--sm", "Send"); send.type = "submit";
    form.appendChild(lab); form.appendChild(input); form.appendChild(send);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var q = input.value.trim();
      if (!q) return;
      input.value = "";
      userSays(q);
      respond(q);
    });

    var note = el("p", "chat-note", "Automated answers from this website only. It can't take bookings or messages.");

    panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form); panel.appendChild(note);
    document.body.appendChild(panel);
    document.body.appendChild(launcher);

    launcher.addEventListener("click", function () { setOpen(!opened); });
    panel.addEventListener("keydown", function (ev) { if (ev.key === "Escape") { ev.stopPropagation(); setOpen(false); } });
  }

  function setOpen(o) {
    opened = o;
    panel.hidden = !o;
    launcher.setAttribute("aria-expanded", String(o));
    launcher.setAttribute("aria-label", "Ask us: " + (o ? "close" : "open") + " the Real Time Traders assistant (automated)");
    if (o) {
      if (!greeted) { greeted = true; botSays(["How can I help you today?"], []); }
      input.focus();
    } else {
      launcher.focus();
    }
  }

  function userSays(text) { var m = el("div", "chat-msg chat-msg--user", text); log.appendChild(m); scroll(); }
  function botSays(paras, links, call) {
    var m = el("div", "chat-msg chat-msg--bot");
    paras.forEach(function (p) { m.appendChild(el("p", null, p)); });
    if ((links && links.length) || call) {
      var wrap = el("div", "chat-msg__links");
      if (call) { var c = el("a", "chat-call", "Call us"); c.href = TEL; wrap.appendChild(c); }
      (links || []).forEach(function (l) { var a = el("a", null, l[0]); a.href = l[1]; wrap.appendChild(a); });
      m.appendChild(wrap);
    }
    log.appendChild(m); scroll();
  }
  function scroll() { log.scrollTop = log.scrollHeight; }

  function answer(e) {
    var paras = typeof e.a === "function" ? e.a() : e.a.slice();
    if (e.call && e.id !== "contact_hours") paras.push(hoursLine());
    botSays(paras, e.links, e.call);
  }

  function respond(q) {
    var n = norm(q);
    var hireish = /\b(hire|rent|rental|have)\b/.test(n);
    var entry = match(q);
    var finish = function () {
      var found = (hireish || !entry) ? findHire(q) : [];
      if (found.length) {
        var lines = found.slice(0, 3).map(function (it) { return cap(it.name) + ": " + rateText(it) + "."; });
        var more = found.length > 3 ? " We have " + found.length + " matching items; see the hire range for them all." : "";
        botSays(["Yes, it's in our hire range."].concat(lines).concat(["Prices in AUD, no GST added. Call us to check availability; price and terms are confirmed when you call." + more, hoursLine()]),
          [["See the hire range", "hire.html"]], true);
        return;
      }
      if (hireish && (!entry || entry.id === "hire")) {
        botSays(["I couldn't find that item in our hire list, so I don't know if we have it. Please call us and we'll check for you.", hoursLine()], [["See the hire range", "hire.html"], ["Contact page", "contact.html"]], true);
        return;
      }
      if (entry) { answer(entry); return; }
      botSays(["Sorry, I don't know the answer to that. I can only answer from what's on this website.", "Please call us and a real person can help. " + hoursLine()], [["Contact page", "contact.html"]], true);
    };
    if (hireish || !entry) loadHire().then(finish); else finish();
  }
  function cap(s) { s = String(s); return s.charAt(0).toUpperCase() + s.slice(1); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
