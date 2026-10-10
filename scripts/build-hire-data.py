#!/usr/bin/env python3
"""Build data/hire-items.json (the hire catalogue shown on hire.html and used by the chat assistant)
from data/hire-rates-source.json (the rates research, see docs/hire-rates-research.md).

  python3 scripts/build-hire-data.py            # writes data/hire-items.json, prints the smoothing log

Steps:
 1. Read the researched RTT rates (day / weekend / week, AUD, no GST).
 2. Smooth for consistency: within a size family a bigger/heavier item is never cheaper than a smaller one
    for the same period, and day <= weekend <= week. Every rate stays at or below the lowest verified
    competitor price for that period (parsed from the 'basis' text).
 3. Attach photos, the owner's DeWalt kit (pinned first) and write the catalogue file.
You can also edit data/hire-items.json by hand; see docs/hire-catalogue.md."""
import json, re, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "data", "hire-rates-source.json")
OUT = os.path.join(ROOT, "data", "hire-items.json")

FILTERS = [
    ("cleaning", "Cleaning & floor care", "i-washer", ["Cleaning", "Floor care"]),
    ("gardening", "Gardening & landscaping", "i-leaf", ["Gardening & landscaping", "Post holes & augers"]),
    ("drilling", "Drilling & fastening", "i-drill", ["Drilling & fastening", "Air compressors & air tools", "Welding"]),
    ("cutting", "Cutting & sawing", "i-tools", ["Cutting & sawing"]),
    ("sanding", "Sanding & painting", "i-roller", ["Sanding", "Painting & decorating"]),
    ("concreting", "Concreting & demolition", "i-hammer", ["Concreting", "Demolition & breaking"]),
    ("compaction", "Compaction & earthmoving", "i-excavator", ["Compaction", "Earthmoving & trenching"]),
    ("power", "Power, heating & cooling", "i-generator", ["Generators & power", "Heating, cooling & ventilation"]),
    ("access", "Ladders, access & site", "i-ladder", ["Ladders & access", "Site equipment", "Survey & measuring"]),
    ("handling", "Material handling", "i-box", ["Material handling"]),
    ("plumbing", "Plumbing & pumps", "i-droplet", ["Plumbing & drainage", "Pumps"]),
    ("trailers", "Trailers", "i-trailer", ["Trailers"]),
]
CAT2FILTER = {c: f[0] for f in FILTERS for c in f[3]}

# Size families, smallest first.
FAMILIES = [
    ("Pressure washers", ["Pressure washer - electric", "Pressure washer - petrol ~2000-2500psi", "Pressure washer - petrol ~3000psi", "Pressure washer - petrol ~4000psi"]),
    ("Generators", ["Generator ~2kVA", "Generator ~3kVA inverter", "Generator ~5kVA", "Generator ~6-7kVA", "Generator ~10kVA"]),
    ("Excavators", ["Mini excavator ~1t", "Mini excavator ~1.7-1.8t", "Excavator ~2.5t", "Excavator ~3.5t"]),
    ("Plate compactors", ["Plate compactor - small (~40-55kg)", "Plate compactor - medium (~70-90kg)", "Plate compactor - reversible (~150kg)"]),
    ("Demolition hammers / jackhammers", ["Demolition hammer - light (electric)", "Demolition hammer - medium (electric ~16kg)", "Jackhammer / breaker - heavy (electric ~30kg)"]),
    # Cordless 1/2in (18V) and electric 3/4in impact wrenches are different families (owner decision), so not compared.
    ("Rotary hammer drills", ["Rotary hammer drill - light (SDS-plus)", "Rotary hammer drill - heavy (SDS-max)"]),
    ("Angle grinders", ["Angle grinder 125mm", "Angle grinder 230mm"]),
    ("Extension ladders", ["Extension ladder ~6-6.5m", "Extension ladder ~8-8.5m"]),
    ("Cement mixers", ["Cement mixer - small (~2-2.2 cu ft electric)", "Concrete / cement mixer (~3 cu ft electric)"]),
    ("Box trailers", ["Box trailer 6x4", "Box trailer 8x5"]),
    ("Post hole diggers", ["Post hole digger - manual", "Post hole digger - 1-person petrol", "Post hole digger - 2-person petrol auger"]),
    ("Concrete grinders", ["Concrete grinder - hand-held", "Concrete floor grinder (walk-behind, single head)"]),
    ("Floor sanders", ["Floor edger", "Floor sander (drum/belt)"]),
    ("Air compressors", ["Air compressor - small electric (~6-12cfm)"]),
]

PHOTOS = {  # item name -> (file in images/hire, alt text, credit key in docs/image-credits.md)
    "Pressure washer - petrol ~3000psi": ("pressure-washer.webp", "A worker cleaning paving with a pressure washer surface cleaner"),
    "Pressure washer rotary surface cleaner (attachment)": ("pressure-washer.webp", "A worker cleaning paving with a pressure washer surface cleaner"),
    "Hedge trimmer": ("hedge-trimmer.webp", "A person trimming a tall hedge"),
    "Leaf blower": ("leaf-blower.webp", "A man using a leaf blower in a yard"),
    "Line trimmer / whipper snipper (petrol)": ("line-trimmer.webp", "A man trimming long grass with a line trimmer"),
    "Cordless drill": ("drill.webp", "A red cordless drill"),
    "Angle grinder 125mm": ("angle-grinder.webp", "An angle grinder cutting metal with sparks"),
    "Circular saw (~235mm)": ("circular-saw.webp", "A circular saw cutting timber"),
    "Extension ladder ~6-6.5m": ("ladder.webp", "A ladder leaning against a concrete wall"),
    "Hand trolley / sack truck": ("hand-truck.webp", "A man moving a drum with a hand trolley"),
    "Mini excavator ~1.7-1.8t": ("mini-excavator.webp", "A small yellow mini excavator on grass"),
    "Portable toilet (construction / event)": ("portable-toilet.webp", "Two green portable toilets"),
}
ITEM_ICON = {"Compaction": "i-compactor", "Air compressors & air tools": "i-compressor", "Heating, cooling & ventilation": "i-fan",
             "Site equipment": "i-fence", "Pumps": "i-droplet"}
OWNER_ITEM = "Cordless 1/2in impact wrench (18V)"

def slug(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")

def floor50(x):
    return math.floor(x * 2 + 1e-9) / 2

def caps(item):
    """Lowest verified competitor price per period (None = no direct competitor price)."""
    b = item["basis"]; c = {"day": None, "weekend": None, "week": None}
    m = re.search(r"10% below .*? day \$([\d,.]+)", b)
    if m: c["day"] = float(m.group(1).replace(",", ""))
    m = re.search(r"week: 10% below .*? \$([\d,.]+)", b)
    if m: c["week"] = float(m.group(1).replace(",", ""))
    m = re.search(r"weekend: 10% below .*? \$([\d,.]+)", b)
    if m: c["weekend"] = float(m.group(1).replace(",", ""))
    m = re.search(r"10% below .*? \$([\d,.]+) \(same for every period\)", b)
    if m: c = {k: float(m.group(1).replace(",", "")) for k in c}
    if c["weekend"] is None and c["week"] is not None: c["weekend"] = c["week"]  # derived weekend may never exceed the competitor week
    return c

def money(v):
    return "$%.2f" % v

def main():
    src = json.load(open(SRC))
    by = {i["item"]: i for i in src}
    R = {i["item"]: {"day": i["rtt_day"], "weekend": i["rtt_weekend"], "week": i["rtt_week"]} for i in src}
    CAP = {i["item"]: caps(i) for i in src}
    log = []

    def setv(name, per, new, why):
        old = R[name][per]
        if old == new: return
        cap = CAP[name][per]
        assert cap is None or new <= cap + 1e-9, (name, per, new, cap)
        R[name][per] = new
        log.append((name, per, old, new, why))

    def smooth(periods):
        for _ in range(10):
            changed = len(log)
            for fam, names in FAMILIES:
                names = [n for n in names if n in R]
                for per in periods:
                    for i in range(1, len(names)):
                        small, big = names[i - 1], names[i]
                        s, b = R[small][per], R[big][per]
                        if s is None or b is None or b >= s: continue
                        cap = CAP[big][per]
                        if cap is None or s <= cap:
                            setv(big, per, s, "%s: raised to match the smaller %s" % (fam, small))
                        else:
                            setv(small, per, b, "%s: lowered so it sits at or under the larger %s" % (fam, big))
            for name, r in R.items():
                if r["day"] is not None and r["week"] < r["day"]:
                    setv(name, "day", r["week"], "day lowered to the week rate (day <= week)")
            if len(log) == changed: break

    # 1) day and week rates
    smooth(("day", "week"))
    # 2) derived weekend rates follow the (possibly smoothed) day rate: 1.5x day, capped at the week rate
    day_changed = {n for (n, per, _o, _n, _w) in log if per == "day"}
    for i in src:
        n = i["item"]; r = R[n]
        if n not in day_changed or "weekend_derived_1.5x_day" not in i["derived_flags"]: continue
        want = min(floor50(r["day"] * 1.5), r["week"])
        if want != r["weekend"]:
            setv(n, "weekend", want, "derived weekend recalculated as 1.5x the smoothed day rate (capped at the week rate)")
    # 3) weekend rates, then day <= weekend <= week
    smooth(("weekend",))
    for name, r in R.items():
        if r["day"] is None: continue
        if r["weekend"] < r["day"]: setv(name, "weekend", r["day"], "weekend raised to the day rate (day <= weekend)")
        if r["weekend"] > r["week"]: setv(name, "weekend", r["week"], "weekend lowered to the week rate (weekend <= week)")

    # final checks
    for fam, names in FAMILIES:
        names = [n for n in names if n in R]
        for per in ("day", "weekend", "week"):
            for i in range(1, len(names)):
                s, b = R[names[i - 1]][per], R[names[i]][per]
                assert s is None or b is None or b >= s, (fam, per, names[i - 1], names[i])
    for n, r in R.items():
        if r["day"] is not None:
            assert r["day"] <= r["weekend"] <= r["week"], (n, r)
            for per in r:
                assert CAP[n][per] is None or r[per] <= CAP[n][per] + 1e-9

    items = []
    for i in src:
        n = i["item"]; r = R[n]
        flat = "flat_per_hire_rate_mirrors_competitor" in i["derived_flags"]
        it = {"id": slug(n), "name": n, "category": i["category"], "filter": CAT2FILTER[i["category"]], "weight": i["weight"]}
        if r["day"] is None:
            it["rates"] = None
        elif flat:
            it["rates"] = None; it["flat"] = r["day"]
        else:
            it["rates"] = {"day": r["day"], "weekend": r["weekend"], "week": r["week"]}
        if n in PHOTOS:
            f, alt = PHOTOS[n]
            it["photo"] = {"src": "images/hire/" + f, "alt": alt}
        if i["category"] in ITEM_ICON: it["icon"] = ITEM_ICON[i["category"]]
        if n == OWNER_ITEM:
            it.update({"id": "dewalt-18v-xr-impact-wrench-kit", "name": 'DeWalt 18V XR brushless 1/2" impact wrench kit (5.0Ah battery + charger)',
                       "type": n, "pinned": True, "owner_item": True,
                       "summary": "Our own kit: cordless 1/2\" impact wrench with a 5.0Ah battery and charger.",
                       "photo": {"src": "images/hire/dewalt-impact-wrench-1.webp", "alt": "DeWalt 18V XR brushless impact wrench with 5.0Ah battery"},
                       "photos": [{"src": "images/hire/dewalt-impact-wrench-%d.webp" % k, "alt": a} for k, a in
                                  [(1, "DeWalt 18V XR brushless impact wrench with 5.0Ah battery"),
                                   (2, "The DeWalt impact wrench, 5.0Ah battery and charger"),
                                   (3, "The DeWalt impact wrench kit laid out: wrench, battery and charger")]]})
        items.append(it)
    items.sort(key=lambda x: (not x.get("pinned", False)))
    out = {
        "updated": "2026-10-10",
        "currency": "AUD",
        "note": "Prices in AUD. No GST added. Price, availability and terms confirmed when you call.",
        "filters": [{"slug": f[0], "name": f[1], "icon": f[2], "categories": f[3]} for f in FILTERS],
        "items": items,
    }
    json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
    print("wrote %s (%d items)" % (OUT, len(items)), file=sys.stderr)
    print("| Item | Period | Researched RTT | Published | Smoothed for consistency |")
    print("|---|---|---|---|---|")
    for n, per, old, new, why in log:
        print("| %s | %s | %s | %s | smoothed for consistency: %s |" % (n, per, money(old), money(new), why))

if __name__ == "__main__":
    main()
