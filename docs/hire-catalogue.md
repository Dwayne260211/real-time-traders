# Hire catalogue (hire.html)

The hire range on `hire.html` is a static list in **`data/hire-items.json`**, rendered by `js/hire-catalogue.js`. It has search, category filters and a Light / Heavy toggle. The chat assistant (`js/chat.js`) reads the same file to answer "do you hire X?".

## Where the data comes from
- `data/hire-rates-source.json` holds the rates research (148 generic items, with competitor sources). See `docs/hire-rates-research.md`.
- `scripts/build-hire-data.py` turns it into `data/hire-items.json`. Along the way it:
  - smooths rates for consistency (a bigger size never cheaper than a smaller one; day <= weekend <= week; never above the lowest verified competitor price)
  - attaches photos
  - pins the owner's DeWalt kit first

  Run `python3 scripts/build-hire-data.py` after changing the source or the overrides at the top of the script.
- Large licensed or trucked plant is excluded on purpose.

## Editing by hand
You can edit `data/hire-items.json` directly; it must stay valid JSON. Each item looks like this:

```json
{
  "id": "hedge-trimmer",
  "name": "Hedge trimmer",
  "category": "Gardening & landscaping",
  "filter": "gardening",
  "weight": "light",
  "rates": { "day": 40.5, "weekend": 61, "week": 139.5 },
  "photo": { "src": "images/hire/hedge-trimmer.webp", "alt": "A person trimming a tall hedge" }
}
```

What each field does:
- **filter** must be one of the `slug`s in the `filters` list at the top of the file. That decides which category button shows the item. To add a category, add a filter entry with `slug`, `name`, `icon` (an id from the page's SVG sprite, e.g. `i-drill`) and `categories`.
- **weight** is `light` or `heavy`. It drives the Light / Heavy toggle and the "Light tools" / "Heavy tools" sub-groups.
- **rates** are AUD with no GST, and any of day, weekend or week can be left out.
  - Set `"rates": null` to show **Price on request**.
  - For a flat per-hire price, use `"rates": null, "flat": 11.5`. It shows as "$11.50 per hire (flat rate)".
- **photo** is optional; without it the card shows the category icon. Put photos in `images/hire/` as WebP (640x480 works well) and credit them in `docs/image-credits.md`. Only use photos you own or that are licensed for free commercial use (e.g. the Unsplash License). Never copy competitor photos, text or prices.
- **pinned** set to `true` puts the item first, under "Our own gear". **owner_item** set to `true` adds an "Our own kit" badge. `photos` (an array) holds extra photos for later use. `summary` is an optional short line.

Every card shows the rate (or Price on request), "Call to check availability", an **Enquire / Call us** button (tel) and a disabled-looking **Book online: coming soon** label. This note shows above the list: "Prices in AUD. No GST added. Price, availability and terms confirmed when you call." Hire terms stay "to be confirmed" until the owner sets them.

## Live equipment from Supabase
When `js/hire-config.js` is configured, published equipment from Supabase loads after the static list:
- It is merged in first.
- A live item with the same name replaces the static one.
- Live items link to `hire-item.html` for booking.

Old Supabase categories map to the new filters like this: cleaning → cleaning, gardening → gardening, power-tools → drilling, general → access, plant → compaction, trailers → trailers. Rates in the Supabase seed are **not** taken from this file.
