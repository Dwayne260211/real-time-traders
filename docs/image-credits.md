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

All are from **Unsplash** under the **Unsplash License** (free for commercial use, no attribution required). Each photo page was checked and showed "Free to use under the Unsplash License". They were resized to 640x480 WebP (plus a 400x300 variant, `*-400.webp`, for `srcset`). Hire items without a photo show their category icon instead. No competitor images are used.

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


## Hire range photos from Wikimedia Commons and Flickr (added 10 October 2026, AEST)

These photos are under Creative Commons licences that allow commercial use: CC0, CC BY or CC BY-SA. Each one was found through the Wikimedia Commons API or Openverse (api.openverse.org), checked by eye to make sure it really shows that type of equipment, and checked for faces and competitor branding. No images come from hire companies (Kennards, Coates and so on), retailers (Bunnings and so on) or manufacturer websites; candidates uploaded by dealers or hire firms were rejected.

**Attribution:** CC BY and CC BY-SA need visible credit. The hire page (`hire.html`) has a "Photo credits" link to `photo-credits.html`, which lists every photo with its source, author and licence. Each catalogue item page (`hire-item.html?item=...`) also shows a one-line credit under its photo.

**Changes made:** every photo was cropped to 4:3 and resized to WebP at 400px and 800px wide (smaller originals were not upscaled: their largest file is the original width). Some tall photos are shown whole on a blurred copy of the same photo instead of being cropped. The generator photo was cropped to remove the camera date stamp. Under CC BY-SA, these adapted photos are shared under the same licence.

**How it maps:** `scripts/build-hire-data.py` has `PHOTOS` (item id to photo name and alt text). It reads the sizes from `images/hire/sizes.json` and the credits from `images/hire/credits.json`, and writes `photo` (`src`, `srcset`, `width`, `height`, `alt`, `credit`) into `data/hire-items.json`. `scripts/build-photo-credits.py` then rebuilds `photo-credits.html`. Items in the same size family share a photo.

Licence counts for these 89 photos: CC BY-SA 4.0: 34, CC BY-SA 3.0: 26, CC BY 2.0: 8, CC0: 6, CC BY 4.0: 5, CC BY 3.0: 4, CC BY-SA 2.0: 3, CC BY-SA 2.0 fr: 1, CC BY-SA 2.0 ca: 1, CC BY 3.0 us: 1.

| Used for | Files | Photo | Site | Author | Licence | Source page |
|---|---|---|---|---|---|---|
| Acrow prop (steel, no.2-3) | `images/hire/acrow-prop-{400,800}.webp` | Bauma13 (37).jpeg | Wikimedia Commons | JoKalliauer | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Bauma13_(37).jpeg |
| Airless paint sprayer | `images/hire/airless-sprayer-{400,800}.webp` | Pompa-Airless-TECNOVER-Testarossa-Superquattromila.jpg | Wikimedia Commons | Steve Purpy | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Pompa-Airless-TECNOVER-Testarossa-Superquattromila.jpg |
| Automatic (dumpy) level | `images/hire/dumpy-level-{400,800}.webp` | Niwelator PZO Ni30-20.JPG | Wikimedia Commons | Flyz1 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Niwelator_PZO_Ni30-20.JPG |
| Belt sander (100mm) | `images/hire/belt-sander-{400,800}.webp` | Belt sander bosch.jpg | Wikimedia Commons | Luigi Zanasi | [CC BY-SA 2.0 ca](https://creativecommons.org/licenses/by-sa/2.0/ca/deed.en) | https://commons.wikimedia.org/wiki/File:Belt_sander_bosch.jpg |
| Box trailer 6x4; Box trailer 8x5 | `images/hire/box-trailer-{400,800}.webp` | 12' Box Trailer $500 - SOLD | Flickr | Northwest Rafting Company | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | https://www.flickr.com/photos/23299229@N06/4665994311 |
| Brush cutter / scrub cutter (heavy) | `images/hire/brush-cutter-{400,800}.webp` | Handy mower.jpg | Wikimedia Commons | Green | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | https://commons.wikimedia.org/wiki/File:Handy_mower.jpg |
| Bull float | `images/hire/bull-float-{400,800}.webp` | Blue Grass Chemical Agent-Destruction Pilot Plant Munitions Demilitarization Building Finishing Concrete (4604675852).jpg | Wikimedia Commons | PEO ACWA | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | https://commons.wikimedia.org/wiki/File:Blue_Grass_Chemical_Agent-Destruction_Pilot_Plant_Munitions_Demilitarization_Building_Finishing_Concrete_(4604675852).jpg |
| Carpet cleaner (hot-water extraction) | `images/hire/carpet-cleaner-{400,800}.webp` | Floor cleaner inside Sullivan Hall.jpg | Wikimedia Commons | Ktr101 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Floor_cleaner_inside_Sullivan_Hall.jpg |
| Carpet dryer / air mover | `images/hire/carpet-dryer-{400,800}.webp` | XPower air mover sits in the corner.jpg | Wikimedia Commons | Ser Amantio di Nicolao | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | https://commons.wikimedia.org/wiki/File:XPower_air_mover_sits_in_the_corner.jpg |
| Chain block / hoist (~2t) | `images/hire/chain-block-{400,800}.webp` | Chain-block-takel.jpg | Wikimedia Commons | Aldifahri16 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Chain-block-takel.jpg |
| Chainsaw - petrol (~18-20in) | `images/hire/chainsaw-{400,800}.webp` | Blocco catena motosega per wiki5.jpg | Wikimedia Commons | Verdealberi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Blocco_catena_motosega_per_wiki5.jpg |
| Concrete / cement mixer (~3 cu ft electric); Cement mixer - small (~2-2.2 cu ft electric) | `images/hire/cement-mixer-{400,800}.webp` | Mini concrete mixer.jpg | Wikimedia Commons | Al Riaz Uddin | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Mini_concrete_mixer.jpg |
| Concrete floor grinder (walk-behind, single head) | `images/hire/floor-grinder-{400,800}.webp` | DURATIQ concrete grinding machine.png | Wikimedia Commons | Davitzo | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:DURATIQ_concrete_grinding_machine.png |
| Concrete grinder - hand-held | `images/hire/concrete-hand-grinder-{400,800}.webp` | Neuverlegung „Spur der Erinnerung“ am Waidmarkt, Köln-5813.jpg | Wikimedia Commons | Raimond Spekking | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Neuverlegung_%E2%80%9ESpur_der_Erinnerung%E2%80%9C_am_Waidmarkt,_K%C3%B6ln-5813.jpg |
| Core drill (to ~100-150mm) | `images/hire/core-drill-{400,800}.webp` | Makita 8406 Diamon Core Drill (4887726030).jpg | Wikimedia Commons | Mark Hunter | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | https://commons.wikimedia.org/wiki/File:Makita_8406_Diamon_Core_Drill_(4887726030).jpg |
| Dehumidifier | `images/hire/dehumidifier-{400,800}.webp` | Déshumidificateur d'air professionnel.jpg | Wikimedia Commons | Matelo2005 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:D%C3%A9shumidificateur_d%27air_professionnel.jpg |
| Demolition / cut-off saw - petrol 350mm | `images/hire/cut-off-saw-petrol-{400,800}.webp` | Engine cutter 55616 2027.jpg | Wikimedia Commons | Niihama City (新居浜市) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | https://commons.wikimedia.org/wiki/File:Engine_cutter_55616_2027.jpg |
| Demolition hammer - light (electric); Demolition hammer - medium (electric ~16kg); Jackhammer / breaker - heavy (electric ~30kg); Jackhammer on trolley (tile/floor removal) | `images/hire/demolition-hammer-{400,800}.webp` | Pneumatic drill.jpeg | Wikimedia Commons | Anthony Appleyard (English Wikipedia) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | https://commons.wikimedia.org/wiki/File:Pneumatic_drill.jpeg |
| Drain cleaner - electric eel | `images/hire/drain-eel-{400,800}.webp` | Electric-Drain-Cleaner.png | Wikimedia Commons | Pgdp123 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Electric-Drain-Cleaner.png |
| Drain jetter - electric (1800psi) | `images/hire/drain-jetter-{400,800}.webp` | Pressure-Washer-Sewer-Jetter-Attachment.png | Wikimedia Commons | Pgdp123 | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | https://commons.wikimedia.org/wiki/File:Pressure-Washer-Sewer-Jetter-Attachment.png |
| Drain snake - cordless | `images/hire/drain-snake-{400,800}.webp` | Handheld-Drain-Auger.png | Wikimedia Commons | Pgdp123 | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | https://commons.wikimedia.org/wiki/File:Handheld-Drain-Auger.png |
| Electric impact wrench 3/4in | `images/hire/impact-wrench-{400,800}.webp` | Cordless Impact Wrenches & Driver.jpg | Wikimedia Commons | Hychika | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Cordless_Impact_Wrenches_%26_Driver.jpg |
| Electric planer (hand) | `images/hire/planer-{400,800}.webp` | Makita KP0800 Planer (2).jpg | Wikimedia Commons | Mark Hunter | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | https://commons.wikimedia.org/wiki/File:Makita_KP0800_Planer_(2).jpg |
| Engine hoist / crane (2t) | `images/hire/engine-hoist-{400,800}.webp` | ZZ4 on the hoist - 4189433670.jpg | Wikimedia Commons | simonov | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | https://commons.wikimedia.org/wiki/File:ZZ4_on_the_hoist_-_4189433670.jpg |
| Evaporative air cooler | `images/hire/evap-cooler-{400,800}.webp` | Iwata air cooler (2023-06-19).jpg | Wikimedia Commons | PaulGorduiz106 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Iwata_air_cooler_(2023-06-19).jpg |
| Excavator ~2.5t; Excavator ~3.5t | `images/hire/excavator-{400,800}.webp` | Case mini excavator - Arlington, MA.jpg | Wikimedia Commons | Daderot | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | https://commons.wikimedia.org/wiki/File:Case_mini_excavator_-_Arlington,_MA.jpg |
| Exhaust / extraction fan 300mm | `images/hire/extraction-fan-{400,800}.webp` | Fan-exhaust-Tamil Nadu.JPG | Wikimedia Commons | Tha-uzhavan | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Fan-exhaust-Tamil_Nadu.JPG |
| Extension lead 15A (20-30m) | `images/hire/extension-lead-{400,800}.webp` | Extension cord 02.jpg | Wikimedia Commons | Sally V | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Extension_cord_02.jpg |
| Finish / brad nailer | `images/hire/brad-nailer-{400,800}.webp` | Nail gun 008.jpg | Wikimedia Commons | Boatbuilder | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Nail_gun_008.jpg |
| Floor polisher / rotary machine (400mm) | `images/hire/floor-polisher-{400,800}.webp` | บริการทำความสะอาด.jpg | Wikimedia Commons | Arayabee | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B8%B3%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%AA%E0%B8%B0%E0%B8%AD%E0%B8%B2%E0%B8%94.jpg |
| Floor sander (drum/belt) | `images/hire/floor-sander-{400,800}.webp` | Artisan-poncage-parquet-paris-francois-gaillard 07.jpg | Wikimedia Commons | Francois gaillard | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Artisan-poncage-parquet-paris-francois-gaillard_07.jpg |
| Floor scrubber (walk-behind, compact) | `images/hire/floor-scrubber-{400,800}.webp` | Floor cleaning machine - Nobles.jpg | Wikimedia Commons | Cantons-de-l'Est | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | https://commons.wikimedia.org/wiki/File:Floor_cleaning_machine_-_Nobles.jpg |
| Framing nailer | `images/hire/framing-nailer-{400,800}.webp` | Makita GN900SE Gas Nailer (3991070032).png | Wikimedia Commons | Mark Hunter | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | https://commons.wikimedia.org/wiki/File:Makita_GN900SE_Gas_Nailer_(3991070032).png |
| Generator ~2kVA; Generator ~5kVA; Generator ~6-7kVA; Generator ~10kVA | `images/hire/generator-{400,800}.webp` | Portable electrical generator angle.jpg | Wikimedia Commons | Gbleem (English Wikipedia) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | https://commons.wikimedia.org/wiki/File:Portable_electrical_generator_angle.jpg |
| Generator ~3kVA inverter | `images/hire/generator-inverter-{400,800}.webp` | Gasoline Generator 2026-08-12 ROYU Electrical Inverter Type 03.jpg | Wikimedia Commons | P1898 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | https://commons.wikimedia.org/wiki/File:Gasoline_Generator_2026-08-12_ROYU_Electrical_Inverter_Type_03.jpg |
| Hammer / percussion drill (13mm) | `images/hire/hammer-drill-{400,800}.webp` | Hammer drill-1.jpg | Wikimedia Commons | Shakespeare (English Wikipedia) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Hammer_drill-1.jpg |
| Heat gun / paint stripper | `images/hire/heat-gun-{400,800}.webp` | Hot air gun (1).jpg | Wikimedia Commons | Suyash Dwivedi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Hot_air_gun_(1).jpg |
| Jigsaw | `images/hire/jigsaw-{400,800}.webp` | Jigsaw AccuMaster.jpg | Wikimedia Commons | Артём В. | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Jigsaw_AccuMaster.jpg |
| Knapsack sprayer | `images/hire/knapsack-sprayer-{400,800}.webp` | Knapsack sprayer.jpg | Wikimedia Commons | Safapalanadan94 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Knapsack_sprayer.jpg |
| Laser distance measure | `images/hire/laser-distance-{400,800}.webp` | 2023 Dalmierz laserowy Bosh GLM 30.jpg | Wikimedia Commons | Jacek Halicki | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:2023_Dalmierz_laserowy_Bosh_GLM_30.jpg |
| Laser level (rotary) | `images/hire/rotary-laser-{400,800}.webp` | Niwelator laserowy NL540.jpg | Wikimedia Commons | Pokarwr | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Niwelator_laserowy_NL540.jpg |
| Lawn corer / aerator | `images/hire/lawn-aerator-{400,800}.webp` | AIREADORA 03.JPG | Wikimedia Commons | Guipozjim | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | https://commons.wikimedia.org/wiki/File:AIREADORA_03.JPG |
| Lawn mower - push petrol | `images/hire/lawn-mower-{400,800}.webp` | 2015-05-27 12 41 21 A lawn mower on Tranquility Court in the Franklin Farm section of Oak Hill, Fairfax County, Virginia.jpg | Wikimedia Commons | Famartin | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:2015-05-27_12_41_21_A_lawn_mower_on_Tranquility_Court_in_the_Franklin_Farm_section_of_Oak_Hill,_Fairfax_County,_Virginia.jpg |
| Lawn roller | `images/hire/lawn-roller-{400,800}.webp` | Kondara J09 02.jpg | Wikimedia Commons | Corpse Reviver | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | https://commons.wikimedia.org/wiki/File:Kondara_J09_02.jpg |
| Log splitter (hydraulic) | `images/hire/log-splitter-{400,800}.webp` | Automatic axe dsc00844.jpg | Wikimedia Commons | David Monniaux | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | https://commons.wikimedia.org/wiki/File:Automatic_axe_dsc00844.jpg |
| Magnetic base drill | `images/hire/mag-drill-{400,800}.webp` | Compact magnetic drilling machine.jpg | Wikimedia Commons | Rohan von Indien | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Compact_magnetic_drilling_machine.jpg |
| Metal cut-off saw 355mm | `images/hire/metal-cut-off-saw-{400,800}.webp` | Let the Sparks Fly - The Makita 2414NB Abrasive Cut Off Saw (4070957523).jpg | Wikimedia Commons | Mark Hunter | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | https://commons.wikimedia.org/wiki/File:Let_the_Sparks_Fly_-_The_Makita_2414NB_Abrasive_Cut_Off_Saw_(4070957523).jpg |
| Mini excavator ~1t | `images/hire/excavator-mini-{400,800}.webp` | Unknown mini excavator - Arlington, MA.jpg | Wikimedia Commons | Daderot | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | https://commons.wikimedia.org/wiki/File:Unknown_mini_excavator_-_Arlington,_MA.jpg |
| Mini loader (Dingo/Kanga type) | `images/hire/mini-loader-{400,800}.webp` | Agritechnica 2023, Hanover (P1160270-RR).jpg | Wikimedia Commons | MB-one | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Agritechnica_2023,_Hanover_(P1160270-RR).jpg |
| Mitre / drop saw | `images/hire/mitre-saw-{400,800}.webp` | MiterSaw.jpg | Wikimedia Commons | Lance Fisher | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | https://commons.wikimedia.org/wiki/File:MiterSaw.jpg |
| Mobile aluminium scaffold - single width ~4-4.5m | `images/hire/scaffold-{400,800}.webp` | Rollgerüst Alu und Mist.jpg | Wikimedia Commons | Leo Miregalitheo | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Rollger%C3%BCst_Alu_und_Mist.jpg |
| Moisture meter | `images/hire/moisture-meter-{400,800}.webp` | Feuchtemesser.jpg | Wikimedia Commons | Ralf Pfeifer | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | https://commons.wikimedia.org/wiki/File:Feuchtemesser.jpg |
| Orbital sander (hand-held) | `images/hire/orbital-sander-{400,800}.webp` | Makita BO5041 Random Orbit Sander (6169161017).jpg | Wikimedia Commons | Mark Hunter | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | https://commons.wikimedia.org/wiki/File:Makita_BO5041_Random_Orbit_Sander_(6169161017).jpg |
| Pallet jack ~2.5t | `images/hire/pallet-jack-{400,800}.webp` | Hubwagen.jpg | Wikimedia Commons | Markus Hagenlocher | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | https://commons.wikimedia.org/wiki/File:Hubwagen.jpg |
| Patio heater - LPG | `images/hire/patio-heater-{400,800}.webp` | Estufa exterior de butano.jpg | Wikimedia Commons | Luis Miguel Bugallo Sánchez (Lmbuga) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Estufa_exterior_de_butano.jpg |
| Pedestal fan (industrial ~600-750mm) | `images/hire/pedestal-fan-{400,800}.webp` | Industrial pedestal fan.jpg | Wikimedia Commons | Mk2010 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Industrial_pedestal_fan.jpg |
| Petrol transfer / trash pump 50mm | `images/hire/trash-pump-{400,800}.webp` | Water pumping machine.jpg | Wikimedia Commons | Anniwinner | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Water_pumping_machine.jpg |
| Pipe press / crimper (15-50mm) | `images/hire/pipe-press-{400,800}.webp` | Radial-press-for-press-fitting-systems.JPG | Wikimedia Commons | Cschirp | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Radial-press-for-press-fitting-systems.JPG |
| Pipe threader - electric (25-50mm) | `images/hire/pipe-threader-{400,800}.webp` | Pipe cutting and threading machine.jpg | Wikimedia Commons | Fumikas Sagisavas | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | https://commons.wikimedia.org/wiki/File:Pipe_cutting_and_threading_machine.jpg |
| Plate compactor - reversible (~150kg) | `images/hire/plate-compactor-reversible-{400,800}.webp` | Building Fairs Brno 2011 (162).jpg | Wikimedia Commons | Pavel Ševela | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Building_Fairs_Brno_2011_(162).jpg |
| Plate compactor - small (~40-55kg); Plate compactor - medium (~70-90kg) | `images/hire/plate-compactor-{400,800}.webp` | Building Fairs Brno 2011 (160).jpg | Wikimedia Commons | Pavel Ševela | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Building_Fairs_Brno_2011_(160).jpg |
| Pole saw / pole pruner | `images/hire/pole-saw-{400,800}.webp` | Astsäge&Schere&Seilzug.jpg | Wikimedia Commons | StromBer | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Asts%C3%A4ge%26Schere%26Seilzug.jpg |
| Portable air conditioner | `images/hire/portable-ac-{400,800}.webp` | Monoblock air conditioner.jpg | Wikimedia Commons | Морфиус | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Monoblock_air_conditioner.jpg |
| Post hole digger - 2-person petrol auger; Post hole digger - 1-person petrol | `images/hire/post-hole-auger-{400,800}.webp` | Starr-030429-0041-Chenopodium oahuense-digging holes with power auger with Derek-Lua Makika-Kahoolawe (24003396884).jpg | Wikimedia Commons | Forest and Kim Starr | [CC BY 3.0 us](https://creativecommons.org/licenses/by/3.0/us/deed.en) | https://commons.wikimedia.org/wiki/File:Starr-030429-0041-Chenopodium_oahuense-digging_holes_with_power_auger_with_Derek-Lua_Makika-Kahoolawe_(24003396884).jpg |
| Post hole digger - manual | `images/hire/post-hole-digger-manual-{400,800}.webp` | Erdbohrerp.jpg | Wikimedia Commons | Vermip | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Erdbohrerp.jpg |
| Power trowel (walk-behind) | `images/hire/power-trowel-{400,800}.webp` | Hand-push electric concrete trowel.jpg | Wikimedia Commons | Fumikas Sagisavas | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | https://commons.wikimedia.org/wiki/File:Hand-push_electric_concrete_trowel.jpg |
| Pressure washer - electric | `images/hire/pressure-washer-electric-{400,800}.webp` | Karcher-p1020712.jpg | Wikimedia Commons | Rama | [CC BY-SA 2.0 fr](https://creativecommons.org/licenses/by-sa/2.0/fr/deed.en) | https://commons.wikimedia.org/wiki/File:Karcher-p1020712.jpg |
| Rammer / jumping jack | `images/hire/rammer-{400,800}.webp` | Trilstamper.jpg | Wikimedia Commons | Rasbak | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | https://commons.wikimedia.org/wiki/File:Trilstamper.jpg |
| Reciprocating / sabre saw | `images/hire/recip-saw-{400,800}.webp` | Makita JR3070CT Reciprocating Saw (4887119615).jpg | Wikimedia Commons | Mark Hunter | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | https://commons.wikimedia.org/wiki/File:Makita_JR3070CT_Reciprocating_Saw_(4887119615).jpg |
| Roller - ride-on double drum (~1.2-1.5t) | `images/hire/roller-drum-{400,800}.webp` | Bomag Tandem Roller 02.JPG | Wikimedia Commons | Cherubino | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Bomag_Tandem_Roller_02.JPG |
| Rotary hammer drill - light (SDS-plus); Rotary hammer drill - heavy (SDS-max) | `images/hire/rotary-hammer-{400,800}.webp` | Bohrhammer Kress Elektrowerkzeuge.jpg | Wikimedia Commons | Zimin.V.G. | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Bohrhammer_Kress_Elektrowerkzeuge.jpg |
| Rotary hoe / tiller | `images/hire/rotary-hoe-{400,800}.webp` | Glebogryzarka.jpg | Wikimedia Commons | Przemysław Jahr | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Glebogryzarka.jpg |
| Skid steer loader - small wheeled | `images/hire/skid-steer-{400,800}.webp` | Araraquara (2020 October) 337.jpg | Wikimedia Commons | Sturm | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Araraquara_(2020_October)_337.jpg |
| Steam cleaner | `images/hire/steam-cleaner-{400,800}.webp` | Polti steam mop or portable.jpg | Wikimedia Commons | Cjp24 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Polti_steam_mop_or_portable.jpg |
| Step ladder 1.8m | `images/hire/step-ladder-{400,800}.webp` | Ladder 2.jpg | Wikimedia Commons | rrafson | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Ladder_2.jpg |
| Stump grinder (small/medium) | `images/hire/stump-grinder-{400,800}.webp` | 2023-05-12 08 37 56 A stump grinder being used to grind up a Red Maple stump along Aquetong Lane in the Mountainview section of Ewing Township, Mercer County, New Jersey.jpg | Wikimedia Commons | Famartin | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:2023-05-12_08_37_56_A_stump_grinder_being_used_to_grind_up_a_Red_Maple_stump_along_Aquetong_Lane_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg |
| Submersible pump 50mm (dirty water) | `images/hire/submersible-pump-{400,800}.webp` | Submersible pump in action.jpg | Wikimedia Commons | Kemikungen | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | https://commons.wikimedia.org/wiki/File:Submersible_pump_in_action.jpg |
| Temporary fence panel (mesh 2.4x1.8m) | `images/hire/temp-fence-{400,800}.webp` | C Block, City Campus, Ara Institute of Canterbury, Christchurch, New Zealand 06.jpg | Wikimedia Commons | Michal Klajban | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:C_Block,_City_Campus,_Ara_Institute_of_Canterbury,_Christchurch,_New_Zealand_06.jpg |
| Tile cutter - manual (~600mm) | `images/hire/tile-cutter-{400,800}.webp` | Montolit MASTERPIUMA 93 P3.jpg | Wikimedia Commons | Wielkijacek | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Montolit_MASTERPIUMA_93_P3.jpg |
| Tile saw - electric wet (bench/table) | `images/hire/tile-saw-{400,800}.webp` | Tile saw.jpg | Wikimedia Commons | Hustvedt | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Tile_saw.jpg |
| Torque wrench 1/2in (manual) | `images/hire/torque-wrench-{400,800}.webp` | 1-4" 5-25Nm.jpg | Wikimedia Commons | Sunnyhappy123 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:1-4%22_5-25Nm.jpg |
| Tracked dumper / power barrow (~600kg) | `images/hire/tracked-dumper-{400,800}.webp` | Yanmar C12R tracked dumper 01.jpg | Wikimedia Commons | Basotxerri | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Yanmar_C12R_tracked_dumper_01.jpg |
| Trench roller (articulated padfoot) | `images/hire/trench-roller-{400,800}.webp` | 2008-08-28 Wacker RT trench roller.jpg | Wikimedia Commons | Ildar Sagdejev (Specious) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:2008-08-28_Wacker_RT_trench_roller.jpg |
| Trencher - walk-behind self-propelled | `images/hire/trencher-{400,800}.webp` | Ditch Witch C30X, 2024 Mohács.jpg | Wikimedia Commons | Globetrotter19 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Ditch_Witch_C30X,_2024_Moh%C3%A1cs.jpg |
| Wall chaser (125mm) | `images/hire/wall-chaser-{400,800}.webp` | Einhell TC-MA 1300.JPG | Wikimedia Commons | Dmitry G | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | https://commons.wikimedia.org/wiki/File:Einhell_TC-MA_1300.JPG |
| Welder - inverter arc (~180A) | `images/hire/welder-{400,800}.webp` | Soldadora inverter Lüsqtoff Iron-140 (1).jpg | Wikimedia Commons | Just a Man | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | https://commons.wikimedia.org/wiki/File:Soldadora_inverter_L%C3%BCsqtoff_Iron-140_(1).jpg |
| Wet & dry vacuum (industrial); H-class concrete dust vacuum | `images/hire/wet-dry-vacuum-{400,800}.webp` | Advance VL500 wetdry vacuum Yonge.jpg | Wikimedia Commons | PvOberstein | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | https://commons.wikimedia.org/wiki/File:Advance_VL500_wetdry_vacuum_Yonge.jpg |
| Wheelbarrow | `images/hire/wheelbarrow-{400,800}.webp` | Carretilla Herragro campo.jpg | Wikimedia Commons | Jaimehloaiza | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | https://commons.wikimedia.org/wiki/File:Carretilla_Herragro_campo.jpg |
| Wood chipper (small, towable/petrol) | `images/hire/wood-chipper-{400,800}.webp` | Wood chipper display - geograph.org.uk - 4275105.jpg | Wikimedia Commons | Michael Trolove | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | https://commons.wikimedia.org/wiki/File:Wood_chipper_display_-_geograph.org.uk_-_4275105.jpg |

### Items that keep their category icon (29)
No photo with a suitable licence clearly showed these items, so they keep the category icon rather than a wrong or misleading photo:
- Floor stripper / tile & carpet remover (walk-behind)
- Orbital floor sander
- Floor edger
- Wallpaper steamer / stripper
- Plasterboard (giraffe) sander
- Lawn dethatcher / scarifier
- Turf cutter
- Concrete vibrator (petrol drive + shaft)
- Concrete screed (manual)
- Concrete planer / scarifier (200mm)
- Concrete floor saw - walk-behind 350mm petrol
- Brick / paver saw (350mm)
- Mixing drill / paddle mixer
- Coil / fencing nailer
- Secret floor nailer / stapler
- Air compressor - small electric (~6-12cfm)
- Platform ladder ~2.4m
- Trestle - aluminium adjustable 2.4m
- Plank - aluminium 4m
- Panel / sheet lifter
- Duct / material lifter (~3.6-5m)
- Pipe freezer kit - electric
- Flexdrive pump kit (petrol)
- Stair-climbing / fridge trolley
- Furniture / piano dolly
- Enclosed trailer (~8x5)
- Tipping trailer 8x5
- Plant / machinery trailer (~2t)
- Car trailer
