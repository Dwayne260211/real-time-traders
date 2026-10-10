# Image credits

Photos added on 10 October 2026 (AEST) for the client-feedback update (brighter homepage cover, no wreck imagery).

All are from **Unsplash** under the **Unsplash License** (https://unsplash.com/license): free to use, including commercially, with no permission or attribution required. They are credited here so the source can be traced. Each photo page showed "Free to use under the Unsplash License" when checked on 10 October 2026. None of them are Unsplash+ images.

| Used as | File(s) in `images/` | Photo | Photographer | Source URL |
|---|---|---|---|---|
| Homepage cover collage: Buy & Sell (left panel) | `hero-collage-{800,1200,1920}.{webp,jpg}` | Shoppers at an outdoor market (Glebe, NSW, Australia) | Andy Wang (@space_launch_system) | https://unsplash.com/photos/a-group-of-people-at-an-outdoor-market-T9-dPgkiOhs |
| Homepage cover collage: tradies/services (top right) | same collage | Smiling worker in hi-vis (Greystanes, NSW, Australia) | Nihar Reddy Jangam (@niharjreddy) | https://unsplash.com/photos/man-in-orange-shirt-smiles-at-another-AmdiSUONPms |
| Homepage cover collage: equipment hire (bottom right) | same collage | Yellow DeWalt cordless drills on a table | rakhmat suwandi (@rakhmatsuwandi) | https://unsplash.com/photos/yellow-dewalt-hand-drills-on-table-wDC-SOW6AcM |
| Scrap metal card (home teaser, services.html scrap panel), replacing the crushed-car pile | `photo-scrap-metal.{webp,jpg}` | A box of old copper and brass metal fittings | Austin Guhl (@aguhl0614) | https://unsplash.com/photos/a-box-filled-with-lots-of-old-metal-items-YurpIzzP068 |
| Scrap car pickup / towing (services.html), replacing the crane-grab wreck photo | `photo-tow-truck.{webp,jpg}` | A blue car being loaded onto a flatbed tow truck | fr0ggy5 (@fr0ggy5_) | https://unsplash.com/photos/a-blue-car-being-loaded-onto-a-flatbed-truck-UanilB8ZktA |

## How the files were made
- The collage is built by `rtt-tools/hero_collage.py` (outside the repo): three panels on a navy (#011839) background, exported as WebP (quality 70) and progressive JPG (quality 76) at 1920, 1200 and 800 px wide (1920×1280 master, 3:2).
- The homepage uses `<picture>` with a WebP `srcset` and a JPG fallback `srcset`; `sizes` is `(min-width: 1280px) 52vw, (min-width: 1024px) 50vw, 100vw`.
- Hero text sits on solid navy. On desktop the photo fades into navy with a gradient on its left edge, so white hero text keeps well above WCAG AA contrast (about 16:1).

## Removed
- `photo-scrap-pile.*` (pile of crushed cars) and `photo-scrap-car.*` (crane grab lifting wrecked cars) were removed because they made the site look like a wrecking business.

Images that were already on the site before this update are not covered by this file.
