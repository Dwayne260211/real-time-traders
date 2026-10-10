#!/usr/bin/env python3
"""Build photo-credits.html (visible attribution for the hire photos) from images/hire/credits.json and
data/hire-items.json, reusing the header/footer of hire-item.html.  Run after scripts/build-hire-data.py:

  python3 scripts/build-hire-data.py && python3 scripts/build-photo-credits.py
"""
import json, os, re, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
E = html.escape
credits = json.load(open(os.path.join(ROOT, "images", "hire", "credits.json")))
items = json.load(open(os.path.join(ROOT, "data", "hire-items.json")))["items"]
used = {}
for it in items:
    p = it.get("photo")
    if not p: continue
    m = re.match(r"images/hire/(.+?)(-800|-400)?\.webp$", p["src"])
    if m and m.group(1) in credits: used.setdefault(m.group(1), []).append(it["name"])
tpl = open(os.path.join(ROOT, "hire-item.html")).read()
head, rest = tpl.split('<main id="main">', 1)
foot = rest.split("</main>", 1)[1]
T = "Photo credits: hire equipment photos | Real Time Traders"
D = "Sources, photographers and licences for the equipment photos on the Real Time Traders hire pages."
head = re.sub(r"<title>.*?</title>", "<title>%s</title>" % E(T), head)
head = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?title" content=")[^"]*', lambda m: m.group(1) + E(T), head)
head = re.sub(r'(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*', lambda m: m.group(1) + E(D), head)
head = head.replace("hire-item.html", "photo-credits.html").replace("page-hire-item", "page-photo-credits")
foot = re.sub(r'\s*<script src="js/hire-(config|common|item)\.js" defer></script>', "", foot)
rows = []
order = sorted(used, key=lambda k: (credits[k]["license"] == "Unsplash License", used[k][0].lower()))
for k in order:
    c = credits[k]
    rows.append("<tr><td><a href=\"%s\">%s</a><br><small>%s</small></td><td>%s</td><td>%s</td><td><a href=\"%s\" rel=\"license\">%s</a></td></tr>" % (
        E(c["source"]), E(c["title"]), E(c["site"]), "<br>".join(E(n) for n in used[k]), E(c["author"]), E(c["license_url"]), E(c["license"])))
body = '''<main id="main">

    <section class="page-banner">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="hire.html">Hire</a></li><li aria-current="page"><span>Photo credits</span></li></ol></nav>
        <h1>Photo credits</h1>
        <p>Where the equipment photos on our hire pages come from.</p>
      </div>
    </section>

    <section class="section">
      <div class="container credits-page">
        <p>Most hire photos are from <a href="https://commons.wikimedia.org/">Wikimedia Commons</a> and <a href="https://www.flickr.com/">Flickr</a> under Creative Commons licences, and some are from <a href="https://unsplash.com/">Unsplash</a> under the <a href="https://unsplash.com/license">Unsplash License</a>. Photos of our own DeWalt impact wrench kit are our own. Photos show the type of equipment; the actual hire item and brand may differ.</p>
        <p>Changes: every photo was cropped to 4:3 (some tall photos are shown on a blurred copy of the same photo) and resized. CC BY-SA photos are shared under the same licence. Photos marked CC0 are public domain dedications and need no credit; they are listed so you can trace them.</p>
        <div class="table-wrap" tabindex="0" role="region" aria-label="Photo credits table"><table class="credits-table">
          <caption class="sr-only">Hire photo sources and licences</caption>
          <thead><tr><th scope="col">Photo (source)</th><th scope="col">Used for</th><th scope="col">Author</th><th scope="col">Licence</th></tr></thead>
          <tbody>
            %s
          </tbody>
        </table></div>
        <p><a href="hire.html" class="btn btn--light btn--sm"><svg class="icon" aria-hidden="true"><use href="#i-arrow-left"/></svg> Back to hire</a></p>
      </div>
    </section>

  </main>''' % "\n            ".join(rows)
open(os.path.join(ROOT, "photo-credits.html"), "w").write(head + body + foot)
print("photo-credits.html: %d photos" % len(rows))
