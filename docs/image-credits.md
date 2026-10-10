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


## Hire range photos (added 10 October 2026, AEST)

All are from **Unsplash** under the **Unsplash License** (free for commercial use, no attribution required). Each photo page was checked and showed "Free to use under the Unsplash License". They were resized to 640x480 WebP. Hire items without a photo show their category icon instead. No competitor images are used.

| Used as | File | Photo | Photographer (Unsplash handle) | Source URL |
|---|---|---|---|---|
| Pressure washer (petrol ~3000psi) and rotary surface cleaner cards | `images/hire/pressure-washer.webp` | A man in a yellow vest is cleaning a street | @thegraphicspace | https://unsplash.com/photos/a-man-in-a-yellow-vest-is-cleaning-a-street-gal5jKCgDVo |
| Hedge trimmer card | `images/hire/hedge-trimmer.webp` | Person trimming hedge on ladder | @mustaphaturhan | https://unsplash.com/photos/person-trimming-hedge-on-ladder-QnodCAbcqvc |
| Leaf blower card | `images/hire/leaf-blower.webp` | A man with a leaf blower in a yard | @rex_filmer | https://unsplash.com/photos/a-man-with-a-leaf-blower-in-a-yard-20Xibv0RrDo |
| Line trimmer card | `images/hire/line-trimmer.webp` | Man trims overgrown grass with a string trimmer | @kenny_kalix | https://unsplash.com/photos/man-trims-overgrown-grass-with-a-string-trimmer-dvipT9WMNis |
| Cordless drill card | `images/hire/drill.webp` | Red cordless powerdrill | @heyquilia | https://unsplash.com/photos/red-cordless-powerdrill-CuDoRFyTkAQ |
| Angle grinder 125mm card | `images/hire/angle-grinder.webp` | A man working with a grinder on a piece of metal | @heberdavisphotography | https://unsplash.com/photos/a-man-working-with-a-grinder-on-a-piece-of-metal-fZEC4pR4Kpo |
| Circular saw card | `images/hire/circular-saw.webp` | A person using a circular saw to cut a piece of wood | @c3k | https://unsplash.com/photos/a-person-using-a-circular-saw-to-cut-a-piece-of-wood-SdGWs9shP0o |
| Extension ladder card | `images/hire/ladder.webp` | A ladder leaning up against a concrete wall | @nickpage | https://unsplash.com/photos/a-ladder-leaning-up-against-a-concrete-wall-dDZ1JjQXmlY |
| Hand trolley / sack truck card | `images/hire/hand-truck.webp` | Man pushing hand truck with plastic drum | @norevisions | https://unsplash.com/photos/man-pushing-hand-truck-with-plastic-drum-KufOjYrd3mg |
| Mini excavator ~1.7-1.8t card | `images/hire/mini-excavator.webp` | Mini excavator with coiled pipes on grassy ground | @skstrannik | https://unsplash.com/photos/mini-excavator-with-coiled-pipes-on-grassy-ground-L3eEgJT2R-c |
| Portable toilet card | `images/hire/portable-toilet.webp` | A couple of green portable toilets sitting next to each other | @deankfick | https://unsplash.com/photos/a-couple-of-green-portable-toilets-sitting-next-to-each-other-hQZx1b_SJZ4 |

### Owner's own photos
- `images/hire/dewalt-impact-wrench-{1,2,3}.webp`: the owner's DeWalt 18V XR brushless 1/2" impact wrench kit. Photos supplied by the owner (Dwayne), cropped tight on the tool and exported as WebP.
