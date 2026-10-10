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

PHOTOS = {  # item id -> (photo name in images/hire, alt text). Sizes come from images/hire/sizes.json;
           # sources and licences are listed in docs/image-credits.md and on credits.html.
    'pressure-washer-petrol-3000psi': ('pressure-washer', 'A worker cleaning paving with a pressure washer surface cleaner'),
    'pressure-washer-rotary-surface-cleaner-attachment': ('pressure-washer', 'A worker cleaning paving with a pressure washer surface cleaner'),
    'pressure-washer-petrol-2000-2500psi': ('pressure-washer', 'A worker cleaning paving with a petrol pressure washer'),
    'pressure-washer-petrol-4000psi': ('pressure-washer', 'A worker cleaning paving with a petrol pressure washer'),
    'hedge-trimmer': ('hedge-trimmer', 'A person trimming a tall hedge'),
    'leaf-blower': ('leaf-blower', 'A man using a leaf blower in a yard'),
    'line-trimmer-whipper-snipper-petrol': ('line-trimmer', 'A man trimming long grass with a line trimmer'),
    'cordless-drill': ('drill', 'A red cordless drill'),
    'angle-grinder-125mm': ('angle-grinder', 'An angle grinder cutting metal with sparks'),
    'angle-grinder-230mm': ('angle-grinder', 'An angle grinder cutting metal with sparks'),
    'circular-saw-235mm': ('circular-saw', 'A circular saw cutting timber'),
    'extension-ladder-6-6-5m': ('ladder', 'A ladder leaning against a concrete wall'),
    'extension-ladder-8-8-5m': ('ladder', 'A ladder leaning against a concrete wall'),
    'hand-trolley-sack-truck': ('hand-truck', 'A man moving a drum with a hand trolley'),
    'mini-excavator-1-7-1-8t': ('mini-excavator', 'A small yellow mini excavator on grass'),
    'portable-toilet-construction-event': ('portable-toilet', 'Two green portable toilets'),
    'pressure-washer-electric': ('pressure-washer-electric', 'Electric pressure washer'),
    'carpet-cleaner-hot-water-extraction': ('carpet-cleaner', 'Carpet cleaning extraction machine'),
    'carpet-dryer-air-mover': ('carpet-dryer', 'Carpet dryer air mover'),
    'wet-dry-vacuum-industrial': ('wet-dry-vacuum', 'Industrial wet and dry vacuum cleaner'),
    'h-class-concrete-dust-vacuum': ('wet-dry-vacuum', 'Industrial wet and dry vacuum cleaner'),
    'steam-cleaner': ('steam-cleaner', 'Steam cleaner'),
    'floor-scrubber-walk-behind-compact': ('floor-scrubber', 'Walk-behind floor scrubber'),
    'floor-polisher-rotary-machine-400mm': ('floor-polisher', 'Rotary floor polisher'),
    'dehumidifier': ('dehumidifier', 'Portable dehumidifier'),
    'floor-sander-drum-belt': ('floor-sander', 'Drum floor sander'),
    'tile-saw-electric-wet-bench-table': ('tile-saw', 'Electric wet tile saw'),
    'tile-cutter-manual-600mm': ('tile-cutter', 'Manual tile cutter'),
    'airless-paint-sprayer': ('airless-sprayer', 'Airless paint sprayer'),
    'orbital-sander-hand-held': ('orbital-sander', 'Hand-held orbital sander'),
    'belt-sander-100mm': ('belt-sander', 'Belt sander'),
    'heat-gun-paint-stripper': ('heat-gun', 'Heat gun'),
    'lawn-mower-push-petrol': ('lawn-mower', 'Petrol push lawn mower'),
    'chainsaw-petrol-18-20in': ('chainsaw', 'Petrol chainsaw'),
    'pole-saw-pole-pruner': ('pole-saw', 'Pole saw pruner'),
    'rotary-hoe-tiller': ('rotary-hoe', 'Rotary hoe tiller'),
    'lawn-corer-aerator': ('lawn-aerator', 'Lawn corer aerator'),
    'lawn-roller': ('lawn-roller', 'Lawn roller'),
    'wood-chipper-small-towable-petrol': ('wood-chipper', 'Towable petrol wood chipper'),
    'stump-grinder-small-medium': ('stump-grinder', 'Stump grinder'),
    'log-splitter-hydraulic': ('log-splitter', 'Hydraulic log splitter'),
    'brush-cutter-scrub-cutter-heavy': ('brush-cutter', 'Brush cutter'),
    'knapsack-sprayer': ('knapsack-sprayer', 'Knapsack sprayer'),
    'wheelbarrow': ('wheelbarrow', 'Wheelbarrow'),
    'post-hole-digger-2-person-petrol-auger': ('post-hole-auger', 'Petrol post hole auger'),
    'post-hole-digger-1-person-petrol': ('post-hole-auger', 'Petrol post hole auger'),
    'post-hole-digger-manual': ('post-hole-digger-manual', 'Manual post hole digger'),
    'concrete-cement-mixer-3-cu-ft-electric': ('cement-mixer', 'Electric cement mixer'),
    'cement-mixer-small-2-2-2-cu-ft-electric': ('cement-mixer', 'Electric cement mixer'),
    'power-trowel-walk-behind': ('power-trowel', 'Walk-behind power trowel'),
    'bull-float': ('bull-float', 'Concrete bull float'),
    'concrete-floor-grinder-walk-behind-single-head': ('floor-grinder', 'Walk-behind concrete floor grinder'),
    'concrete-grinder-hand-held': ('concrete-hand-grinder', 'Hand-held concrete grinder'),
    'core-drill-to-100-150mm': ('core-drill', 'Concrete core drill'),
    'wall-chaser-125mm': ('wall-chaser', 'Wall chaser'),
    'plate-compactor-small-40-55kg': ('plate-compactor', 'Plate compactor'),
    'plate-compactor-medium-70-90kg': ('plate-compactor', 'Plate compactor'),
    'plate-compactor-reversible-150kg': ('plate-compactor-reversible', 'Reversible plate compactor'),
    'rammer-jumping-jack': ('rammer', 'Jumping jack rammer'),
    'roller-ride-on-double-drum-1-2-1-5t': ('roller-drum', 'Ride-on double drum roller'),
    'trench-roller-articulated-padfoot': ('trench-roller', 'Padfoot trench roller'),
    'mini-excavator-1t': ('excavator-mini', 'Mini excavator'),
    'excavator-2-5t': ('excavator', 'Compact excavator'),
    'excavator-3-5t': ('excavator', 'Compact excavator'),
    'mini-loader-dingo-kanga-type': ('mini-loader', 'Compact mini loader'),
    'skid-steer-loader-small-wheeled': ('skid-steer', 'Skid steer loader'),
    'tracked-dumper-power-barrow-600kg': ('tracked-dumper', 'Tracked dumper'),
    'trencher-walk-behind-self-propelled': ('trencher', 'Walk-behind trencher'),
    'demolition-hammer-light-electric': ('demolition-hammer', 'Electric demolition hammer'),
    'demolition-hammer-medium-electric-16kg': ('demolition-hammer', 'Electric demolition hammer'),
    'jackhammer-breaker-heavy-electric-30kg': ('demolition-hammer', 'Electric demolition hammer'),
    'jackhammer-on-trolley-tile-floor-removal': ('demolition-hammer', 'Electric demolition hammer'),
    'demolition-cut-off-saw-petrol-350mm': ('cut-off-saw-petrol', 'Petrol demolition cut-off saw'),
    'rotary-hammer-drill-light-sds-plus': ('rotary-hammer', 'Rotary hammer drill'),
    'rotary-hammer-drill-heavy-sds-max': ('rotary-hammer', 'Rotary hammer drill'),
    'hammer-percussion-drill-13mm': ('hammer-drill', 'Hammer drill'),
    'electric-impact-wrench-3-4in': ('impact-wrench', 'Electric impact wrench'),
    'magnetic-base-drill': ('mag-drill', 'Magnetic base drill'),
    'jigsaw': ('jigsaw', 'Jigsaw'),
    'reciprocating-sabre-saw': ('recip-saw', 'Reciprocating sabre saw'),
    'mitre-drop-saw': ('mitre-saw', 'Mitre drop saw'),
    'metal-cut-off-saw-355mm': ('metal-cut-off-saw', 'Metal cut-off saw cutting steel'),
    'electric-planer-hand': ('planer', 'Electric hand planer'),
    'framing-nailer': ('framing-nailer', 'Framing nailer'),
    'finish-brad-nailer': ('brad-nailer', 'Finish brad nailer'),
    'welder-inverter-arc-180a': ('welder', 'Inverter arc welder'),
    'torque-wrench-1-2in-manual': ('torque-wrench', 'Torque wrench'),
    'generator-2kva': ('generator', 'Portable petrol generator'),
    'generator-5kva': ('generator', 'Portable petrol generator'),
    'generator-6-7kva': ('generator', 'Portable petrol generator'),
    'generator-10kva': ('generator', 'Portable petrol generator'),
    'generator-3kva-inverter': ('generator-inverter', 'Inverter generator'),
    'extension-lead-15a-20-30m': ('extension-lead', 'Extension lead on a cable reel'),
    'step-ladder-1-8m': ('step-ladder', 'Aluminium step ladder'),
    'mobile-aluminium-scaffold-single-width-4-4-5m': ('scaffold', 'Mobile aluminium scaffold tower'),
    'acrow-prop-steel-no-2-3': ('acrow-prop', 'Steel acrow props'),
    'drain-cleaner-electric-eel': ('drain-eel', 'Electric drain cleaning machine'),
    'drain-snake-cordless': ('drain-snake', 'Hand-held drum drain snake'),
    'drain-jetter-electric-1800psi': ('drain-jetter', 'Drain jetter nozzle spraying water'),
    'pipe-threader-electric-25-50mm': ('pipe-threader', 'Electric pipe threading machine'),
    'pipe-press-crimper-15-50mm': ('pipe-press', 'Pipe press tool'),
    'submersible-pump-50mm-dirty-water': ('submersible-pump', 'Submersible pump'),
    'petrol-transfer-trash-pump-50mm': ('trash-pump', 'Petrol water transfer pump'),
    'pallet-jack-2-5t': ('pallet-jack', 'Pallet jack'),
    'engine-hoist-crane-2t': ('engine-hoist', 'Engine hoist crane'),
    'chain-block-hoist-2t': ('chain-block', 'Chain block hoist'),
    'pedestal-fan-industrial-600-750mm': ('pedestal-fan', 'Industrial pedestal fan'),
    'portable-air-conditioner': ('portable-ac', 'Portable air conditioners'),
    'evaporative-air-cooler': ('evap-cooler', 'Evaporative air cooler'),
    'exhaust-extraction-fan-300mm': ('extraction-fan', 'Portable extraction fan'),
    'patio-heater-lpg': ('patio-heater', 'Gas patio heater'),
    'laser-level-rotary': ('rotary-laser', 'Rotary laser level on a tripod'),
    'moisture-meter': ('moisture-meter', 'Moisture meters'),
    'laser-distance-measure': ('laser-distance', 'Laser distance measure'),
    'temporary-fence-panel-mesh-2-4x1-8m': ('temp-fence', 'Temporary mesh fence panels'),
    'box-trailer-6x4': ('box-trailer', 'Box trailer'),
    'box-trailer-8x5': ('box-trailer', 'Box trailer'),
    'automatic-dumpy-level': ('dumpy-level', 'Automatic dumpy level'),
}
ITEM_ICON = {"Compaction": "i-compactor", "Air compressors & air tools": "i-compressor", "Heating, cooling & ventilation": "i-fan",
             "Site equipment": "i-fence", "Pumps": "i-droplet"}
OWNER_ITEM = "Cordless 1/2in impact wrench (18V)"

SIZES = json.load(open(os.path.join(ROOT, "images", "hire", "sizes.json")))      # photo -> [[file, w, h], ...] smallest first
CREDITS = json.load(open(os.path.join(ROOT, "images", "hire", "credits.json")))  # photo -> source, author, licence (also on photo-credits.html)

def photo(name, alt):
    """4:3 WebP photo with a 400w and a larger (usually 800w) variant for srcset."""
    v = SIZES[name]
    return {"src": "images/hire/" + v[-1][0], "srcset": ", ".join("images/hire/%s %dw" % (f, w) for f, w, _h in v),
            "width": v[-1][1], "height": v[-1][2], "alt": alt,
            "credit": {k: CREDITS[name][k] for k in ("author", "license", "license_url", "source")}}

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
        if it["id"] in PHOTOS:
            it["photo"] = photo(*PHOTOS[it["id"]])
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
