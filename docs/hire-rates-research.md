# Brisbane tool & equipment hire: competitor rates and proposed Real Time Traders rates

Prepared for Real Time Traders (Brisbane; **not GST registered**). All competitor prices checked **2026-10-10** (AEST). Research only; no prices were estimated. Anything not shown on an official page or feed is left blank or marked *not found*.

**Coverage:** 148 generic items mirroring the Kennards and Bunnings hire ranges (small plant included; large licensed/trucked plant listed separately at the end). **146 priced**, **2 price on request**.

## Sources and how prices were read

| Competitor | Location / scope | How the price was verified | GST / fees |
|---|---|---|---|
| Kennards Hire | Rocklea QLD 4106 branch (code 2101), branch-specific pricing | Product pages at kennards.com.au/for-hire/... load rates from the site's public rates feed (`/api/data/products/rates?productCode=..&branchCode=2101`), which is the same data the "View all Hire Rates" panel shows. All 1,204 in-scope product pages were checked and 1,159 returned Rocklea rates. Kennards publishes 4hr, day (24h) and week rates and **no weekend rate**. No peak/off-peak split applied at Rocklea (all rates were valid 7 days). | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. Week = 7 days; extra days 20% of week. |
| Bunnings Hire Shop | National online price, in-store only at select stores (no Brisbane-specific price shown) | Official product and category pages on bunnings.com.au. Each period is a separate product (4hr / 24hr / 7 Days; carpet cleaners 24hr / 48hr). | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |
| Superior Hire (Superior Access Hire) | Loganholme QLD 4129 (Brisbane south) | Price text on official product pages ("$X Per Day / $Y Per Week"). | GST not stated on page. Delivery/collection extra. |
| Allwell Hire | Mitchelton QLD 4053 (Brisbane north) | Official product pages: half-day / day / week options (weekend on a few loader items). | GST not stated on page. |
| Mega Hire | Acacia Ridge QLD 4110 and Brendale | Official catalogue and collection pages show "$X/day". | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |
| Coates | National | **Not found.** coates.com.au shows no public prices (quote/login). The Coates-through-Bunnings product pages that search engines still list (e.g. Coates Pressure Washer, Excavator 1.4t, Medium/Large Breaker, 3.5-7m Extension Ladder) now return 404, and today's Bunnings general-hire listing shows no Coates items, so none were used. | n/a |
| Peer-to-peer (Airtasker-style) | Brisbane | Prum, Next Door Rentals, iRentMy and SURP exist, but prices are set per owner listing, and no stable official per-item rate card could be verified (nextdoorrentals.com.au returned HTTP 500). **Not used.** | n/a |

## Pricing rule applied

- For each period (day, weekend, week), take the **lowest verified competitor price** for the closest-equivalent item. RTT rate = **90% of that price, rounded down to the nearest $0.50** (so always at least 10% below and well above the 50% floor).
- **Weekend:** no Brisbane competitor in this set publishes a true weekend rate except Bunnings 48hr (carpet cleaners) and Allwell (loader items). Where none exists: weekend = **1.5x RTT day** (flagged *derived*). If that would exceed the RTT week, it is capped at the week rate (flagged).
- **Week:** 10% below the lowest published week rate. If only a day rate exists, week = **3.5x RTT day** (flagged *derived*).
- Items whose only published price is a flat per-hire charge (identical for 4hr/day/week) get the same flat RTT figure for every period.
- No competitor price means no proposal: **price on request**.
- **GST note:** competitor prices are GST-inclusive (Kennards states this outright; for the others it is not stated, but Australian consumer prices are displayed GST-inclusive). RTT is not GST-registered, so RTT rates are the full price with **no GST added**. That makes RTT about 10% cheaper on the ticket price than the cheapest published rate. Competitor damage waivers (Kennards basic waiver included), deposits (Bunnings $100) and delivery fees are **not** included in the comparison.
- Kennards "4hr" and Allwell "half-day" are shown for reference only. No RTT 4-hour rate is proposed (not requested).

## Proposed RTT rates (summary)

| # | Item | Category | Weight | RTT day | RTT weekend | RTT week | Flags | Basis |
|---|---|---|---|---|---|---|---|---|
| 1 | Pressure washer - petrol ~3000psi | Cleaning | heavy | $62.00 | $93.00 | $289.50 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $69.00; week: 10% below Bunnings Hire Shop $322.00; weekend: derived 1.5x RTT day |
| 2 | Pressure washer - petrol ~2000-2500psi | Cleaning | heavy | $108.00 | $162.00 | $432.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $120.00; week: 10% below Allwell Hire $480.00; weekend: derived 1.5x RTT day |
| 3 | Pressure washer - petrol ~4000psi | Cleaning | heavy | $175.50 | $263.00 | $616.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $195.00; week: 10% below Superior Hire $685.00; weekend: derived 1.5x RTT day |
| 4 | Pressure washer - electric | Cleaning | light | $54.00 | $81.00 | $189.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $60.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day |
| 5 | Pressure washer rotary surface cleaner (attachment) | Cleaning | light | $39.50 | $59.00 | $157.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $44.00; week: 10% below Superior Hire $175.00; weekend: derived 1.5x RTT day |
| 6 | Carpet cleaner (hot-water extraction) | Cleaning | light | $39.00 | $46.50 | $237.50 |  | 10% below Bunnings Hire Shop day $43.60; week: 10% below Kennards Hire $264.00; weekend: 10% below Bunnings Hire Shop $52.00 (48hr rate) |
| 7 | Carpet dryer / air mover | Cleaning | light | $15.00 | $22.50 | $144.00 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $17.00; week: 10% below Allwell Hire $160.00; weekend: derived 1.5x RTT day |
| 8 | Wet & dry vacuum (industrial) | Cleaning | light | $45.00 | $67.50 | $153.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $50.00; week: 10% below Superior Hire $170.00; weekend: derived 1.5x RTT day |
| 9 | H-class concrete dust vacuum | Cleaning | light | $99.00 | $148.50 | $457.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $110.00; week: 10% below Kennards Hire $508.00; weekend: derived 1.5x RTT day |
| 10 | Steam cleaner | Cleaning | light | POR | POR | POR |  | price on request - no published competitor price found |
| 11 | Floor scrubber (walk-behind, compact) | Cleaning | light | $155.50 | $233.00 | $572.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $173.00; week: 10% below Kennards Hire $636.00; weekend: derived 1.5x RTT day |
| 12 | Floor polisher / rotary machine (400mm) | Floor care | light | $64.00 | $96.00 | $257.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $71.50; week: 10% below Allwell Hire $286.00; weekend: derived 1.5x RTT day |
| 13 | Dehumidifier | Cleaning | light | $89.00 | $133.50 | $289.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $99.00; week: 10% below Kennards Hire $322.00; weekend: derived 1.5x RTT day |
| 14 | Floor stripper / tile & carpet remover (walk-behind) | Floor care | heavy | $153.00 | $229.50 | $696.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $170.50; week: 10% below Kennards Hire $774.00; weekend: derived 1.5x RTT day |
| 15 | Floor sander (drum/belt) | Floor care | heavy | $72.50 | $109.00 | $248.00 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $81.00; week: 10% below Bunnings Hire Shop $276.00; weekend: derived 1.5x RTT day |
| 16 | Orbital floor sander | Floor care | heavy | $70.00 | $105.00 | $248.00 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $78.00; week: 10% below Bunnings Hire Shop $276.00; weekend: derived 1.5x RTT day |
| 17 | Floor edger | Floor care | light | $47.50 | $71.00 | $189.00 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $53.00; week: 10% below Bunnings Hire Shop $210.00; weekend: derived 1.5x RTT day |
| 18 | Tile saw - electric wet (bench/table) | Cutting & sawing | light | $64.00 | $96.00 | $257.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $71.50; week: 10% below Allwell Hire $286.00; weekend: derived 1.5x RTT day |
| 19 | Tile cutter - manual (~600mm) | Cutting & sawing | light | $31.50 | $47.00 | $108.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $35.00; week: 10% below Superior Hire $120.00; weekend: derived 1.5x RTT day |
| 20 | Wallpaper steamer / stripper | Painting & decorating | light | $30.50 | $46.00 | $152.00 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $34.00; week: 10% below Allwell Hire $169.40; weekend: derived 1.5x RTT day |
| 21 | Airless paint sprayer | Painting & decorating | light | $162.00 | $243.00 | $540.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $180.00; week: 10% below Allwell Hire $600.00; weekend: derived 1.5x RTT day |
| 22 | Plasterboard (giraffe) sander | Sanding | light | $54.00 | $81.00 | $189.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $60.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day |
| 23 | Orbital sander (hand-held) | Sanding | light | $13.50 | $20.00 | $45.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $15.00; week: 10% below Superior Hire $50.00; weekend: derived 1.5x RTT day |
| 24 | Belt sander (100mm) | Sanding | light | $60.00 | $90.00 | $208.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $67.00; week: 10% below Kennards Hire $232.00; weekend: derived 1.5x RTT day |
| 25 | Heat gun / paint stripper | Painting & decorating | light | $18.00 | $27.00 | $63.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $20.00; week: 10% below Kennards Hire $70.00; weekend: derived 1.5x RTT day |
| 26 | Lawn mower - push petrol | Gardening & landscaping | light | $36.00 | $54.00 | $108.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $40.00; week: 10% below Allwell Hire $120.00; weekend: derived 1.5x RTT day |
| 27 | Line trimmer / whipper snipper (petrol) | Gardening & landscaping | light | $40.50 | $61.00 | $216.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $45.00; week: 10% below Allwell Hire $240.00; weekend: derived 1.5x RTT day |
| 28 | Hedge trimmer | Gardening & landscaping | light | $40.50 | $61.00 | $139.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $45.00; week: 10% below Superior Hire $155.00; weekend: derived 1.5x RTT day |
| 29 | Leaf blower | Gardening & landscaping | light | $54.00 | $81.00 | $189.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $60.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day |
| 30 | Chainsaw - petrol (~18-20in) | Gardening & landscaping | light | $85.50 | $128.00 | $342.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $95.00; week: 10% below Allwell Hire $380.00; weekend: derived 1.5x RTT day |
| 31 | Pole saw / pole pruner | Gardening & landscaping | light | $79.00 | $118.50 | $288.50 | weekend_derived_1.5x_day | 10% below Allwell Hire day $88.00; week: 10% below Kennards Hire $321.00; weekend: derived 1.5x RTT day |
| 32 | Rotary hoe / tiller | Gardening & landscaping | heavy | $69.00 | $103.50 | $277.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $77.00; week: 10% below Allwell Hire $308.00; weekend: derived 1.5x RTT day |
| 33 | Lawn corer / aerator | Gardening & landscaping | heavy | $117.00 | $175.50 | $468.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $130.00; week: 10% below Allwell Hire $520.00; weekend: derived 1.5x RTT day |
| 34 | Lawn dethatcher / scarifier | Gardening & landscaping | heavy | $118.50 | $178.00 | $504.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $132.00; week: 10% below Superior Hire $560.00; weekend: derived 1.5x RTT day |
| 35 | Turf cutter | Gardening & landscaping | heavy | $144.00 | $216.00 | $504.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $160.00; week: 10% below Superior Hire $560.00; weekend: derived 1.5x RTT day |
| 36 | Lawn roller | Gardening & landscaping | light | $14.50 | $22.00 | $37.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $16.50; week: 10% below Allwell Hire $41.14; weekend: derived 1.5x RTT day |
| 37 | Wood chipper (small, towable/petrol) | Gardening & landscaping | heavy | $130.50 | $196.00 | $522.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $145.00; week: 10% below Allwell Hire $580.00; weekend: derived 1.5x RTT day |
| 38 | Stump grinder (small/medium) | Gardening & landscaping | heavy | $175.50 | $263.00 | $616.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $195.00; week: 10% below Superior Hire $685.00; weekend: derived 1.5x RTT day |
| 39 | Log splitter (hydraulic) | Gardening & landscaping | heavy | $273.50 | $410.00 | $956.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $304.00; week: 10% below Kennards Hire $1063.00; weekend: derived 1.5x RTT day |
| 40 | Brush cutter / scrub cutter (heavy) | Gardening & landscaping | light | $89.00 | $133.50 | $539.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $99.00; week: 10% below Kennards Hire $599.00; weekend: derived 1.5x RTT day |
| 41 | Knapsack sprayer | Gardening & landscaping | light | $57.50 | $86.00 | $174.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $64.00; week: 10% below Kennards Hire $194.00; weekend: derived 1.5x RTT day |
| 42 | Wheelbarrow | Gardening & landscaping | light | $13.50 | $20.00 | $45.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $15.00; week: 10% below Superior Hire $50.00; weekend: derived 1.5x RTT day |
| 43 | Post hole digger - 2-person petrol auger | Post holes & augers | heavy | $81.00 | $121.50 | $295.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $90.00; week: 10% below Bunnings Hire Shop $328.00; weekend: derived 1.5x RTT day |
| 44 | Post hole digger - 1-person petrol | Post holes & augers | light | $67.50 | $101.00 | $234.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $75.00; week: 10% below Superior Hire $260.00; weekend: derived 1.5x RTT day |
| 45 | Post hole digger - manual | Post holes & augers | light | $18.00 | $27.00 | $68.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $20.00; week: 10% below Kennards Hire $76.00; weekend: derived 1.5x RTT day |
| 46 | Concrete / cement mixer (~3 cu ft electric) | Concreting | heavy | $49.50 | $74.00 | $198.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $55.00; week: 10% below Allwell Hire $220.00; weekend: derived 1.5x RTT day |
| 47 | Cement mixer - small (~2-2.2 cu ft electric) | Concreting | heavy | $39.50 | $59.00 | $158.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $44.00; week: 10% below Allwell Hire $176.00; weekend: derived 1.5x RTT day |
| 48 | Concrete vibrator (petrol drive + shaft) | Concreting | light | $85.50 | $128.00 | $301.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $95.00; week: 10% below Superior Hire $335.00; weekend: derived 1.5x RTT day |
| 49 | Power trowel (walk-behind) | Concreting | heavy | $108.50 | $163.00 | $288.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $121.00; week: 10% below Superior Hire $320.00; weekend: derived 1.5x RTT day |
| 50 | Bull float | Concreting | light | $17.00 | $25.50 | $52.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $19.36; week: 10% below Allwell Hire $58.08; weekend: derived 1.5x RTT day |
| 51 | Concrete screed (manual) | Concreting | light | $13.00 | $19.50 | $26.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $14.52; week: 10% below Allwell Hire $29.04; weekend: derived 1.5x RTT day |
| 52 | Concrete floor grinder (walk-behind, single head) | Concreting | heavy | $125.00 | $187.50 | $479.50 | weekend_derived_1.5x_day | 10% below Allwell Hire day $139.26; week: 10% below Allwell Hire $532.79; weekend: derived 1.5x RTT day |
| 53 | Concrete grinder - hand-held | Concreting | light | $146.50 | $220.00 | $362.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $163.00; week: 10% below Kennards Hire $403.00; weekend: derived 1.5x RTT day |
| 54 | Core drill (to ~100-150mm) | Drilling & fastening | light | $135.00 | $202.50 | $472.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $150.00; week: 10% below Superior Hire $525.00; weekend: derived 1.5x RTT day |
| 55 | Wall chaser (125mm) | Cutting & sawing | light | $99.00 | $148.50 | $346.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $110.00; week: 10% below Superior Hire $385.00; weekend: derived 1.5x RTT day |
| 56 | Concrete planer / scarifier (200mm) | Concreting | heavy | $376.00 | $564.00 | $1,948.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $418.00; week: 10% below Kennards Hire $2165.00; weekend: derived 1.5x RTT day |
| 57 | Plate compactor - small (~40-55kg) | Compaction | heavy | $57.50 | $86.00 | $234.00 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $64.00; week: 10% below Bunnings Hire Shop $260.00; weekend: derived 1.5x RTT day |
| 58 | Plate compactor - medium (~70-90kg) | Compaction | heavy | $62.00 | $93.00 | $238.50 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $69.00; week: 10% below Bunnings Hire Shop $265.00; weekend: derived 1.5x RTT day |
| 59 | Plate compactor - reversible (~150kg) | Compaction | heavy | $180.00 | $270.00 | $684.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $200.00; week: 10% below Kennards Hire $761.00; weekend: derived 1.5x RTT day |
| 60 | Rammer / jumping jack | Compaction | heavy | $79.00 | $118.50 | $306.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $88.00; week: 10% below Superior Hire $340.00; weekend: derived 1.5x RTT day |
| 61 | Roller - ride-on double drum (~1.2-1.5t) | Compaction | heavy | $247.50 | $371.00 | $990.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $275.00; week: 10% below Allwell Hire $1100.00; weekend: derived 1.5x RTT day |
| 62 | Trench roller (articulated padfoot) | Compaction | heavy | $287.00 | $430.50 | $1,603.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $319.00; week: 10% below Kennards Hire $1782.00; weekend: derived 1.5x RTT day |
| 63 | Mini excavator ~1.7-1.8t | Earthmoving & trenching | heavy | $175.50 | $263.00 | $706.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $195.00; week: 10% below Superior Hire $785.00; weekend: derived 1.5x RTT day |
| 64 | Mini excavator ~1t | Earthmoving & trenching | heavy | $277.00 | $415.50 | $1,575.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $308.00; week: 10% below Kennards Hire $1750.00; weekend: derived 1.5x RTT day |
| 65 | Excavator ~2.5t | Earthmoving & trenching | heavy | $336.50 | $505.00 | $1,828.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $374.00; week: 10% below Kennards Hire $2032.00; weekend: derived 1.5x RTT day |
| 66 | Excavator ~3.5t | Earthmoving & trenching | heavy | $336.50 | $505.00 | $2,312.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $374.00; week: 10% below Kennards Hire $2569.00; weekend: derived 1.5x RTT day |
| 67 | Mini loader (Dingo/Kanga type) | Earthmoving & trenching | heavy | $175.50 | $189.00 | $706.50 |  | 10% below Superior Hire day $195.00; week: 10% below Superior Hire $785.00; weekend: 10% below Allwell Hire $210.00 (weekend rate) |
| 68 | Skid steer loader - small wheeled | Earthmoving & trenching | heavy | $277.00 | $415.50 | $1,224.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $308.00; week: 10% below Allwell Hire $1360.00; weekend: derived 1.5x RTT day |
| 69 | Tracked dumper / power barrow (~600kg) | Earthmoving & trenching | heavy | $215.00 | $322.50 | $810.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $239.00; week: 10% below Kennards Hire $901.00; weekend: derived 1.5x RTT day |
| 70 | Trencher - walk-behind self-propelled | Earthmoving & trenching | heavy | $227.50 | $341.00 | $1,254.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $253.00; week: 10% below Kennards Hire $1394.00; weekend: derived 1.5x RTT day |
| 71 | Demolition hammer - light (electric) | Demolition & breaking | light | $59.00 | $88.50 | $237.50 | weekend_derived_1.5x_day | 10% below Allwell Hire day $66.00; week: 10% below Allwell Hire $264.00; weekend: derived 1.5x RTT day |
| 72 | Demolition hammer - medium (electric ~16kg) | Demolition & breaking | light | $76.50 | $115.00 | $306.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $85.00; week: 10% below Allwell Hire $340.00; weekend: derived 1.5x RTT day |
| 73 | Jackhammer / breaker - heavy (electric ~30kg) | Demolition & breaking | heavy | $99.00 | $148.50 | $396.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $110.00; week: 10% below Allwell Hire $440.00; weekend: derived 1.5x RTT day |
| 74 | Jackhammer on trolley (tile/floor removal) | Demolition & breaking | heavy | $121.50 | $182.00 | $487.50 | weekend_derived_1.5x_day | 10% below Allwell Hire day $135.48; week: 10% below Allwell Hire $541.95; weekend: derived 1.5x RTT day |
| 75 | Demolition / cut-off saw - petrol 350mm | Cutting & sawing | light | $198.00 | $297.00 | $693.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $220.00; week: 10% below Superior Hire $770.00; weekend: derived 1.5x RTT day |
| 76 | Concrete floor saw - walk-behind 350mm petrol | Cutting & sawing | heavy | $126.00 | $189.00 | $504.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $140.00; week: 10% below Allwell Hire $560.00; weekend: derived 1.5x RTT day |
| 77 | Brick / paver saw (350mm) | Cutting & sawing | heavy | $99.00 | $148.50 | $396.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $110.00; week: 10% below Allwell Hire $440.00; weekend: derived 1.5x RTT day |
| 78 | Rotary hammer drill - light (SDS-plus) | Drilling & fastening | light | $22.50 | $34.00 | $81.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $25.00; week: 10% below Superior Hire $90.00; weekend: derived 1.5x RTT day |
| 79 | Rotary hammer drill - heavy (SDS-max) | Drilling & fastening | light | $45.00 | $67.50 | $157.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $50.00; week: 10% below Superior Hire $175.00; weekend: derived 1.5x RTT day |
| 80 | Hammer / percussion drill (13mm) | Drilling & fastening | light | $36.00 | $54.00 | $126.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $40.00; week: 10% below Superior Hire $140.00; weekend: derived 1.5x RTT day |
| 81 | Cordless drill | Drilling & fastening | light | $49.50 | $74.00 | $135.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $55.00; week: 10% below Kennards Hire $150.00; weekend: derived 1.5x RTT day |
| 82 | Cordless 1/2in impact wrench (18V) | Drilling & fastening | light | $54.00 | $81.00 | $202.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $60.00; week: 10% below Kennards Hire $225.00; weekend: derived 1.5x RTT day |
| 83 | Electric impact wrench 3/4in | Drilling & fastening | light | $31.50 | $47.00 | $88.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $35.00; week: 10% below Kennards Hire $98.00; weekend: derived 1.5x RTT day |
| 84 | Mixing drill / paddle mixer | Drilling & fastening | light | $71.00 | $106.50 | $203.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $79.00; week: 10% below Kennards Hire $226.00; weekend: derived 1.5x RTT day |
| 85 | Magnetic base drill | Drilling & fastening | light | $128.50 | $193.00 | $504.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $143.00; week: 10% below Superior Hire $560.00; weekend: derived 1.5x RTT day |
| 86 | Angle grinder 125mm | Cutting & sawing | light | $45.00 | $67.50 | $153.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $50.00; week: 10% below Kennards Hire $170.00; weekend: derived 1.5x RTT day |
| 87 | Angle grinder 230mm | Cutting & sawing | light | $51.00 | $76.50 | $189.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $57.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day |
| 88 | Circular saw (~235mm) | Cutting & sawing | light | $27.50 | $41.00 | $61.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $31.00; week: 10% below Kennards Hire $68.00; weekend: derived 1.5x RTT day |
| 89 | Jigsaw | Cutting & sawing | light | $18.00 | $27.00 | $63.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $20.00; week: 10% below Superior Hire $70.00; weekend: derived 1.5x RTT day |
| 90 | Reciprocating / sabre saw | Cutting & sawing | light | $27.00 | $40.50 | $61.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $30.00; week: 10% below Kennards Hire $68.00; weekend: derived 1.5x RTT day |
| 91 | Mitre / drop saw | Cutting & sawing | light | $114.00 | $171.00 | $340.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $127.00; week: 10% below Kennards Hire $378.00; weekend: derived 1.5x RTT day |
| 92 | Metal cut-off saw 355mm | Cutting & sawing | light | $54.00 | $81.00 | $189.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $60.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day |
| 93 | Electric planer (hand) | Cutting & sawing | light | $18.00 | $27.00 | $63.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $20.00; week: 10% below Superior Hire $70.00; weekend: derived 1.5x RTT day |
| 94 | Framing nailer | Drilling & fastening | light | $27.00 | $40.50 | $94.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $30.00; week: 10% below Superior Hire $105.00; weekend: derived 1.5x RTT day |
| 95 | Coil / fencing nailer | Drilling & fastening | light | $45.50 | $68.00 | $182.50 | weekend_derived_1.5x_day | 10% below Allwell Hire day $50.82; week: 10% below Allwell Hire $203.28; weekend: derived 1.5x RTT day |
| 96 | Finish / brad nailer | Drilling & fastening | light | $41.00 | $61.50 | $172.50 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $46.00; week: 10% below Kennards Hire $192.00; weekend: derived 1.5x RTT day |
| 97 | Secret floor nailer / stapler | Drilling & fastening | light | $31.50 | $47.00 | $108.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $35.00; week: 10% below Superior Hire $120.00; weekend: derived 1.5x RTT day |
| 98 | Air compressor - small electric (~6-12cfm) | Air compressors & air tools | light | $45.50 | $68.00 | $147.00 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $51.00; week: 10% below Allwell Hire $163.35; weekend: derived 1.5x RTT day |
| 99 | Welder - inverter arc (~180A) | Welding | light | $124.00 | $186.00 | $435.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $138.00; week: 10% below Kennards Hire $484.00; weekend: derived 1.5x RTT day |
| 100 | Torque wrench 1/2in (manual) | Drilling & fastening | light | $54.00 | $81.00 | $117.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $60.00; week: 10% below Kennards Hire $130.00; weekend: derived 1.5x RTT day |
| 101 | Generator ~2kVA | Generators & power | light | $89.00 | $133.50 | $410.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $99.00; week: 10% below Kennards Hire $456.00; weekend: derived 1.5x RTT day |
| 102 | Generator ~3kVA inverter | Generators & power | light | $45.00 | $67.50 | $279.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $50.00; week: 10% below Superior Hire $310.00; weekend: derived 1.5x RTT day |
| 103 | Generator ~5kVA | Generators & power | heavy | $89.00 | $133.50 | $609.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $99.00; week: 10% below Kennards Hire $677.00; weekend: derived 1.5x RTT day |
| 104 | Generator ~6-7kVA | Generators & power | heavy | $138.50 | $208.00 | $636.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $154.00; week: 10% below Kennards Hire $707.00; weekend: derived 1.5x RTT day |
| 105 | Generator ~10kVA | Generators & power | heavy | $128.50 | $193.00 | $793.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $143.00; week: 10% below Kennards Hire $882.00; weekend: derived 1.5x RTT day |
| 106 | Extension lead 15A (20-30m) | Generators & power | light | $9.00 | $13.50 | $27.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $10.00; week: 10% below Superior Hire $30.00; weekend: derived 1.5x RTT day |
| 107 | Extension ladder ~6-6.5m | Ladders & access | light | $31.50 | $47.00 | $126.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $35.00; week: 10% below Allwell Hire $140.00; weekend: derived 1.5x RTT day |
| 108 | Extension ladder ~8-8.5m | Ladders & access | light | $36.00 | $54.00 | $162.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $40.00; week: 10% below Allwell Hire $180.00; weekend: derived 1.5x RTT day |
| 109 | Step ladder 1.8m | Ladders & access | light | $22.50 | $34.00 | $69.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $25.00; week: 10% below Kennards Hire $77.00; weekend: derived 1.5x RTT day |
| 110 | Platform ladder ~2.4m | Ladders & access | light | $39.50 | $59.00 | $137.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $44.00; week: 10% below Kennards Hire $153.00; weekend: derived 1.5x RTT day |
| 111 | Trestle - aluminium adjustable 2.4m | Ladders & access | light | $13.50 | $20.00 | $27.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $15.00; week: 10% below Allwell Hire $30.00; weekend: derived 1.5x RTT day |
| 112 | Plank - aluminium 4m | Ladders & access | light | $10.50 | $16.00 | $16.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $12.00; week: 10% below Allwell Hire $18.00; weekend: derived 1.5x RTT day |
| 113 | Mobile aluminium scaffold - single width ~4-4.5m | Ladders & access | heavy | $90.50 | $136.00 | $259.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $101.00; week: 10% below Kennards Hire $288.00; weekend: derived 1.5x RTT day |
| 114 | Panel / sheet lifter | Material handling | heavy | $36.00 | $54.00 | $99.00 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $40.00; week: 10% below Superior Hire $110.00; weekend: derived 1.5x RTT day |
| 115 | Duct / material lifter (~3.6-5m) | Material handling | heavy | $81.00 | $121.50 | $342.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $90.00; week: 10% below Allwell Hire $380.00; weekend: derived 1.5x RTT day |
| 116 | Acrow prop (steel, no.2-3) | Ladders & access | light | $14.50 | $18.00 | $18.00 | weekend_derived_1.5x_day, weekend_capped_at_week | 10% below Mega Hire day $16.50; week: 10% below Superior Hire $20.00; weekend: derived 1.5x RTT day; weekend capped at RTT week |
| 117 | Drain cleaner - electric eel | Plumbing & drainage | light | $81.00 | $121.50 | $324.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $90.00; week: 10% below Allwell Hire $360.00; weekend: derived 1.5x RTT day |
| 118 | Drain jetter - electric (1800psi) | Plumbing & drainage | light | $150.00 | $225.00 | $534.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $167.00; week: 10% below Kennards Hire $594.00; weekend: derived 1.5x RTT day |
| 119 | Drain snake - cordless | Plumbing & drainage | light | $56.50 | $85.00 | $158.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $63.00; week: 10% below Kennards Hire $176.00; weekend: derived 1.5x RTT day |
| 120 | Pipe threader - electric (25-50mm) | Plumbing & drainage | light | $200.50 | $301.00 | $765.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $223.00; week: 10% below Kennards Hire $850.00; weekend: derived 1.5x RTT day |
| 121 | Pipe freezer kit - electric | Plumbing & drainage | light | $96.00 | $144.00 | $253.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $107.00; week: 10% below Kennards Hire $282.00; weekend: derived 1.5x RTT day |
| 122 | Pipe press / crimper (15-50mm) | Plumbing & drainage | light | $114.00 | $171.00 | $382.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $127.00; week: 10% below Kennards Hire $425.00; weekend: derived 1.5x RTT day |
| 123 | Submersible pump 50mm (dirty water) | Pumps | light | $79.00 | $118.50 | $306.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $88.00; week: 10% below Superior Hire $340.00; weekend: derived 1.5x RTT day |
| 124 | Petrol transfer / trash pump 50mm | Pumps | heavy | $79.00 | $118.50 | $316.50 | weekend_derived_1.5x_day | 10% below Allwell Hire day $88.00; week: 10% below Allwell Hire $352.00; weekend: derived 1.5x RTT day |
| 125 | Flexdrive pump kit (petrol) | Pumps | light | $128.50 | $193.00 | $573.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $143.00; week: 10% below Kennards Hire $637.00; weekend: derived 1.5x RTT day |
| 126 | Hand trolley / sack truck | Material handling | light | $43.00 | $64.50 | $110.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $48.00; week: 10% below Kennards Hire $123.00; weekend: derived 1.5x RTT day |
| 127 | Stair-climbing / fridge trolley | Material handling | light | $17.00 | $25.50 | $94.50 | weekend_derived_1.5x_day | 10% below Bunnings Hire Shop day $19.00; week: 10% below Superior Hire $105.00; weekend: derived 1.5x RTT day |
| 128 | Pallet jack ~2.5t | Material handling | light | $27.00 | $40.50 | $94.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $30.00; week: 10% below Superior Hire $105.00; weekend: derived 1.5x RTT day |
| 129 | Furniture / piano dolly | Material handling | light | $13.50 | $20.00 | $45.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $15.00; week: 10% below Superior Hire $50.00; weekend: derived 1.5x RTT day |
| 130 | Engine hoist / crane (2t) | Material handling | heavy | $72.00 | $108.00 | $252.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $80.00; week: 10% below Superior Hire $280.00; weekend: derived 1.5x RTT day |
| 131 | Chain block / hoist (~2t) | Material handling | light | $27.00 | $40.50 | $108.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $30.00; week: 10% below Allwell Hire $120.00; weekend: derived 1.5x RTT day |
| 132 | Box trailer 6x4 | Trailers | heavy | $40.50 | $61.00 | $144.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $45.00; week: 10% below Superior Hire $160.00; weekend: derived 1.5x RTT day |
| 133 | Box trailer 8x5 | Trailers | heavy | $82.50 | $124.00 | $263.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $92.00; week: 10% below Kennards Hire $293.00; weekend: derived 1.5x RTT day |
| 134 | Enclosed trailer (~8x5) | Trailers | heavy | $128.50 | $193.00 | $442.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $143.00; week: 10% below Kennards Hire $492.00; weekend: derived 1.5x RTT day |
| 135 | Tipping trailer 8x5 | Trailers | heavy | $114.00 | $171.00 | $382.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $127.00; week: 10% below Kennards Hire $425.00; weekend: derived 1.5x RTT day |
| 136 | Plant / machinery trailer (~2t) | Trailers | heavy | $59.00 | $88.50 | $172.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $66.00; week: 10% below Superior Hire $192.00; weekend: derived 1.5x RTT day |
| 137 | Car trailer | Trailers | heavy | $168.00 | $252.00 | $705.50 | weekend_derived_1.5x_day | 10% below Mega Hire day $187.00; week: 10% below Kennards Hire $784.00; weekend: derived 1.5x RTT day |
| 138 | Pedestal fan (industrial ~600-750mm) | Heating, cooling & ventilation | light | $36.00 | $54.00 | $126.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $40.00; week: 10% below Superior Hire $140.00; weekend: derived 1.5x RTT day |
| 139 | Portable air conditioner | Heating, cooling & ventilation | light | $44.00 | $66.00 | $153.00 | weekend_derived_1.5x_day | 10% below Superior Hire day $49.00; week: 10% below Superior Hire $170.00; weekend: derived 1.5x RTT day |
| 140 | Evaporative air cooler | Heating, cooling & ventilation | light | $99.50 | $149.00 | $362.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $111.00; week: 10% below Kennards Hire $403.00; weekend: derived 1.5x RTT day |
| 141 | Exhaust / extraction fan 300mm | Heating, cooling & ventilation | light | $58.50 | $88.00 | $220.50 | weekend_derived_1.5x_day | 10% below Superior Hire day $65.00; week: 10% below Superior Hire $245.00; weekend: derived 1.5x RTT day |
| 142 | Patio heater - LPG | Heating, cooling & ventilation | light | $39.50 | $59.00 | $144.00 | weekend_derived_1.5x_day | 10% below Mega Hire day $44.00; week: 10% below Kennards Hire $160.00; weekend: derived 1.5x RTT day |
| 143 | Laser level (rotary) | Survey & measuring | light | $70.50 | $106.00 | $283.00 | weekend_derived_1.5x_day | 10% below Allwell Hire day $78.65; week: 10% below Allwell Hire $314.60; weekend: derived 1.5x RTT day |
| 144 | Automatic (dumpy) level | Survey & measuring | light | $91.50 | $137.00 | $312.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $102.00; week: 10% below Kennards Hire $347.00; weekend: derived 1.5x RTT day |
| 145 | Moisture meter | Survey & measuring | light | $70.00 | $105.00 | $207.00 | weekend_derived_1.5x_day | 10% below Kennards Hire day $78.00; week: 10% below Kennards Hire $230.00; weekend: derived 1.5x RTT day |
| 146 | Laser distance measure | Survey & measuring | light | $58.50 | $88.00 | $165.50 | weekend_derived_1.5x_day | 10% below Kennards Hire day $65.00; week: 10% below Kennards Hire $184.00; weekend: derived 1.5x RTT day |
| 147 | Temporary fence panel (mesh 2.4x1.8m) | Site equipment | light | $11.50 | $11.50 | $11.50 | flat_per_hire_rate_mirrors_competitor | 10% below Kennards Hire flat per-hire $13.00 (same for every period) |
| 148 | Portable toilet (construction / event) | Site equipment | heavy | POR | POR | POR |  | price on request - Published toilet prices are not like-for-like (flat per-hire charges, event 1-4 day pricing, 1-month minimum builders' hire, servicing/pump-outs not shown), so a per-period rate can't be fairly derived. Price on request until the owner confirms the servicing model. |

POR = price on request.

## Competitor detail per item

All rows checked 2026-10-10. Prices are AUD as published. A blank cell means that period is not published for that item (not found).


### Cleaning

#### Pressure washer - petrol ~3000psi (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 3000PAI PRESSURE WASHER | $195.00 | $253.00 |  | $866.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/pressure-washers/pressure-washer-3000-psi-petrol |
| Bunnings Hire Shop (national online price) | For Hire: High Pressure Cleaner (Crommelins 3000psi, 9hp Subaru) | $41.00 | $69.00 |  | $322.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/for-hire-high-pressure-cleaner-4hr_p5470100 ; https://www.bunnings.com.au/for-hire-high-pressure-cleaner-24hr_p5470083 ; https://www.bunnings.com.au/for-hire-high-pressure-cleaner-7day_p0193207 |
| Superior Hire (Loganholme QLD) | Pressure Washer 3000PSI |  | $150.00 |  | $525.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/3600psi-water-pressure-washer |
| Mega Hire (Acacia Ridge QLD) | 3000psi Pressure washer (Petrol) |  | $198.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-thorough-clean-p13r-36c-pressure-washer-petrol-3000psi |
| Allwell Hire (Mitchelton QLD) | 3000psi Petrol Water Blaster | $105.00 | $130.00 |  | $520.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/3000-psi-petrol-water-blaster/ |

**Proposed RTT:** day $62.00 · weekend $93.00 · week $289.50. *Rule:* 10% below Bunnings Hire Shop day $69.00; week: 10% below Bunnings Hire Shop $322.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pressure washer - petrol ~2000-2500psi (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2000PSI PETROL PRESSURE WASHER | $154.00 | $180.00 |  | $732.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/pressure-washers/pressure-washer-2000-psi-petrol |
| Mega Hire (Acacia Ridge QLD) | Pressure washer - Petrol 2000psi |  | $176.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-pressure-washer-petrol-2000psi |
| Allwell Hire (Mitchelton QLD) | 2000/2500psi Petrol Waterblaster | $100.00 | $120.00 |  | $480.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/2000-2500-psi-petrol-waterblaster/ |

**Proposed RTT:** day $108.00 · weekend $162.00 · week $432.00. *Rule:* 10% below Allwell Hire day $120.00; week: 10% below Allwell Hire $480.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pressure washer - petrol ~4000psi (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 4000PSI PRESSURE WASHER | $226.00 | $269.00 |  | $1,093.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/pressure-washers/pressure-washer-4000-psi-petrol |
| Superior Hire (Loganholme QLD) | Pressure Washer 4000PSI |  | $195.00 |  | $685.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/pressure-washer-4000psi |
| Mega Hire (Acacia Ridge QLD) | 4000psi Pressure washer (Petrol) |  | $242.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-thorough-clean-p20r-43c-pressure-washer-petrol-3800psi |

**Proposed RTT:** day $175.50 · weekend $263.00 · week $616.50. *Rule:* 10% below Superior Hire day $195.00; week: 10% below Superior Hire $685.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pressure washer - electric (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ELECTRIC PRESSURE WASHER | $109.00 | $138.00 |  | $492.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/pressure-washers/pressure-washer-electric |
| Superior Hire (Loganholme QLD) | Electric Pressure Washer 2000PSI |  | $60.00 |  | $210.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/electric-pressure-washer-2100psi |
| Allwell Hire (Mitchelton QLD) | High Pressure Electric Water Blaster | $80.00 | $90.00 |  | $360.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/1500-psi-electric-water-blaster/ |

**Proposed RTT:** day $54.00 · weekend $81.00 · week $189.00. *Rule:* 10% below Superior Hire day $60.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pressure washer rotary surface cleaner (attachment) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ROTARY CLEANER | $64.00 | $74.00 |  | $215.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/pressure-washers/rotary-cleaner |
| Superior Hire (Loganholme QLD) | Surface Cleaner 20" (attachment) |  | $50.00 |  | $175.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/20-surface-cleaner |
| Mega Hire (Acacia Ridge QLD) | Pressure washer Rotary cleaner |  | $44.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-thorough-clean-rotary-cleaner-attachment |
| Allwell Hire (Mitchelton QLD) | Rotary Floor Cleaner (Whirl-a-Way) | $55.00 | $66.00 |  | $264.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/rotary-floor-cleaner/ |

**Proposed RTT:** day $39.50 · weekend $59.00 · week $157.50. *Rule:* 10% below Mega Hire day $44.00; week: 10% below Superior Hire $175.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Carpet cleaner (hot-water extraction) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CARPET SHAMPOO MACHINE | $74.00 | $74.00 |  | $264.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/floor-care/carpet-shampoo-machine |
| Bunnings Hire Shop (national online price) | For Hire: Britex 3 In 1 Deep Cleaning Machine : Carpet |  | $43.60 | $52.00 |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. | Weekend column = Bunnings 48hr rate | https://www.bunnings.com.au/for-hire-britex-3-in-1-deep-cleaning-machine-carpet-24hr_p5450012 ; https://www.bunnings.com.au/for-hire-britex-3in1-deep-cleaning-machine-carpet-48hr_p5450006 |
| Bunnings Hire Shop (national online price) | For Hire: Rug Doctor Carpet Cleaner |  | $43.60 | $52.00 |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. | Weekend column = Bunnings 48hr rate | https://www.bunnings.com.au/for-hire-rug-doctor-carpet-cleaner-24hr_p5450011 ; https://www.bunnings.com.au/products/hire-shop/carpet-cleaning-equipment |

**Proposed RTT:** day $39.00 · weekend $46.50 · week $237.50. *Rule:* 10% below Bunnings Hire Shop day $43.60; week: 10% below Kennards Hire $264.00; weekend: 10% below Bunnings Hire Shop $52.00 (48hr rate)

#### Carpet dryer / air mover (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | BLOWER DRYER | $90.00 | $90.00 |  | $250.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/floor-care/blower-dryer |
| Bunnings Hire Shop (national online price) | For Hire: Air Blower |  | $17.00 |  |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/carpet-cleaning-equipment |
| Allwell Hire (Mitchelton QLD) | Carpet Dryer/Blower | $30.00 | $40.00 |  | $160.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/carpet-dryer/ |
| Mega Hire (Acacia Ridge QLD) | Carpet Blower Drier |  | $77.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-crusader-carpet-blower-drier |

**Proposed RTT:** day $15.00 · weekend $22.50 · week $144.00. *Rule:* 10% below Bunnings Hire Shop day $17.00; week: 10% below Allwell Hire $160.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Wet & dry vacuum (industrial) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | INDUSTRIAL VACUUM CLEANER | $102.00 | $127.00 |  | $363.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/vacuum-cleaners/vacuum-cleaner-industrial |
| Superior Hire (Loganholme QLD) | Wet & Dry Vacuum Dust Extractor (L Class) |  | $50.00 |  | $170.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/wet-dry-20l-vacuum-dust-extractor |
| Allwell Hire (Mitchelton QLD) | Vacuum Cleaner | $44.00 | $55.00 |  | $220.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/vacuum-cleaner/ |
| Mega Hire (Acacia Ridge QLD) | Vacuum Wet/Dry - Large |  | $99.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-kerrick-623pl-industrial-vacuum-cleaner-wet-dry |

**Proposed RTT:** day $45.00 · weekend $67.50 · week $153.00. *Rule:* 10% below Superior Hire day $50.00; week: 10% below Superior Hire $170.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### H-class concrete dust vacuum (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CONCRETE SMALL H CLASS VACUUM CLEANER | $130.00 | $147.00 |  | $508.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/vacuum-cleaners/vacuum-cleaner-concrete-small-h-class |
| Superior Hire (Loganholme QLD) | Vacuum Dust Extractor (H Class) |  | $220.00 |  | $770.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/h-class-vacuum-dust-extractor |
| Mega Hire (Acacia Ridge QLD) | Vacuum - concrete dust |  | $110.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilton-industrial-vacuum-for-concrete-dust-med |

**Proposed RTT:** day $99.00 · weekend $148.50 · week $457.00. *Rule:* 10% below Mega Hire day $110.00; week: 10% below Kennards Hire $508.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Steam cleaner (light)

*No published price found at Kennards, Bunnings, Coates, Superior, Allwell or Mega Hire (not found).*

**Proposed RTT:** day POR · weekend POR · week POR. *Rule:* price on request - no published competitor price found

#### Floor scrubber (walk-behind, compact) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | FLOOR CLEANER SCRUBBER | $127.00 | $173.00 |  | $636.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/floor-care/floor-cleaner-scrubber |

**Proposed RTT:** day $155.50 · weekend $233.00 · week $572.00. *Rule:* 10% below Kennards Hire day $173.00; week: 10% below Kennards Hire $636.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Floor care

#### Floor polisher / rotary machine (400mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ROTARY FLOOR POLISHER | $99.00 | $126.00 |  | $410.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/scrubbers-sweepers/floor-polisher-400-mm-electric |
| Mega Hire (Acacia Ridge QLD) | Polivac Floor Polisher 400mm |  | $110.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-polivac-floor-scrubber-drier-large |
| Allwell Hire (Mitchelton QLD) | Polivac Floor Sander Hire – 405mm Pad | $60.50 | $71.50 |  | $286.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/poly-vac-sander-polisher/ |

**Proposed RTT:** day $64.00 · weekend $96.00 · week $257.00. *Rule:* 10% below Allwell Hire day $71.50; week: 10% below Allwell Hire $286.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Cleaning

#### Dehumidifier (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | DEHUMIDIFIER | $114.00 | $114.00 |  | $322.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/floor-care/dehumidifier |
| Mega Hire (Acacia Ridge QLD) | 50L/d Dehumidifier |  | $99.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-suntec-dehumidifier |

**Proposed RTT:** day $89.00 · weekend $133.50 · week $289.50. *Rule:* 10% below Mega Hire day $99.00; week: 10% below Kennards Hire $322.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Floor care

#### Floor stripper / tile & carpet remover (walk-behind) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | FLOOR STRIPPER | $171.00 | $201.00 |  | $774.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/floor-care/floor-stripper |
| Mega Hire (Acacia Ridge QLD) | Floor Stripper |  | $170.50 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/floor-stripper |

**Proposed RTT:** day $153.00 · weekend $229.50 · week $696.50. *Rule:* 10% below Mega Hire day $170.50; week: 10% below Kennards Hire $774.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Floor sander (drum/belt) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | FLOOR SANDER | $129.00 | $162.00 |  | $631.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/floor-care/floor-sander |
| Bunnings Hire Shop (national online price) | For Hire: Floor Sander (Hiretech) | $62.00 | $81.00 |  | $276.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/floor-sanding-equipment ; https://www.bunnings.com.au/for-hire-floor-sander-24hr_p5470192 ; https://www.bunnings.com.au/for-hire-floor-sander-7day_p0193199 |
| Allwell Hire (Mitchelton QLD) | Floor Sander 203mm/8″ Drum | $80.00 | $100.00 |  | $400.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/floor-sander/ |

**Proposed RTT:** day $72.50 · weekend $109.00 · week $248.00. *Rule:* 10% below Bunnings Hire Shop day $81.00; week: 10% below Bunnings Hire Shop $276.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Orbital floor sander (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ORBITAL FLOOR SANDER | $147.00 | $181.00 |  | $618.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/floor-care/floor-sander-orbital |
| Bunnings Hire Shop (national online price) | For Hire: Orbital Floor Sander (Hiretech) | $61.00 | $78.00 |  | $276.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/floor-sanding-equipment ; https://www.bunnings.com.au/for-hire-orbital-floor-sander-24hr_p5470350 ; https://www.bunnings.com.au/for-hire-orbital-floor-sander-7-days_p0193228 |

**Proposed RTT:** day $70.00 · weekend $105.00 · week $248.00. *Rule:* 10% below Bunnings Hire Shop day $78.00; week: 10% below Bunnings Hire Shop $276.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Floor edger (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | FLOOR EDGER | $86.00 | $107.00 |  | $439.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/cleaning-floor-care/floor-care/floor-edger |
| Bunnings Hire Shop (national online price) | For Hire: Floor Edger (Hiretech) | $40.00 | $53.00 |  | $210.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/floor-sanding-equipment ; https://www.bunnings.com.au/for-hire-floor-edger-24hr_p5470194 ; https://www.bunnings.com.au/for-hire-floor-edger-7day_p0193210 |
| Allwell Hire (Mitchelton QLD) | Floor Edge Sander – 178mm/7” Disc | $66.00 | $80.00 |  | $352.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/sander-floor-edger-178mm-7-disc/ |

**Proposed RTT:** day $47.50 · weekend $71.00 · week $189.00. *Rule:* 10% below Bunnings Hire Shop day $53.00; week: 10% below Bunnings Hire Shop $210.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Cutting & sawing

#### Tile saw - electric wet (bench/table) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 730MM ELECTRIC TILE  SAW | $119.00 | $140.00 |  | $400.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/saws-other/saw-tile-730-mm-electric |
| Bunnings Hire Shop (national online price) | For Hire: Electric Tile Saw Table (Crommelins, 730mm cut) | $61.00 | $80.00 |  | $342.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/for-hire-electric-tile-saw-table-4hr_p5470035 ; https://www.bunnings.com.au/products/hire-shop/general-hire-equipment/building-equipment-hire ; https://www.bunnings.com.au/for-hire-electric-tile-saw-table-7-days_p0193201 |
| Superior Hire (Loganholme QLD) | Tile Saw |  | $130.00 |  | $455.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/tile-saw-clipper |
| Allwell Hire (Mitchelton QLD) | Wet Saw Tile Cutter Compound Slide | $60.50 | $71.50 |  | $286.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/tile-compound-slide/ |

**Proposed RTT:** day $64.00 · weekend $96.00 · week $257.00. *Rule:* 10% below Allwell Hire day $71.50; week: 10% below Allwell Hire $286.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Tile cutter - manual (~600mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 60CM CERAMIC TILE CUTTER | $65.00 | $78.00 |  | $226.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/cutting-bending-planing/tile-cutter-60-cm-ceramic |
| Bunnings Hire Shop (national online price) | For Hire: 600mm Hand Tile Cutter (Crommelins) | $21.00 |  |  | $127.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment/building-equipment-hire ; https://www.bunnings.com.au/for-hire-600mm-hand-tile-cutter-7-days_p0193197 |
| Superior Hire (Loganholme QLD) | Tile Cutter (Manual) |  | $35.00 |  | $120.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/manual-tile-cutter-860x380mm-25 |

**Proposed RTT:** day $31.50 · weekend $47.00 · week $108.00. *Rule:* 10% below Superior Hire day $35.00; week: 10% below Superior Hire $120.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Painting & decorating

#### Wallpaper steamer / stripper (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | WALLPAPER STEAMER | $56.00 | $68.00 |  | $209.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/painting-decorating/wallpaper-steamer |
| Bunnings Hire Shop (national online price) | For Hire: Wallpaper Stripper (Earlex) |  | $34.00 |  |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment/building-equipment-hire |
| Allwell Hire (Mitchelton QLD) | Wallpaper Steamer and Stripper | $33.88 | $42.35 |  | $169.40 | GST not stated on page. |  | https://www.allwellhire.com.au/product/wall-paper-stripper/ |

**Proposed RTT:** day $30.50 · weekend $46.00 · week $152.00. *Rule:* 10% below Bunnings Hire Shop day $34.00; week: 10% below Allwell Hire $169.40; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Airless paint sprayer (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LARGE AIRLESS SPRAYER | $239.00 | $295.00 |  | $1,191.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/painting-decorating/sprayer-airless-large |
| Allwell Hire (Mitchelton QLD) | Airless Spray | $150.00 | $180.00 |  | $600.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/airless-spray/ |
| Mega Hire (Acacia Ridge QLD) | Airless paint sprayer (Electric) |  | $242.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-atomex-gm-60e-paint-sprayer-airless-electric |

**Proposed RTT:** day $162.00 · weekend $243.00 · week $540.00. *Rule:* 10% below Allwell Hire day $180.00; week: 10% below Allwell Hire $600.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Sanding

#### Plasterboard (giraffe) sander (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | PLASTERBOARD SANDER | $134.00 | $170.00 |  | $476.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/sanders/sander-plasterboard |
| Superior Hire (Loganholme QLD) | Drywall Sander |  | $60.00 |  | $210.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/drywall-sander |
| Allwell Hire (Mitchelton QLD) | Drywall Sander | $66.00 | $80.00 |  | $320.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/drywall-sander/ |
| Mega Hire (Acacia Ridge QLD) | Giraffe sander (plaster board) |  | $132.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/sander-giraffe-plasterboard |

**Proposed RTT:** day $54.00 · weekend $81.00 · week $189.00. *Rule:* 10% below Superior Hire day $60.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Orbital sander (hand-held) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | RANDOM ORBITAL SANDER | $34.00 | $35.00 |  | $82.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/sanders/sander-orbital-random |
| Superior Hire (Loganholme QLD) | Orbital Sander 5" |  | $15.00 |  | $50.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/orbital-sander-125mm |

**Proposed RTT:** day $13.50 · weekend $20.00 · week $45.00. *Rule:* 10% below Superior Hire day $15.00; week: 10% below Superior Hire $50.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Belt sander (100mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 100MM SANDER BELT | $57.00 | $67.00 |  | $232.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/sanders/sander-belt-100-mm |

**Proposed RTT:** day $60.00 · weekend $90.00 · week $208.50. *Rule:* 10% below Kennards Hire day $67.00; week: 10% below Kennards Hire $232.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Painting & decorating

#### Heat gun / paint stripper (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 240V HOT AIR GUN PAINT BURNER | $32.00 | $32.00 |  | $70.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/painting-decorating/paint-burner-hot-air-gun-240-v |
| Superior Hire (Loganholme QLD) | Heat Gun |  | $20.00 |  | $70.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/heat-gun |

**Proposed RTT:** day $18.00 · weekend $27.00 · week $63.00. *Rule:* 10% below Superior Hire day $20.00; week: 10% below Kennards Hire $70.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Gardening & landscaping

#### Lawn mower - push petrol (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 450MM DOMESTIC LAWN MOWER | $47.00 | $59.00 |  | $210.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/lawn-mower-450-mm-domestic |
| Superior Hire (Loganholme QLD) | Lawn Mower Petrol 16" |  | $50.00 |  | $150.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/victa-16-300e-ultralite-petrol-mower |
| Allwell Hire (Mitchelton QLD) | Petrol Lawn Mower | $35.00 | $40.00 |  | $120.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/lawn-mower/ |

**Proposed RTT:** day $36.00 · weekend $54.00 · week $108.00. *Rule:* 10% below Allwell Hire day $40.00; week: 10% below Allwell Hire $120.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Line trimmer / whipper snipper (petrol) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LAWN LINE TRIMMER | $52.00 | $61.00 |  | $274.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/lawn-line-trimmer-petrol |
| Superior Hire (Loganholme QLD) | Whipper Snipper Brush Cutter |  | $70.00 |  | $250.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/petrol-brushcutter |
| Allwell Hire (Mitchelton QLD) | Petrol Brushcutter – FS 94 | $60.00 | $45.00 |  | $240.00 | GST not stated on page. | Published half-day is higher than day (as listed) | https://www.allwellhire.com.au/product/petrol-brushcutter-fs-94/ |

**Proposed RTT:** day $40.50 · weekend $61.00 · week $216.00. *Rule:* 10% below Allwell Hire day $45.00; week: 10% below Allwell Hire $240.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Hedge trimmer (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | HEDGE TRIMMER | $82.00 | $102.00 |  | $358.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/hedge-trimmer-petrol |
| Superior Hire (Loganholme QLD) | Hedge Trimmer 24" (Battery) |  | $45.00 |  | $155.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/hsa-60-battery-hedge-trimmer |
| Mega Hire (Acacia Ridge QLD) | Hedge trimmer - Petrol |  | $88.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-stihl-hedge-trimmer-petrol |

**Proposed RTT:** day $40.50 · weekend $61.00 · week $139.50. *Rule:* 10% below Superior Hire day $45.00; week: 10% below Superior Hire $155.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Leaf blower (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LAWN BLOWER | $67.00 | $72.00 |  | $245.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/lawn-blower-petrol |
| Superior Hire (Loganholme QLD) | Petrol Blower |  | $60.00 |  | $210.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/bg-56-petrol-blower |

**Proposed RTT:** day $54.00 · weekend $81.00 · week $189.00. *Rule:* 10% below Superior Hire day $60.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Chainsaw - petrol (~18-20in) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 450MM (18IN) CHAINSAW | $145.00 | $176.00 |  | $677.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/chain-saws/chainsaw-450-mm-18-in-petrol |
| Superior Hire (Loganholme QLD) | Chainsaw 20" |  | $160.00 |  | $560.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/chainsaw-50cm-20 |
| Allwell Hire (Mitchelton QLD) | Chainsaw – Petrol - 18" | $90.00 | $95.00 |  | $380.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/chainsaw-petrol/ |

**Proposed RTT:** day $85.50 · weekend $128.00 · week $342.00. *Rule:* 10% below Allwell Hire day $95.00; week: 10% below Allwell Hire $380.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pole saw / pole pruner (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | POLE PRUNER | $130.00 | $160.00 |  | $321.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/pruner-pole-petrol |
| Superior Hire (Loganholme QLD) | Long Chainsaw 10" |  | $140.00 |  | $490.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/ht56-c-e-pole-pruner-25cm-10 |
| Allwell Hire (Mitchelton QLD) | Pole Pruner – HT 56 C-E – | $66.00 | $88.00 |  | $352.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/pole-pruner-ht-56-c-e/ |
| Mega Hire (Acacia Ridge QLD) | Pole saw - Battery |  | $121.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-stihl-pruner-pole-battery |

**Proposed RTT:** day $79.00 · weekend $118.50 · week $288.50. *Rule:* 10% below Allwell Hire day $88.00; week: 10% below Kennards Hire $321.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Rotary hoe / tiller (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ROTARY LAWN TILLER | $141.00 | $171.00 |  | $677.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/lawn-rotary-tiller-petrol |
| Allwell Hire (Mitchelton QLD) | Lawn Rotary Hoe Hire | $48.40 | $77.00 |  | $308.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/rotary-tiller/ |
| Mega Hire (Acacia Ridge QLD) | Lawn Rotary Tiller - Petrol |  | $143.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-red-roo-gt622-lawn-rotary-tiller-petrol |

**Proposed RTT:** day $69.00 · weekend $103.50 · week $277.00. *Rule:* 10% below Allwell Hire day $77.00; week: 10% below Allwell Hire $308.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Lawn corer / aerator (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LAWN CORER | $167.00 | $196.00 |  | $719.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/lawn-corer-petrol |
| Superior Hire (Loganholme QLD) | Lawn Aerator |  | $160.00 |  | $560.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/lawn-aerator |
| Allwell Hire (Mitchelton QLD) | Petrol Lawn Aerator & Corer Hire | $100.00 | $130.00 |  | $520.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/lawn-corer-petrol-400mm-wide/ |
| Mega Hire (Acacia Ridge QLD) | Lawn corer/aerater |  | $165.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/lawn-corer-aerater |

**Proposed RTT:** day $117.00 · weekend $175.50 · week $468.00. *Rule:* 10% below Allwell Hire day $130.00; week: 10% below Allwell Hire $520.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Lawn dethatcher / scarifier (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LAWN DETHATCHER | $156.00 | $188.00 |  | $677.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/lawn-dethatcher |
| Superior Hire (Loganholme QLD) | Lawn Dethatcher Scarifier Power Rake |  | $160.00 |  | $560.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/yes-_pos-1-_psq-dethat-_ss-e-_v-1-0 |
| Mega Hire (Acacia Ridge QLD) | Lawn de-thatcher |  | $132.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/lawn-de-thatcher |

**Proposed RTT:** day $118.50 · weekend $178.00 · week $504.00. *Rule:* 10% below Mega Hire day $132.00; week: 10% below Superior Hire $560.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Turf cutter (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | TURF CUTTER | $219.00 | $270.00 |  | $1,070.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/turf-cutter |
| Superior Hire (Loganholme QLD) | Turfcutter |  | $160.00 |  | $560.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/turfcutter |
| Mega Hire (Acacia Ridge QLD) | Turf Cutter 350mm (petrol) |  | $176.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-turf-cutter-self-propelled |

**Proposed RTT:** day $144.00 · weekend $216.00 · week $504.00. *Rule:* 10% below Superior Hire day $160.00; week: 10% below Superior Hire $560.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Lawn roller (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LAWN ROLLER | $46.00 | $55.00 |  | $127.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/lawn-roller |
| Bunnings Hire Shop (national online price) | For Hire: Water Filled Roller (Crommelins) |  | $18.00 |  | $81.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment ; https://www.bunnings.com.au/for-hire-water-filled-roller-7-days_p0193212 |
| Superior Hire (Loganholme QLD) | Lawn Roller |  | $20.00 |  | $70.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/lawn-roller |
| Allwell Hire (Mitchelton QLD) | Lawn Roller – Water Filled 60kg | $16.45 | $20.57 |  | $41.14 | GST not stated on page. |  | https://www.allwellhire.com.au/product/lawn-roller-water-filled-60kg/ |
| Mega Hire (Acacia Ridge QLD) | Lawn Roller |  | $16.50 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-lawn-roller-water-filled |

**Proposed RTT:** day $14.50 · weekend $22.00 · week $37.00. *Rule:* 10% below Mega Hire day $16.50; week: 10% below Allwell Hire $41.14; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Wood chipper (small, towable/petrol) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 75MM TOWABLE CHIPPER | $176.00 | $220.00 |  | $846.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/chippers-mulchers-grinders/chipper-75-mm-petrol |
| Allwell Hire (Mitchelton QLD) | Wood Chipper – 80mm Trailer Mounted | $120.00 | $145.00 |  | $580.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/chipper-80mm-trailer-mounted/ |
| Mega Hire (Acacia Ridge QLD) | Wood Chipper - 100mm Petrol |  | $231.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-red-roo-c100-wood-chipper-100mm-petrol |

**Proposed RTT:** day $130.50 · weekend $196.00 · week $522.00. *Rule:* 10% below Allwell Hire day $145.00; week: 10% below Allwell Hire $580.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Stump grinder (small/medium) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | SMALL STUMP GRINDER | $177.00 | $220.00 |  | $809.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/clearing-cutting/stump-grinder-small |
| Superior Hire (Loganholme QLD) | Stump Grinder |  | $195.00 |  | $685.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/stump-grinder-red-roo-sg350 |
| Mega Hire (Acacia Ridge QLD) | Stump Grinder (petrol) |  | $253.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-red-roo-sg350-stump-grinder-petrol |

**Proposed RTT:** day $175.50 · weekend $263.00 · week $616.50. *Rule:* 10% below Superior Hire day $195.00; week: 10% below Superior Hire $685.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Log splitter (hydraulic) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | HYDRAULIC LOG SPLITTER | $242.00 | $304.00 |  | $1,063.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/clearing-cutting/log-splitter-hydraulic |

**Proposed RTT:** day $273.50 · weekend $410.00 · week $956.50. *Rule:* 10% below Kennards Hire day $304.00; week: 10% below Kennards Hire $1063.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Brush cutter / scrub cutter (heavy) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | HEAVY SCRUB CUTTER | $119.00 | $145.00 |  | $599.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/clearing-cutting/scrub-cutter-heavy |
| Mega Hire (Acacia Ridge QLD) | Scrub cutter - heavy duty (battery) |  | $99.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-stihl-scrub-cutter-heavy-duty-battery |

**Proposed RTT:** day $89.00 · weekend $133.50 · week $539.00. *Rule:* 10% below Mega Hire day $99.00; week: 10% below Kennards Hire $599.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Knapsack sprayer (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | KNAPSACK SPRAYER | $52.00 | $64.00 |  | $194.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/lawn-gardening/knapsack-sprayer |

**Proposed RTT:** day $57.50 · weekend $86.00 · week $174.50. *Rule:* 10% below Kennards Hire day $64.00; week: 10% below Kennards Hire $194.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Wheelbarrow (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | WHEELBARROW | $31.00 | $31.00 |  | $69.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/landscaping-other/wheelbarrow |
| Superior Hire (Loganholme QLD) | Wheel Barrow |  | $15.00 |  | $50.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/wheelbarrow-100l |
| Allwell Hire (Mitchelton QLD) | Wheelbarrow | $15.00 | $20.00 |  | $80.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/wheelbarrow/ |
| Mega Hire (Acacia Ridge QLD) | Wheel Barrow |  | $33.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-wheel-barrow |

**Proposed RTT:** day $13.50 · weekend $20.00 · week $45.00. *Rule:* 10% below Superior Hire day $15.00; week: 10% below Superior Hire $50.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Post holes & augers

#### Post hole digger - 2-person petrol auger (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2 MAN POST HOLE DIGGER | $123.00 | $151.00 |  | $503.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/landscaping-other/post-hole-digger-2-man-petrol |
| Bunnings Hire Shop (national online price) | For Hire: Post Hole Digger (Groundhog 2-man, 8in auger) | $81.00 | $115.00 |  | $328.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment ; https://www.bunnings.com.au/for-hire-post-hole-digger-7-days_p0193227 |
| Allwell Hire (Mitchelton QLD) | Post Hole Digger and Auger – Two Person | $75.00 | $90.00 |  | $360.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/post-hole-digger-two-person/ |

**Proposed RTT:** day $81.00 · weekend $121.50 · week $295.00. *Rule:* 10% below Allwell Hire day $90.00; week: 10% below Bunnings Hire Shop $328.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Post hole digger - 1-person petrol (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 1 MAN SMALL POST HOLE DIGGER | $122.00 | $144.00 |  | $425.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/landscaping-other/post-hole-digger-1-man-small |
| Superior Hire (Loganholme QLD) | Post Hole Digger |  | $75.00 |  | $260.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/manual-post-hole-digger |
| Mega Hire (Acacia Ridge QLD) | 1-man Post hole Borer (Stihl) |  | $110.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/post-hole-digger-1-man-petrol |

**Proposed RTT:** day $67.50 · weekend $101.00 · week $234.00. *Rule:* 10% below Superior Hire day $75.00; week: 10% below Superior Hire $260.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Post hole digger - manual (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 150MM MANUAL POST HOLE DIGGER | $31.00 | $34.00 |  | $76.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/landscaping/landscaping-other/post-hole-digger-manual-150-mm |
| Superior Hire (Loganholme QLD) | Post Hole Digger (manual) |  | $20.00 |  |  | GST not stated on page. Delivery/collection extra. | Page lists a second "per day" figure ($60.00), apparently a typo for the week rate; ignored | https://superioraccesshire.com.au/products/manual-post-hole-digger-1 |

**Proposed RTT:** day $18.00 · weekend $27.00 · week $68.00. *Rule:* 10% below Superior Hire day $20.00; week: 10% below Kennards Hire $76.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Concreting

#### Concrete / cement mixer (~3 cu ft electric) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 0.1 CU.MTR (3CU.FT) ELECTRIC CONCRETE MIXER | $71.00 | $85.00 |  | $312.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/mixing-pumping-spraying/concrete-mixer-0-1-cu-mtr-3-cu-ft-electric |
| Allwell Hire (Mitchelton QLD) | Concrete Mixer Hire - 3cft Electric | $44.00 | $55.00 |  | $220.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/concrete-mixer/ |
| Mega Hire (Acacia Ridge QLD) | Cement mixer - 3.5 Cu ft (Electric) |  | $66.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-kelso-cement-mixer-3-5-cu-ft-electric |

**Proposed RTT:** day $49.50 · weekend $74.00 · week $198.00. *Rule:* 10% below Allwell Hire day $55.00; week: 10% below Allwell Hire $220.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Cement mixer - small (~2-2.2 cu ft electric) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 0.06 CU.MTR (2CU.FT) ELECTRIC CONCRETE MIXER | $69.00 | $79.00 |  | $312.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/mixing-pumping-spraying/concrete-mixer-0-06-cu-mtr-2-cu-ft-electric |
| Superior Hire (Loganholme QLD) | Cement Mixer 2.2CF |  | $65.00 |  | $230.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/electric-cement-mixer-2-2cf |
| Allwell Hire (Mitchelton QLD) | Concrete Mixer Hire - 2.2cft Electric | $33.00 | $44.00 |  | $176.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/concrete-mixer/ |

**Proposed RTT:** day $39.50 · weekend $59.00 · week $158.00. *Rule:* 10% below Allwell Hire day $44.00; week: 10% below Allwell Hire $176.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Concrete vibrator (petrol drive + shaft) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CONCRETE VIBRATOR - 38MM (1.5IN) PACKAGE | $127.00 | $155.00 |  | $612.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/concrete-tools/concrete-vibrator-38-mm-1-5-in-package |
| Superior Hire (Loganholme QLD) | Concrete Vibrator Flex Drive Package |  | $95.00 |  | $335.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/power-drive-w-vibrator-shaft-package |

**Proposed RTT:** day $85.50 · weekend $128.00 · week $301.50. *Rule:* 10% below Superior Hire day $95.00; week: 10% below Superior Hire $335.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Power trowel (walk-behind) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CONCRETE TROWEL | $111.00 | $133.00 |  | $442.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/concrete-tools/concrete-trowel-petrol |
| Superior Hire (Loganholme QLD) | Walk Behind Trowel 34” |  | $130.00 |  | $320.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/walk-behind-trowel-34 |
| Mega Hire (Acacia Ridge QLD) | Concrete trowel - 42" (Petrol) |  | $121.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-concrete-trowel-42-petrol |

**Proposed RTT:** day $108.50 · weekend $163.00 · week $288.00. *Rule:* 10% below Mega Hire day $121.00; week: 10% below Superior Hire $320.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Bull float (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | BULL FLOAT | $32.00 | $32.00 |  | $74.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/concrete-tools/bull-float |
| Superior Hire (Loganholme QLD) | Bull Float w/Handle 2.5-5m |  | $40.00 |  | $140.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/bullfloat-900mm |
| Allwell Hire (Mitchelton QLD) | Bull Float, Trowel or Broom | $15.48 | $19.36 |  | $58.08 | GST not stated on page. |  | https://www.allwellhire.com.au/product/bull-float/ |

**Proposed RTT:** day $17.00 · weekend $25.50 · week $52.00. *Rule:* 10% below Allwell Hire day $19.36; week: 10% below Allwell Hire $58.08; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Concrete screed (manual) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MANUAL CONCRETE SCREED | $33.00 | $33.00 |  | $94.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/concrete-tools/concrete-screed-manual |
| Superior Hire (Loganholme QLD) | Concrete Screed |  | $25.00 |  | $90.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/screed-1-8-2-7-3-6m |
| Allwell Hire (Mitchelton QLD) | Concrete Screed - 2.4m | $11.61 | $14.52 |  | $29.04 | GST not stated on page. |  | https://www.allwellhire.com.au/product/concrete-screed/ |

**Proposed RTT:** day $13.00 · weekend $19.50 · week $26.00. *Rule:* 10% below Allwell Hire day $14.52; week: 10% below Allwell Hire $29.04; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Concrete floor grinder (walk-behind, single head) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | SINGLE HEAD HEAVY DUTY 240V CONCRETE GRINDER | $507.00 | $507.00 |  | $1,378.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/surface-preparation/concrete-grinder-single-head-heavy-duty-240-v |
| Superior Hire (Loganholme QLD) | Concrete Grinder 10" |  | $295.00 |  | $1,040.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/single-head-grinder |
| Allwell Hire (Mitchelton QLD) | Grinder – Terrazzo Floor and Concrete Grinder | $121.11 | $139.26 |  | $532.79 | GST not stated on page. |  | https://www.allwellhire.com.au/product/terazzo-grinder-with-diamond-cutting-stones/ |
| Mega Hire (Acacia Ridge QLD) | 250mm Concrete grinder |  | $286.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-meteor-250-concrete-floor-grinder-edger-250mm |

**Proposed RTT:** day $125.00 · weekend $187.50 · week $479.50. *Rule:* 10% below Allwell Hire day $139.26; week: 10% below Allwell Hire $532.79; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Concrete grinder - hand-held (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CONCRETE GRINDER -  HANDHELD CORNER | $163.00 | $163.00 |  | $403.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/surface-preparation/concrete-grinder-handheld-corner |
| Mega Hire (Acacia Ridge QLD) | 150mm hand held concrete grinder |  | $231.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilti-concrete-mower-hand-held-150mm |

**Proposed RTT:** day $146.50 · weekend $220.00 · week $362.50. *Rule:* 10% below Kennards Hire day $163.00; week: 10% below Kennards Hire $403.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Drilling & fastening

#### Core drill (to ~100-150mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | TO 100MM CORE DRILL | $169.00 | $208.00 |  | $675.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/drills/drill-core-to-100-mm-petrol-1 |
| Superior Hire (Loganholme QLD) | Core Drill |  | $150.00 |  | $525.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/core-drill |
| Mega Hire (Acacia Ridge QLD) | Core Drill |  | $176.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilti-core-drill-diamond-to-150mm |

**Proposed RTT:** day $135.00 · weekend $202.50 · week $472.50. *Rule:* 10% below Superior Hire day $150.00; week: 10% below Superior Hire $525.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Cutting & sawing

#### Wall chaser (125mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 125MM WALL CHASER | $133.00 | $166.00 |  | $576.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/cutting-bending-planing/wall-chaser-125-mm |
| Superior Hire (Loganholme QLD) | Wall Chaser |  | $110.00 |  | $385.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/wall-chaser-125mm |
| Mega Hire (Acacia Ridge QLD) | Wall Chaser (125mm) |  | $143.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilti-wall-chaser-180mm-and-vacuum-package |

**Proposed RTT:** day $99.00 · weekend $148.50 · week $346.50. *Rule:* 10% below Superior Hire day $110.00; week: 10% below Superior Hire $385.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Concreting

#### Concrete planer / scarifier (200mm) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 240V 200MM (8IN) CONCRETE PLANER | $466.00 | $545.00 |  | $2,165.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/concrete/surface-preparation/concrete-planer-200-mm-8-in-240-v |
| Mega Hire (Acacia Ridge QLD) | Concrete scarifier / planer - 200mm electric |  | $418.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-concrete-scarifier-planer-200mm-electric |

**Proposed RTT:** day $376.00 · weekend $564.00 · week $1,948.50. *Rule:* 10% below Mega Hire day $418.00; week: 10% below Kennards Hire $2165.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Compaction

#### Plate compactor - small (~40-55kg) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 40KG PLATE COMPACTOR | $93.00 | $115.00 |  | $443.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/compaction/compactors-rammers/plate-compactor-40-kg |
| Bunnings Hire Shop (national online price) | For Hire: Small Compactor (Crommelins) | $49.00 | $64.00 |  | $260.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/for-hire-small-compactor-4hr_p5470019 ; https://www.bunnings.com.au/for-hire-small-compactor-24hr_p5470074 ; https://www.bunnings.com.au/for-hire-small-compactor-7-days_p0193196 |
| Superior Hire (Loganholme QLD) | Plate Compactor 50kg |  | $80.00 |  | $320.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/plate-compactor-50kg |
| Allwell Hire (Mitchelton QLD) | Small Petrol Vibrating Plate Compactor CC40RP | $70.00 | $85.00 |  | $340.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/vibrating-plate-compactor-40kg/ |
| Mega Hire (Acacia Ridge QLD) | 55kg Plate Compactor |  | $88.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-paddock-plate-compactor-55kg |

**Proposed RTT:** day $57.50 · weekend $86.00 · week $234.00. *Rule:* 10% below Bunnings Hire Shop day $64.00; week: 10% below Bunnings Hire Shop $260.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Plate compactor - medium (~70-90kg) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 85KG PLATE COMPACTOR | $123.00 | $141.00 |  | $521.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/compaction/compactors-rammers/plate-compactor-85-kg |
| Bunnings Hire Shop (national online price) | For Hire: Large Compactor (Crommelins) | $54.00 | $69.00 |  | $265.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment ; https://www.bunnings.com.au/for-hire-large-compactor-24hr_p5470187 ; https://www.bunnings.com.au/for-hire-large-compactor-7-days_p0193209 |
| Superior Hire (Loganholme QLD) | Plate Compactor 80kg |  | $95.00 |  | $340.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/plate-compactor-80kg |
| Allwell Hire (Mitchelton QLD) | Plate Compactor CC70RP | $80.00 | $95.00 |  | $380.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/plate-compactor-cc70rp/ |
| Mega Hire (Acacia Ridge QLD) | 90Kg Plate Compactor |  | $88.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-wacker-neuson-vpy-70-plate-compactor-90kg |

**Proposed RTT:** day $62.00 · weekend $93.00 · week $238.50. *Rule:* 10% below Bunnings Hire Shop day $69.00; week: 10% below Bunnings Hire Shop $265.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Plate compactor - reversible (~150kg) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | PLATE COMPACTOR REVERSIBLE 150KG | $157.00 | $200.00 |  | $761.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/compaction/compactors-rammers/plate-compactor-reversible-150-kg |

**Proposed RTT:** day $180.00 · weekend $270.00 · week $684.50. *Rule:* 10% below Kennards Hire day $200.00; week: 10% below Kennards Hire $761.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Rammer / jumping jack (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | UPRIGHT RAMMER | $122.00 | $153.00 |  | $605.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/compaction/compactors-rammers/rammer-upright |
| Superior Hire (Loganholme QLD) | Upright Rammer 8" |  | $95.00 |  | $340.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/vibrating-rammer-280mm |
| Allwell Hire (Mitchelton QLD) | TRENCH RAMMER & COMPACTOR 63KGS | $60.00 | $88.00 |  | $352.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/trench-rammer-63kgs/ |
| Mega Hire (Acacia Ridge QLD) | Tampering rammer - 11in |  | $110.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-paddock-tampering-rammer-upright-11in |

**Proposed RTT:** day $79.00 · weekend $118.50 · week $306.00. *Rule:* 10% below Allwell Hire day $88.00; week: 10% below Superior Hire $340.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Roller - ride-on double drum (~1.2-1.5t) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 1.2T ROLLER DOUBLE DRUM SMOOTH | $342.00 | $422.00 |  | $1,594.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/compaction/rollers/roller-smooth-1-2-t-double-drum |
| Allwell Hire (Mitchelton QLD) | Vibrating Roller | $220.00 | $275.00 |  | $1,100.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/dynapac-1-5-ton-roller/ |
| Mega Hire (Acacia Ridge QLD) | 1-2.5T Tandem Roller |  | $308.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-roller-2-5t-tandem-drum |

**Proposed RTT:** day $247.50 · weekend $371.00 · week $990.00. *Rule:* 10% below Allwell Hire day $275.00; week: 10% below Allwell Hire $1100.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Trench roller (articulated padfoot) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ROLLER TRENCH - ARTICULATED PADFOOT | $335.00 | $408.00 |  | $1,782.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/compaction/rollers/roller-trench-articulated-padfoot-1 |
| Mega Hire (Acacia Ridge QLD) | Trench roller |  | $319.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-trench-roller-articulated-pad-foot |

**Proposed RTT:** day $287.00 · weekend $430.50 · week $1,603.50. *Rule:* 10% below Mega Hire day $319.00; week: 10% below Kennards Hire $1782.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Earthmoving & trenching

#### Mini excavator ~1.7-1.8t (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 1.8T MINI EXCAVATOR | $469.00 | $469.00 |  | $1,750.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/earthmoving/excavators/excavator-mini-1-8-t |
| Superior Hire (Loganholme QLD) | Excavator 1.7T |  | $195.00 |  | $785.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/excavator |
| Allwell Hire (Mitchelton QLD) | Kubota U17-3 Mini Excavator - Standard Buckets, Batter & Ripper | $270.00 | $340.00 |  | $1,360.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/mini-excavator-1-5t-inc-trailer/ |
| Mega Hire (Acacia Ridge QLD) | 1.8T Excavator |  | $308.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-excavator-mini-1-7t |

**Proposed RTT:** day $175.50 · weekend $263.00 · week $706.50. *Rule:* 10% below Superior Hire day $195.00; week: 10% below Superior Hire $785.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Mini excavator ~1t (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 1T MINI EXCAVATOR | $469.00 | $469.00 |  | $1,750.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/earthmoving/excavators/excavator-mini-1-t-1 |
| Mega Hire (Acacia Ridge QLD) | 1T Excavator |  | $308.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-excavator-mini-1t |

**Proposed RTT:** day $277.00 · weekend $415.50 · week $1,575.00. *Rule:* 10% below Mega Hire day $308.00; week: 10% below Kennards Hire $1750.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Excavator ~2.5t (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2.5T ZERO SWING EXCAVATOR | $550.00 | $550.00 |  | $2,032.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/earthmoving/excavators/excavator-2-5-t-zero-swing |
| Mega Hire (Acacia Ridge QLD) | 2.5T Excavator |  | $374.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-excavator-2-5t-zero-swing |

**Proposed RTT:** day $336.50 · weekend $505.00 · week $1,828.50. *Rule:* 10% below Mega Hire day $374.00; week: 10% below Kennards Hire $2032.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Excavator ~3.5t (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 3.5T EXCAVATOR | $693.00 | $693.00 |  | $2,569.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/earthmoving/excavators/excavator-3-5-t |
| Mega Hire (Acacia Ridge QLD) | 3.5T Excavator |  | $374.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-excavator-3-6t-zero-swing |

**Proposed RTT:** day $336.50 · weekend $505.00 · week $2,312.00. *Rule:* 10% below Mega Hire day $374.00; week: 10% below Kennards Hire $2569.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Mini loader (Dingo/Kanga type) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MINI LOADER | $242.00 | $302.00 |  | $1,120.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/earthmoving/mini-loaders-transporters/mini-loader |
| Superior Hire (Loganholme QLD) | Mini Loader |  | $195.00 |  | $785.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/mini-loader |
| Allwell Hire (Mitchelton QLD) | Kanga Mini Loader Hire - Standard Bucket | $180.00 | $210.00 | $210.00 | $880.00 | GST not stated on page. | Weekend rate per Allwell weekend terms; Day = 24h hire, 10 metered hours | https://www.allwellhire.com.au/product/kanga-mini-loader-including-trailer/ |
| Mega Hire (Acacia Ridge QLD) | Kanga mini-loader |  | $275.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/kanga-mini-loader |

**Proposed RTT:** day $175.50 · weekend $189.00 · week $706.50. *Rule:* 10% below Superior Hire day $195.00; week: 10% below Superior Hire $785.00; weekend: 10% below Allwell Hire $210.00 (weekend rate)

#### Skid steer loader - small wheeled (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | WHEELED SMALL - SKID STEER LOADER | $359.00 | $359.00 |  | $1,389.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/earthmoving/skid-steer-loaders/skid-steer-400-series-1 |
| Allwell Hire (Mitchelton QLD) | Huski Skid Steer Loader 5SDK5 | $300.00 | $340.00 |  | $1,360.00 | GST not stated on page. | Day = 24h hire, 10 metered hours | https://www.allwellhire.com.au/product/huski-skid-steer-loader-sdk5/ |
| Mega Hire (Acacia Ridge QLD) | S70 Bobcat |  | $308.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-skid-steer-loader-bobcat |

**Proposed RTT:** day $277.00 · weekend $415.50 · week $1,224.00. *Rule:* 10% below Mega Hire day $308.00; week: 10% below Allwell Hire $1360.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Tracked dumper / power barrow (~600kg) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 600KG HIGH TIPPING TRACKED DUMPER | $194.00 | $239.00 |  | $901.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/earthmoving/dumpers/dumper-tracked-high-tipping-pedestrian |

**Proposed RTT:** day $215.00 · weekend $322.50 · week $810.50. *Rule:* 10% below Kennards Hire day $239.00; week: 10% below Kennards Hire $901.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Trencher - walk-behind self-propelled (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 90MM X 600MM SELF PROPELLED TRENCHER | $321.00 | $395.00 |  | $1,394.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/earthmoving/trenchers/trencher-90-mm-x-600-mm-self-propelled |
| Mega Hire (Acacia Ridge QLD) | Trencher - self-propelled |  | $253.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-red-roo-trencher-self-propelled-100mm-x-600mm |

**Proposed RTT:** day $227.50 · weekend $341.00 · week $1,254.50. *Rule:* 10% below Mega Hire day $253.00; week: 10% below Kennards Hire $1394.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Demolition & breaking

#### Demolition hammer - light (electric) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LIGHT DEMOLITION HAMMER | $109.00 | $130.00 |  | $485.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/hammers-breakers/hammer-demolition-light |
| Allwell Hire (Mitchelton QLD) | Jackhammer - Small | $55.00 | $66.00 |  | $264.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/jackhammer/ |
| Mega Hire (Acacia Ridge QLD) | Light Jackhammer(Electric) |  | $110.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilti-jackhammer-light-electric |

**Proposed RTT:** day $59.00 · weekend $88.50 · week $237.50. *Rule:* 10% below Allwell Hire day $66.00; week: 10% below Allwell Hire $264.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Demolition hammer - medium (electric ~16kg) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MEDIUM (D HANDLE) DEMOLITION HAMMER | $115.00 | $135.00 |  | $490.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/hammers-breakers/hammer-demolition-medium |
| Superior Hire (Loganholme QLD) | Jack hammer 16kg |  | $110.00 |  | $390.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/demolition-jackhammer-1700w |
| Allwell Hire (Mitchelton QLD) | Jackhammer - Medium | $80.00 | $85.00 |  | $340.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/jackhammer/ |
| Mega Hire (Acacia Ridge QLD) | Medium Jackhammer(Electric) |  | $121.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-online-jackhammer-medium-electric |

**Proposed RTT:** day $76.50 · weekend $115.00 · week $306.00. *Rule:* 10% below Allwell Hire day $85.00; week: 10% below Allwell Hire $340.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Jackhammer / breaker - heavy (electric ~30kg) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | HEAVY DEMOLITION HAMMER | $180.00 | $216.00 |  | $732.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/hammers-breakers/hammer-demolition-heavy |
| Allwell Hire (Mitchelton QLD) | Jackhammer - Large | $90.00 | $110.00 |  | $440.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/jackhammer/ |
| Mega Hire (Acacia Ridge QLD) | Heavy Jackhammer(Electric) |  | $165.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilti-jackhammer-heavy-electric |

**Proposed RTT:** day $99.00 · weekend $148.50 · week $396.00. *Rule:* 10% below Allwell Hire day $110.00; week: 10% below Allwell Hire $440.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Jackhammer on trolley (tile/floor removal) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | HAMMER ON TROLLEY | $201.00 | $250.00 |  | $851.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/hammers-breakers/jackhammer-trolley |
| Superior Hire (Loganholme QLD) | Tile Remover Jack hammer Trolley |  | $180.00 |  | $595.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/jackhammer-trolley-package |
| Allwell Hire (Mitchelton QLD) | MAKINEX HILTI-STYLE JACKHAMMER TROLLEY | $109.50 | $135.48 |  | $541.95 | GST not stated on page. |  | https://www.allwellhire.com.au/product/makinex-hilti-style-jackhammer-trolley/ |
| Mega Hire (Acacia Ridge QLD) | Jackhammer on trolley |  | $220.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilti-jackhammer-on-trolley |

**Proposed RTT:** day $121.50 · weekend $182.00 · week $487.50. *Rule:* 10% below Allwell Hire day $135.48; week: 10% below Allwell Hire $541.95; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Cutting & sawing

#### Demolition / cut-off saw - petrol 350mm (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | DEMOLITION SAW - 350MM (14IN) PETROL | $234.00 | $282.00 |  | $856.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/demolition-saws/demolition-saw-350-mm-14-in-petrol |
| Superior Hire (Loganholme QLD) | Concrete Saw 14" |  | $220.00 |  | $770.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/petrol-cut-off-demolition-saw-350mm-14 |
| Mega Hire (Acacia Ridge QLD) | Demolition saw - 350mm (Petrol) |  | $220.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-demolition-saw-350mm-petrol |

**Proposed RTT:** day $198.00 · weekend $297.00 · week $693.00. *Rule:* 10% below Mega Hire day $220.00; week: 10% below Superior Hire $770.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Concrete floor saw - walk-behind 350mm petrol (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CONCRETE SAW - 350MM (14IN) PETROL | $207.00 | $246.00 |  | $933.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/walk-behind-saw/concrete-saw-350-mm-14-in-petrol |
| Allwell Hire (Mitchelton QLD) | Concrete Saw | $120.00 | $140.00 |  | $560.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/concrete-saw/ |
| Mega Hire (Acacia Ridge QLD) | 350mm floor saw (petrol) |  | $242.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-husqvarna-concrete-saw-350mm-petrol |

**Proposed RTT:** day $126.00 · weekend $189.00 · week $504.00. *Rule:* 10% below Allwell Hire day $140.00; week: 10% below Allwell Hire $560.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Brick / paver saw (350mm) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | SAW - BRICK 350MM (14IN) ELECTRIC | $168.00 | $193.00 |  | $668.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/brick-block-saws/saw-brick-350-mm-14-in-electric |
| Bunnings Hire Shop (national online price) | For Hire: Brick Saw with Blade (Crommelins) |  | $127.00 |  | $536.00 | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment ; https://www.bunnings.com.au/for-hire-brick-saw-with-blade-7-days_p0193200 |
| Superior Hire (Loganholme QLD) | Brick Saw 14" |  | $190.00 |  | $665.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/masonry-14-saw |
| Allwell Hire (Mitchelton QLD) | Brick Saw and Paver Cutter (Includes Blade) | $90.00 | $110.00 |  | $440.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/brick-saw-incl-blade/ |
| Mega Hire (Acacia Ridge QLD) | Brick saw - 350mm Electric |  | $165.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-bianco-saw-brick-350mm-electric |

**Proposed RTT:** day $99.00 · weekend $148.50 · week $396.00. *Rule:* 10% below Allwell Hire day $110.00; week: 10% below Allwell Hire $440.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Drilling & fastening

#### Rotary hammer drill - light (SDS-plus) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LIGHT ROTARY HAMMER | $94.00 | $117.00 |  | $473.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/hammers-breakers/hammer-rotary-light |
| Superior Hire (Loganholme QLD) | Rotary Hammer Drill Compact (SDS Plus) |  | $25.00 |  | $90.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/rotary-hammer-18mm |
| Mega Hire (Acacia Ridge QLD) | Rotary hammer drill - Light (Electric) |  | $88.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilti-rotary-hammer-drill-light-electric |

**Proposed RTT:** day $22.50 · weekend $34.00 · week $81.00. *Rule:* 10% below Superior Hire day $25.00; week: 10% below Superior Hire $90.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Rotary hammer drill - heavy (SDS-max) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | HEAVY ROTARY HAMMER | $116.00 | $142.00 |  | $570.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/hammers-breakers/hammer-rotary-heavy |
| Superior Hire (Loganholme QLD) | Rotary Hammer Drill (SDS Max) |  | $50.00 |  | $175.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/compact-rotary-hammer-18mm |
| Mega Hire (Acacia Ridge QLD) | Rotary Hammer drill - Heavy (Electric) |  | $99.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-hilti-rotary-hammer-drill-heavy-electric |

**Proposed RTT:** day $45.00 · weekend $67.50 · week $157.50. *Rule:* 10% below Superior Hire day $50.00; week: 10% below Superior Hire $175.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Hammer / percussion drill (13mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 13MM (1/2IN) PERCUSSION DRILL | $47.00 | $53.00 |  | $151.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/drills/drill-percussion-13-mm-1-2-in |
| Superior Hire (Loganholme QLD) | Impact Hammer Drill |  | $40.00 |  | $140.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/medium-elec-hammer-drill |
| Allwell Hire (Mitchelton QLD) | Hammer Drill – 5mm-16mm | $38.72 | $48.40 |  | $145.20 | GST not stated on page. |  | https://www.allwellhire.com.au/product/hammer-drill-5mm-16mm/ |

**Proposed RTT:** day $36.00 · weekend $54.00 · week $126.00. *Rule:* 10% below Superior Hire day $40.00; week: 10% below Superior Hire $140.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Cordless drill (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CORDLESS DRILL | $43.00 | $55.00 |  | $150.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/drills/drill-cordless |

**Proposed RTT:** day $49.50 · weekend $74.00 · week $135.00. *Rule:* 10% below Kennards Hire day $55.00; week: 10% below Kennards Hire $150.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Cordless 1/2in impact wrench (18V) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 13MM CORDLESS 18V  IMPACT WRENCH | $60.00 | $60.00 |  | $225.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/fastening/impact-wrench-13-mm-cordless-18-v |

**Proposed RTT:** day $54.00 · weekend $81.00 · week $202.50. *Rule:* 10% below Kennards Hire day $60.00; week: 10% below Kennards Hire $225.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Electric impact wrench 3/4in (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 19MM ELECTRIC IMPACT WRENCH | $35.00 | $35.00 |  | $98.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/fastening/impact-wrench-19-mm-electric |

**Proposed RTT:** day $31.50 · weekend $47.00 · week $88.00. *Rule:* 10% below Kennards Hire day $35.00; week: 10% below Kennards Hire $98.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Mixing drill / paddle mixer (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MIXING DRILL | $67.00 | $79.00 |  | $226.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/drills/drill-mixing |

**Proposed RTT:** day $71.00 · weekend $106.50 · week $203.00. *Rule:* 10% below Kennards Hire day $79.00; week: 10% below Kennards Hire $226.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Magnetic base drill (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MAGNETIC BASE BROACH DRILL | $178.00 | $220.00 |  | $822.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/drills/drill-magnetic-base-broach |
| Superior Hire (Loganholme QLD) | Magnetic Drill |  | $160.00 |  | $560.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/magnetic-35mm-drill |
| Mega Hire (Acacia Ridge QLD) | Magnetic drill - Battery |  | $143.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-magnetic-drill-rotabroach-cordless |

**Proposed RTT:** day $128.50 · weekend $193.00 · week $504.00. *Rule:* 10% below Mega Hire day $143.00; week: 10% below Superior Hire $560.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Cutting & sawing

#### Angle grinder 125mm (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 115MM TO 125MM ANGLE GRINDER | $43.00 | $55.00 |  | $170.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/grinders/grinder-angle-115-mm-to-125-mm |
| Superior Hire (Loganholme QLD) | Angle Grinder 5" |  | $50.00 |  | $180.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/angle-grinder-125mm-5 |

**Proposed RTT:** day $45.00 · weekend $67.50 · week $153.00. *Rule:* 10% below Superior Hire day $50.00; week: 10% below Kennards Hire $170.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Angle grinder 230mm (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 225MM ANGLE GRINDER | $50.00 | $57.00 |  | $214.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/grinders/grinder-angle-225-mm |
| Superior Hire (Loganholme QLD) | Angle Grinder 9" |  | $60.00 |  | $210.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/angle-grinder-230mm |

**Proposed RTT:** day $51.00 · weekend $76.50 · week $189.00. *Rule:* 10% below Kennards Hire day $57.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Circular saw (~235mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 225MM (9IN) CIRCULAR SAW | $31.00 | $31.00 |  | $68.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/saws-other/saw-circular-225-mm-9-in |
| Superior Hire (Loganholme QLD) | Circular Saw 9" |  | $50.00 |  | $175.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/circular-saw-235mm |

**Proposed RTT:** day $27.50 · weekend $41.00 · week $61.00. *Rule:* 10% below Kennards Hire day $31.00; week: 10% below Kennards Hire $68.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Jigsaw (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | JIG SAW | $46.00 | $52.00 |  | $144.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/saws-other/saw-jig |
| Superior Hire (Loganholme QLD) | Jigsaw |  | $20.00 |  | $70.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/jigsaw-18mm |

**Proposed RTT:** day $18.00 · weekend $27.00 · week $63.00. *Rule:* 10% below Superior Hire day $20.00; week: 10% below Superior Hire $70.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Reciprocating / sabre saw (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | SABRE SAW | $31.00 | $31.00 |  | $68.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/saws-other/saw-sabre |
| Superior Hire (Loganholme QLD) | Reciprocating Saw |  | $30.00 |  | $105.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/reciprocating-saw |

**Proposed RTT:** day $27.00 · weekend $40.50 · week $61.00. *Rule:* 10% below Superior Hire day $30.00; week: 10% below Kennards Hire $68.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Mitre / drop saw (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 250MM TO 350MM MITRE/DOCKING SAW | $108.00 | $127.00 |  | $378.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/saws-other/saw-mitre-docking-250-mm-to-350-mm |

**Proposed RTT:** day $114.00 · weekend $171.00 · week $340.00. *Rule:* 10% below Kennards Hire day $127.00; week: 10% below Kennards Hire $378.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Metal cut-off saw 355mm (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 300MM TO 350MM METAL CUT OFF SAW | $82.00 | $102.00 |  | $358.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/saws/saws-other/saw-metal-cut-off-300-mm-to-350-mm |
| Superior Hire (Loganholme QLD) | Metal Cut Off Saw 14" |  | $60.00 |  | $210.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/cut-off-saw-355mm-14 |

**Proposed RTT:** day $54.00 · weekend $81.00 · week $189.00. *Rule:* 10% below Superior Hire day $60.00; week: 10% below Superior Hire $210.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Electric planer (hand) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 75MM PLANER WOOD | $48.00 | $48.00 |  | $130.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/cutting-bending-planing/planer-wood-75-mm |
| Superior Hire (Loganholme QLD) | Planer 3” |  | $20.00 |  | $70.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/planer-82mm-3 |

**Proposed RTT:** day $18.00 · weekend $27.00 · week $63.00. *Rule:* 10% below Superior Hire day $20.00; week: 10% below Superior Hire $70.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Drilling & fastening

#### Framing nailer (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CORDLESS FRAME NAIL GUN | $57.00 | $69.00 |  | $192.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/fastening/nail-gun-frame-cordless |
| Bunnings Hire Shop (national online price) | For Hire: Impulse Frame Master Gas Nailer (Paslode) |  | $46.00 |  |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment/building-equipment-hire |
| Superior Hire (Loganholme QLD) | Framer Nail Gun (Air) |  | $30.00 |  | $105.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/pneumatic-air-framer-50-90mm |
| Allwell Hire (Mitchelton QLD) | Nail Gun – Framing | $40.65 | $50.82 |  | $203.28 | GST not stated on page. |  | https://www.allwellhire.com.au/product/nail-gun-framing/ |

**Proposed RTT:** day $27.00 · weekend $40.50 · week $94.50. *Rule:* 10% below Superior Hire day $30.00; week: 10% below Superior Hire $105.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Coil / fencing nailer (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CORDLESS COIL NAIL GUN | $68.00 | $85.00 |  | $317.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/fastening/nail-gun-coil-cordless |
| Bunnings Hire Shop (national online price) | For Hire: Air Coil Nailer (Paslode) | $34.00 |  |  |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment/building-equipment-hire |
| Superior Hire (Loganholme QLD) | Coil Gun (Air) |  | $60.00 |  | $210.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/pneumatic-air-coil-gun-2-5x64mm |
| Allwell Hire (Mitchelton QLD) | Nail Gun – Coil/Fence | $40.65 | $50.82 |  | $203.28 | GST not stated on page. |  | https://www.allwellhire.com.au/product/coil-nail-gun/ |

**Proposed RTT:** day $45.50 · weekend $68.00 · week $182.50. *Rule:* 10% below Allwell Hire day $50.82; week: 10% below Allwell Hire $203.28; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Finish / brad nailer (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CORDLESS FINISH NAIL GUN | $57.00 | $69.00 |  | $192.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/fastening/nail-gun-finish-cordless |
| Bunnings Hire Shop (national online price) | For Hire: Air Bradder (Paslode) |  | $46.00 |  |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment |
| Superior Hire (Loganholme QLD) | Brad Nailer (Air) |  | $60.00 |  | $210.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/pneumatic-brad-nailer |
| Allwell Hire (Mitchelton QLD) | Nail Gun – Finish | $40.65 | $50.82 |  | $203.28 | GST not stated on page. |  | https://www.allwellhire.com.au/product/nail-gun-finish/ |

**Proposed RTT:** day $41.00 · weekend $61.50 · week $172.50. *Rule:* 10% below Bunnings Hire Shop day $46.00; week: 10% below Kennards Hire $192.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Secret floor nailer / stapler (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | SECRET AIR FLOOR NAIL GUN | $114.00 | $140.00 |  | $480.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/fastening/nail-gun-floor-secret-air |
| Superior Hire (Loganholme QLD) | Secret Flooring Stapler (Air) |  | $35.00 |  | $120.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/38-50mm-stapler-gun |
| Allwell Hire (Mitchelton QLD) | Nail Gun – Secret Nailer | $63.88 | $79.86 |  | $319.44 | GST not stated on page. |  | https://www.allwellhire.com.au/product/nail-gun-secret-nailer/ |

**Proposed RTT:** day $31.50 · weekend $47.00 · week $108.00. *Rule:* 10% below Superior Hire day $35.00; week: 10% below Superior Hire $120.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Air compressors & air tools

#### Air compressor - small electric (~6-12cfm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | AIR COMPRESSOR   6-12 CFM (ELECTRIC) | $79.00 | $102.00 |  | $303.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/air-compressor-tools/air-compressors/air-compressor-6-12-cfm-electric |
| Bunnings Hire Shop (national online price) | For Hire: Air Compressor (Crommelins) | $39.00 | $51.00 |  |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment ; https://www.bunnings.com.au/for-hire-air-compressor-24hr_p5470065 |
| Superior Hire (Loganholme QLD) | Air Compressor 10CFM |  | $79.00 |  | $275.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/air-compressor |
| Allwell Hire (Mitchelton QLD) | Air Compressor - Large 6-9 CFM | $43.56 | $54.45 |  | $163.35 | GST not stated on page. |  | https://www.allwellhire.com.au/product/air-compressor/ |

**Proposed RTT:** day $45.50 · weekend $68.00 · week $147.00. *Rule:* 10% below Bunnings Hire Shop day $51.00; week: 10% below Allwell Hire $163.35; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Welding

#### Welder - inverter arc (~180A) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 180 AMP INVERTER TYPE ARC WELDER | $110.00 | $138.00 |  | $484.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/welders/welder-arc-180-amp-inverter-type |

**Proposed RTT:** day $124.00 · weekend $186.00 · week $435.50. *Rule:* 10% below Kennards Hire day $138.00; week: 10% below Kennards Hire $484.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Drilling & fastening

#### Torque wrench 1/2in (manual) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MANUAL 1/2IN TORQUE WRENCH | $93.00 | $93.00 |  | $130.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/torquing-bolting/torque-wrench-manual-1-2-in |
| Superior Hire (Loganholme QLD) | Torque Wrench 1/2" |  | $60.00 |  | $210.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/torque-wrench-1-2in-dr |

**Proposed RTT:** day $54.00 · weekend $81.00 · week $117.00. *Rule:* 10% below Superior Hire day $60.00; week: 10% below Kennards Hire $130.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Generators & power

#### Generator ~2kVA (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2 KVA GENERATOR | $91.00 | $112.00 |  | $456.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/generators-power-distribution/generators/generator-2-kva |
| Mega Hire (Acacia Ridge QLD) | 2kva Generator (Petrol/silent) |  | $99.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-generator-2kva-honda-eu20i-inverter |

**Proposed RTT:** day $89.00 · weekend $133.50 · week $410.00. *Rule:* 10% below Mega Hire day $99.00; week: 10% below Kennards Hire $456.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Generator ~3kVA inverter (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 3 KVA INVERTER GENERATOR | $116.00 | $140.00 |  | $500.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/generators-power-distribution/inverters/generator-3-kva-inverter |
| Superior Hire (Loganholme QLD) | Inverter Generator 3KVA |  | $50.00 |  | $310.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/inverter-generator-3kva |
| Allwell Hire (Mitchelton QLD) | Generator Hire – 3kVA Generator | $60.00 | $96.00 |  | $360.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/generator-3kva/ |
| Mega Hire (Acacia Ridge QLD) | 3kva Generator (Petrol/silent) |  | $121.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-honda-generator-3-0kva-inverter |

**Proposed RTT:** day $45.00 · weekend $67.50 · week $279.00. *Rule:* 10% below Superior Hire day $50.00; week: 10% below Superior Hire $310.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Generator ~5kVA (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 5 KVA GENERATOR | $145.00 | $170.00 |  | $677.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/generators-power-distribution/generators/generator-5-kva |
| Mega Hire (Acacia Ridge QLD) | 5KVA Generator Petrol |  | $99.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-generator-5-6kva-crommelins-diesel |

**Proposed RTT:** day $89.00 · weekend $133.50 · week $609.00. *Rule:* 10% below Mega Hire day $99.00; week: 10% below Kennards Hire $677.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Generator ~6-7kVA (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 6 KVA GENERATOR | $156.00 | $198.00 |  | $707.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/generators-power-distribution/generators/generator-6-kva |
| Mega Hire (Acacia Ridge QLD) | 7kva Generator (Petrol/silent) |  | $154.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-generator-7kva-honda-eu70is-inverter |

**Proposed RTT:** day $138.50 · weekend $208.00 · week $636.00. *Rule:* 10% below Mega Hire day $154.00; week: 10% below Kennards Hire $707.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Generator ~10kVA (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 10 KVA GENERATOR | $180.00 | $225.00 |  | $882.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/generators-power-distribution/generators/generator-10-kva |
| Mega Hire (Acacia Ridge QLD) | 10kva Generator (Petrol) |  | $143.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-generator-10kva-petrol |

**Proposed RTT:** day $128.50 · weekend $193.00 · week $793.50. *Rule:* 10% below Mega Hire day $143.00; week: 10% below Kennards Hire $882.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Extension lead 15A (20-30m) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 15AMP 240V 20M LEAD | $21.00 | $23.00 |  | $63.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/tools/leads-accessories/lead-15-amp-240-v-20-m |
| Superior Hire (Loganholme QLD) | Power Lead 30m (10AMP) |  | $10.00 |  | $30.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/30m-power-extension-lead |
| Mega Hire (Acacia Ridge QLD) | Power extension lead 15A - 30m long |  | $11.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-power-extension-lead-15a-30m-long |

**Proposed RTT:** day $9.00 · weekend $13.50 · week $27.00. *Rule:* 10% below Superior Hire day $10.00; week: 10% below Superior Hire $30.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Ladders & access

#### Extension ladder ~6-6.5m (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 3.6M TO 6.3M EXTENSION LADDER | $55.00 | $55.00 |  | $150.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/ladders-scaffold/ladders/ladder-extension-6-3-m-20-5-ft |
| Allwell Hire (Mitchelton QLD) | Extension Ladder Hire - Extension to 6.5 mtrs | $30.00 | $35.00 |  | $140.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/extension-ladder/ |
| Mega Hire (Acacia Ridge QLD) | 6.6m Extension Ladder - Aluminium |  | $48.40 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-6-6m-extension-ladders-aluminium |

**Proposed RTT:** day $31.50 · weekend $47.00 · week $126.00. *Rule:* 10% below Allwell Hire day $35.00; week: 10% below Allwell Hire $140.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Extension ladder ~8-8.5m (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 4.8M TO 8.4M EXTENSION LADDER | $70.00 | $70.00 |  | $190.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/ladders-scaffold/ladders/ladder-extension-8-9-m-29-ft |
| Allwell Hire (Mitchelton QLD) | Extension Ladder Hire - Extension to 8.5 mtrs | $35.00 | $40.00 |  | $180.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/extension-ladder/ |
| Mega Hire (Acacia Ridge QLD) | 8.4m Extension Ladder - Aluminium |  | $55.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-8-4m-extension-ladders-aluminium |

**Proposed RTT:** day $36.00 · weekend $54.00 · week $162.00. *Rule:* 10% below Allwell Hire day $40.00; week: 10% below Allwell Hire $180.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Step ladder 1.8m (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 1.8M (6FT) STEP LADDER | $34.00 | $34.00 |  | $77.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/ladders-scaffold/ladders/ladder-step-1-8-m-6-ft |
| Allwell Hire (Mitchelton QLD) | Step Ladder Hire - 1.8m | $20.00 | $25.00 |  | $100.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/step-ladder/ |
| Mega Hire (Acacia Ridge QLD) | 1.8m Step ladder - double sided Aluminium |  | $28.60 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-indalex-step-ladders-double-sided-aluminium |

**Proposed RTT:** day $22.50 · weekend $34.00 · week $69.00. *Rule:* 10% below Allwell Hire day $25.00; week: 10% below Kennards Hire $77.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Platform ladder ~2.4m (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2.3M (7FT 5IN) PLATFORM LADDER | $55.00 | $55.00 |  | $153.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/ladders-scaffold/ladders/ladder-platform-2-3-m-7-5-ft |
| Superior Hire (Loganholme QLD) | Platform Ladder 2.4m (Fibreglass) |  | $98.00 |  | $274.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/2-4m-platform-ladder |
| Allwell Hire (Mitchelton QLD) | Platform Ladder Hire - 8ft | $40.00 | $50.00 |  | $200.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/platform-ladder/ |
| Mega Hire (Acacia Ridge QLD) | 2.4m Platform ladder - Aluminium |  | $44.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-2-4m-platform-ladder-aluminium |

**Proposed RTT:** day $39.50 · weekend $59.00 · week $137.50. *Rule:* 10% below Mega Hire day $44.00; week: 10% below Kennards Hire $153.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Trestle - aluminium adjustable 2.4m (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2.4M (8FT) ALUMINIUM TRESTLE | $26.00 | $26.00 |  | $37.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/ladders-scaffold/trestles-planks/trestle-aluminium-2-4-m-8-ft |
| Superior Hire (Loganholme QLD) | Aluminium Trestle 2.4m |  | $20.00 |  | $34.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/aluminium-trestles-adjustable-2-4m |
| Allwell Hire (Mitchelton QLD) | Alumininium Trestle Hire - 2.4m | $13.00 | $15.00 |  | $30.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/trestle-aluminium/ |
| Mega Hire (Acacia Ridge QLD) | 2.4m Trestle |  | $22.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-trestles-aluminium-2-4m |

**Proposed RTT:** day $13.50 · weekend $20.00 · week $27.00. *Rule:* 10% below Allwell Hire day $15.00; week: 10% below Allwell Hire $30.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Plank - aluminium 4m (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 4M (GREEN) ALUIMINIUM PLANK | $19.00 | $19.00 |  | $32.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/ladders-scaffold/trestles-planks/plank-aluminium-4-m-green |
| Allwell Hire (Mitchelton QLD) | Plank – Aluminium - 4m | $10.00 | $12.00 |  | $18.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/plank-aluminium/ |
| Mega Hire (Acacia Ridge QLD) | 4.0m Plank |  | $15.40 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-planks-aluminium-4-0m |

**Proposed RTT:** day $10.50 · weekend $16.00 · week $16.00. *Rule:* 10% below Allwell Hire day $12.00; week: 10% below Allwell Hire $18.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Mobile aluminium scaffold - single width ~4-4.5m (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 4.5M SINGLE WIDTH ALUM SCAFFOLD | $101.00 | $101.00 |  | $288.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/ladders-scaffold/scaffoldings/scaffold-alum-4-5-m-single-width-1 |
| Superior Hire (Loganholme QLD) | Mobile Narrow Scaffold - 4.5m |  |  |  | $330.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/mobile-narrow-scaffold-4-5m |
| Mega Hire (Acacia Ridge QLD) | 4.0m Single width scaffold |  | $187.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/mobile-scaffold-tower-single-width-4-0m |

**Proposed RTT:** day $90.50 · weekend $136.00 · week $259.00. *Rule:* 10% below Kennards Hire day $101.00; week: 10% below Kennards Hire $288.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Material handling

#### Panel / sheet lifter (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | PANEL LIFT | $96.00 | $119.00 |  | $419.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/lifting-materials-handling/material-handling/panel-lift |
| Bunnings Hire Shop (national online price) | For Hire: Panel Lift (Crommelins) |  | $40.00 |  |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment |
| Superior Hire (Loganholme QLD) | Sheet Lifter |  | $40.00 |  | $110.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/panel-lifter |
| Allwell Hire (Mitchelton QLD) | Panel Lifter | $53.24 | $66.55 |  | $266.20 | GST not stated on page. |  | https://www.allwellhire.com.au/product/panel-lifter/ |
| Mega Hire (Acacia Ridge QLD) | Panel Lifter |  | $110.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-panel-lifters-gyprock |

**Proposed RTT:** day $36.00 · weekend $54.00 · week $99.00. *Rule:* 10% below Bunnings Hire Shop day $40.00; week: 10% below Superior Hire $110.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Duct / material lifter (~3.6-5m) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Superior Hire (Loganholme QLD) | Duct Lifter 6.4m |  | $160.00 |  | $396.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/material-hoist |
| Allwell Hire (Mitchelton QLD) | Duct Lifter Hire - Small | $77.00 | $90.00 |  | $380.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/duct-lifter/ |
| Mega Hire (Acacia Ridge QLD) | 3.6m (200KG) Duct lifter |  | $121.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-material-hoist-3m-300kg |

**Proposed RTT:** day $81.00 · weekend $121.50 · week $342.00. *Rule:* 10% below Allwell Hire day $90.00; week: 10% below Allwell Hire $380.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Ladders & access

#### Acrow prop (steel, no.2-3) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Superior Hire (Loganholme QLD) | Acrow Prop Size 2 - 1.88m to 3.39m |  |  |  | $20.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/acrow-prop-size-2-1883mm-3393mm |
| Allwell Hire (Mitchelton QLD) | Steel Acrow Props - No. 2 - 1900-3400mm | $11.00 | $11.00 |  | $11.00 | GST not stated on page. | Same figure for half-day/day/week (flat charge as published) | https://www.allwellhire.com.au/product/acrow-props/ |
| Mega Hire (Acacia Ridge QLD) | Acrow Props - steel (1.0m to 5.1m) |  | $16.50 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-acrow-props-steel-0-6m-to-5m |

**Proposed RTT:** day $14.50 · weekend $18.00 · week $18.00. *Rule:* 10% below Mega Hire day $16.50; week: 10% below Superior Hire $20.00; weekend: derived 1.5x RTT day; weekend capped at RTT week *Flags:* weekend_derived_1.5x_day, weekend_capped_at_week


### Plumbing & drainage

#### Drain cleaner - electric eel (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ELECTRIC EEL | $135.00 | $167.00 |  | $594.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/plumbing/pipe-cleaning-maintenance/electric-eel |
| Allwell Hire (Mitchelton QLD) | Drain Cleaner Electric Eel Plumbing Tool | $80.00 | $90.00 |  | $360.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/drain-cleaning-electric-eel/ |
| Mega Hire (Acacia Ridge QLD) | Electric eel |  | $121.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-electric-eel-drain-clearer |

**Proposed RTT:** day $81.00 · weekend $121.50 · week $324.00. *Rule:* 10% below Allwell Hire day $90.00; week: 10% below Allwell Hire $360.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Drain jetter - electric (1800psi) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | DRAIN CLEANER 50MM (2IN) JETTER 1800PSI ELECTRIC | $135.00 | $167.00 |  | $594.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/plumbing/pipe-cleaning-maintenance/drain-cleaner-50-100-mm-2-4-in-jetter-1800-psi-electric |

**Proposed RTT:** day $150.00 · weekend $225.00 · week $534.50. *Rule:* 10% below Kennards Hire day $167.00; week: 10% below Kennards Hire $594.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Drain snake - cordless (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CORDLESS DRAIN SNAKE | $55.00 | $63.00 |  | $176.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/plumbing/pipe-cleaning-maintenance/drain-snake-cordless |

**Proposed RTT:** day $56.50 · weekend $85.00 · week $158.00. *Rule:* 10% below Kennards Hire day $63.00; week: 10% below Kennards Hire $176.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pipe threader - electric (25-50mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 25MM TO 50MM (1IN TO 2IN) ELECTRIC PIPE THREADER | $183.00 | $223.00 |  | $850.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/plumbing/plumbing-tools/pipe-threader-25-mm-to-50-mm-1-in-to-2-in-electric |

**Proposed RTT:** day $200.50 · weekend $301.00 · week $765.00. *Rule:* 10% below Kennards Hire day $223.00; week: 10% below Kennards Hire $850.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pipe freezer kit - electric (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ELECTRIC PIPE FREEZER KIT | $92.00 | $107.00 |  | $282.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/plumbing/plumbing-tools/pipe-freezer-kit-1 |

**Proposed RTT:** day $96.00 · weekend $144.00 · week $253.50. *Rule:* 10% below Kennards Hire day $107.00; week: 10% below Kennards Hire $282.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pipe press / crimper (15-50mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 15MM TO 50MM PIPE CRIMPER | $102.00 | $127.00 |  | $425.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/plumbing/plumbing-tools/pipe-crimper-15-mm-to-50-mm |

**Proposed RTT:** day $114.00 · weekend $171.00 · week $382.50. *Rule:* 10% below Kennards Hire day $127.00; week: 10% below Kennards Hire $425.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Pumps

#### Submersible pump 50mm (dirty water) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 50MM (2IN) SUBMERSIBLE PUMP | $103.00 | $122.00 |  | $496.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/pumps/submersible-pumps/pump-submersible-50-mm-2-in |
| Superior Hire (Loganholme QLD) | Submersible Pump |  | $95.00 |  | $340.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/1500w-automatic-dirty-water-submersible-pump |
| Mega Hire (Acacia Ridge QLD) | 2" submersible pump |  | $88.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-pump-submersible-2in-50mm-electric |

**Proposed RTT:** day $79.00 · weekend $118.50 · week $306.00. *Rule:* 10% below Mega Hire day $88.00; week: 10% below Superior Hire $340.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Petrol transfer / trash pump 50mm (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 50MM (2IN) CENTRIFUGAL PUMP | $130.00 | $130.00 |  | $508.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/pumps/small-pumps/pump-centrifugal-50-mm-2-in |
| Allwell Hire (Mitchelton QLD) | Porta Pump (Petrol) | $66.00 | $88.00 |  | $352.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/porta-pump-petrol/ |

**Proposed RTT:** day $79.00 · weekend $118.50 · week $316.50. *Rule:* 10% below Allwell Hire day $88.00; week: 10% below Allwell Hire $352.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Flexdrive pump kit (petrol) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | PUMP - FLEXDRIVE KIT | $131.00 | $160.00 |  | $637.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/pumps/small-pumps/pump-flexdrive-kit |
| Mega Hire (Acacia Ridge QLD) | Flex Drive Trash Pump Kit - Petrol |  | $143.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-pump-flex-drive-trash-pump-kit |

**Proposed RTT:** day $128.50 · weekend $193.00 · week $573.00. *Rule:* 10% below Mega Hire day $143.00; week: 10% below Kennards Hire $637.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Material handling

#### Hand trolley / sack truck (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2 WHEELS HAND TROLLEY | $34.00 | $48.00 |  | $123.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/lifting-materials-handling/material-handling/hand-trolley-2-wheels |

**Proposed RTT:** day $43.00 · weekend $64.50 · week $110.50. *Rule:* 10% below Kennards Hire day $48.00; week: 10% below Kennards Hire $123.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Stair-climbing / fridge trolley (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Bunnings Hire Shop (national online price) | For Hire: Refrigerator / Stair Trolley |  | $19.00 |  |  | GST not stated on page (AU retail prices are shown GST-inclusive). $100 deposit; no waiver listed. Select stores only. |  | https://www.bunnings.com.au/products/hire-shop/general-hire-equipment |
| Superior Hire (Loganholme QLD) | Stair Climbing Trolley |  | $30.00 |  | $105.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/200kg-stair-climbing-trolley |

**Proposed RTT:** day $17.00 · weekend $25.50 · week $94.50. *Rule:* 10% below Bunnings Hire Shop day $19.00; week: 10% below Superior Hire $105.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Pallet jack ~2.5t (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2.5T PALLET TRUCK | $75.00 | $93.00 |  | $262.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/lifting-materials-handling/material-handling/pallet-truck-2-5-t |
| Superior Hire (Loganholme QLD) | Pallet Jack 2.5T |  | $30.00 |  | $105.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/pallet-jack-2500kg |
| Allwell Hire (Mitchelton QLD) | Pallet Trolley | $33.88 | $42.35 |  | $127.05 | GST not stated on page. |  | https://www.allwellhire.com.au/product/pallet-trolley/ |

**Proposed RTT:** day $27.00 · weekend $40.50 · week $94.50. *Rule:* 10% below Superior Hire day $30.00; week: 10% below Superior Hire $105.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Furniture / piano dolly (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | PIANO DOLLIE | $39.00 | $48.00 |  | $102.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/lifting-materials-handling/material-handling/dollie-piano |
| Superior Hire (Loganholme QLD) | Heavy Duty Dolly |  | $15.00 |  | $50.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/heavy-duty-piano-dolly-525kg |

**Proposed RTT:** day $13.50 · weekend $20.00 · week $45.00. *Rule:* 10% below Superior Hire day $15.00; week: 10% below Superior Hire $50.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Engine hoist / crane (2t) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | ENGINE HOIST | $79.00 | $99.00 |  | $372.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/lifting-materials-handling/material-handling/engine-hoist |
| Superior Hire (Loganholme QLD) | Engine Hoist 2T |  | $80.00 |  | $280.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/2t-engine-crane |

**Proposed RTT:** day $72.00 · weekend $108.00 · week $252.00. *Rule:* 10% below Superior Hire day $80.00; week: 10% below Superior Hire $280.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Chain block / hoist (~2t) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Allwell Hire (Mitchelton QLD) | Chain Hoist - 2Ton | $20.00 | $30.00 |  | $120.00 | GST not stated on page. |  | https://www.allwellhire.com.au/product/chain-hoist/ |

**Proposed RTT:** day $27.00 · weekend $40.50 · week $108.00. *Rule:* 10% below Allwell Hire day $30.00; week: 10% below Allwell Hire $120.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Trailers

#### Box trailer 6x4 (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 1.8M X 1.2M (6FT X 4FT) BOX TRAILER | $40.00 | $50.00 |  | $200.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/trailers/box-or-cage/trailer-box-1-8-m-x-1-2-m-6-ft-x-4-ft |
| Superior Hire (Loganholme QLD) | Trailer 6x4 Cage Trailer 450kg |  | $45.00 |  | $160.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/cage-trailer-6x4-galvanised |

**Proposed RTT:** day $40.50 · weekend $61.00 · week $144.00. *Rule:* 10% below Superior Hire day $45.00; week: 10% below Superior Hire $160.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Box trailer 8x5 (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2.4M X 1.5M (8FT X 5FT) BOX TRAILER | $74.00 | $92.00 |  | $293.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/trailers/box-or-cage/trailer-box-2-4-m-x-1-5-m-8-ft-x-5-ft |

**Proposed RTT:** day $82.50 · weekend $124.00 · week $263.50. *Rule:* 10% below Kennards Hire day $92.00; week: 10% below Kennards Hire $293.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Enclosed trailer (~8x5) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MEDIUM ENCLOSED TRAILER | $127.00 | $153.00 |  | $492.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/trailers/enclosed/trailer-enclosed-medium |
| Mega Hire (Acacia Ridge QLD) | 8x5 Enclosed trailer |  | $143.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-enclosed-moving-furnture-trailer |

**Proposed RTT:** day $128.50 · weekend $193.00 · week $442.50. *Rule:* 10% below Mega Hire day $143.00; week: 10% below Kennards Hire $492.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Tipping trailer 8x5 (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2.4M X 1.5M (8FT X 5FT) TIPPING TRAILER | $102.00 | $127.00 |  | $425.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/trailers/box-or-cage/trailer-tipping-2-4-m-x-1-5-m-8-ft-x-5-ft |

**Proposed RTT:** day $114.00 · weekend $171.00 · week $382.50. *Rule:* 10% below Kennards Hire day $127.00; week: 10% below Kennards Hire $425.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Plant / machinery trailer (~2t) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LARGE PLANT/MACHINERY TRAILER | $68.00 | $100.00 |  | $500.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/trailers/plant-machinery/trailer-plant-machinery-large |
| Superior Hire (Loganholme QLD) | 2T Plant Trailer |  | $77.00 |  | $192.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/2t-plant-trailer |
| Mega Hire (Acacia Ridge QLD) | Plant trailer |  | $66.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/plant-trailer |

**Proposed RTT:** day $59.00 · weekend $88.50 · week $172.50. *Rule:* 10% below Mega Hire day $66.00; week: 10% below Superior Hire $192.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Car trailer (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | CAR TRAILER | $171.00 | $209.00 |  | $784.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/trailers/plant-machinery/trailer-car |
| Mega Hire (Acacia Ridge QLD) | Car Trailer - Heavy Duty 3.5T |  | $187.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-car-trailer-heavy-duty-3-5-atm |

**Proposed RTT:** day $168.00 · weekend $252.00 · week $705.50. *Rule:* 10% below Mega Hire day $187.00; week: 10% below Kennards Hire $784.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Heating, cooling & ventilation

#### Pedestal fan (industrial ~600-750mm) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 600MM (24IN) PEDESTAL FAN | $68.00 | $81.00 |  | $230.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/heating-ventilation-cooling/fans/fan-pedestal-600-mm-24-in |
| Superior Hire (Loganholme QLD) | Pedestal Fan Industrial |  | $40.00 |  | $140.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/heavy-duty-pedestal-fan-750mm |

**Proposed RTT:** day $36.00 · weekend $54.00 · week $126.00. *Rule:* 10% below Superior Hire day $40.00; week: 10% below Superior Hire $140.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Portable air conditioner (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | SMALL AIR CONDITIONER | $93.00 | $93.00 |  | $199.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/heating-ventilation-cooling/air-conditioners/air-conditioner-small |
| Superior Hire (Loganholme QLD) | Portable Air-Conditioner (Residential) |  | $49.00 |  | $170.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/portable-air-conditioner-residential |
| Mega Hire (Acacia Ridge QLD) | 4KW Air conditioner (residential) |  | $88.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-residential-air-conditioner-4kw |

**Proposed RTT:** day $44.00 · weekend $66.00 · week $153.00. *Rule:* 10% below Superior Hire day $49.00; week: 10% below Superior Hire $170.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Evaporative air cooler (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MEDIUM 3 SPEED EVAPORATIVE AIR COOLER | $111.00 | $111.00 |  | $403.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/heating-ventilation-cooling/air-coolers/air-cooler-evaporative-medium-3-speed |

**Proposed RTT:** day $99.50 · weekend $149.00 · week $362.50. *Rule:* 10% below Kennards Hire day $111.00; week: 10% below Kennards Hire $403.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Exhaust / extraction fan 300mm (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 300MM (12IN) EXHAUST FAN | $81.00 | $98.00 |  | $398.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/heating-ventilation-cooling/fans/fan-exhaust-300-mm-12-in |
| Superior Hire (Loganholme QLD) | Extraction Fan |  | $65.00 |  | $245.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/extraction-fan-w-5m-hose |
| Mega Hire (Acacia Ridge QLD) | 300MM Exhaust Fans |  | $77.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-cromtech-fan-ventilator-300mm |

**Proposed RTT:** day $58.50 · weekend $88.00 · week $220.50. *Rule:* 10% below Superior Hire day $65.00; week: 10% below Superior Hire $245.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Patio heater - LPG (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LPG PATIO HEATER | $77.00 | $77.00 |  | $160.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/heating-ventilation-cooling/heaters/heater-patio-lpg |
| Mega Hire (Acacia Ridge QLD) | Patio Heater |  | $44.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/heater-gas-patio |

**Proposed RTT:** day $39.50 · weekend $59.00 · week $144.00. *Rule:* 10% below Mega Hire day $44.00; week: 10% below Kennards Hire $160.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Survey & measuring

#### Laser level (rotary) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LASER LEVEL | $151.00 | $180.00 |  | $641.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/test-measure/construction-survey/level-laser |
| Superior Hire (Loganholme QLD) | Rotary Laser |  | $95.00 |  | $330.00 | GST not stated on page. Delivery/collection extra. |  | https://superioraccesshire.com.au/products/p500-self-leveling-rotary-laser-kit |
| Allwell Hire (Mitchelton QLD) | Laser Level | $62.92 | $78.65 |  | $314.60 | GST not stated on page. |  | https://www.allwellhire.com.au/product/laser-level/ |
| Mega Hire (Acacia Ridge QLD) | Laser Level - Hilti (Dual grade) |  | $165.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-laser-level-hilti-dual-grade |

**Proposed RTT:** day $70.50 · weekend $106.00 · week $283.00. *Rule:* 10% below Allwell Hire day $78.65; week: 10% below Allwell Hire $314.60; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Automatic (dumpy) level (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | AUTOMATIC LEVEL | $89.00 | $102.00 |  | $347.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/test-measure/construction-survey/level-automatic |

**Proposed RTT:** day $91.50 · weekend $137.00 · week $312.00. *Rule:* 10% below Kennards Hire day $102.00; week: 10% below Kennards Hire $347.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Moisture meter (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | MOISTURE METER | $67.00 | $78.00 |  | $230.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/test-measure/building-inspection/moisture-meter |

**Proposed RTT:** day $70.00 · weekend $105.00 · week $207.00. *Rule:* 10% below Kennards Hire day $78.00; week: 10% below Kennards Hire $230.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day

#### Laser distance measure (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | LASER DISTANCE MEASURE | $65.00 | $65.00 |  | $184.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. |  | https://www.kennards.com.au/for-hire/test-measure/construction-survey/laser-distance-measure |

**Proposed RTT:** day $58.50 · weekend $88.00 · week $165.50. *Rule:* 10% below Kennards Hire day $65.00; week: 10% below Kennards Hire $184.00; weekend: derived 1.5x RTT day *Flags:* weekend_derived_1.5x_day


### Site equipment

#### Temporary fence panel (mesh 2.4x1.8m) (light)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | 2.4 X 1.8 MESH FENCE PANEL | $13.00 | $13.00 |  | $13.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. | Same figure for 4hr/day/week (flat charge per hire as published) | https://www.kennards.com.au/for-hire/site-equipment/temporary-fencing/fence-panel-2-4-x-1-8-mesh |

**Proposed RTT:** day $11.50 · weekend $11.50 · week $11.50. *Rule:* 10% below Kennards Hire flat per-hire $13.00 (same for every period) *Flags:* flat_per_hire_rate_mirrors_competitor

#### Portable toilet (construction / event) (heavy)

| Competitor | Exact item name as listed | 4hr / half day | Day (24h) | Weekend | Week | GST / fees | Notes | Source (checked 2026-10-10) |
|---|---|---|---|---|---|---|---|---|
| Kennards Hire (Rocklea QLD branch) | FRESHWATER SKID TOILET | $57.00 | $57.00 |  | $57.00 | Incl. GST and basic damage waiver (Kennards FAQ). Optional Equipment Waiver Plus extra on medium/large plant. | Same figure for 4hr/day/week (flat charge per hire as published) | https://www.kennards.com.au/for-hire/site-equipment/showers-toilets/toilet-freshwater-skid |
| Allwell Hire (Mitchelton QLD) | Chemical Flush Toilet – Trailer Mounted |  | $165.00 |  | $242.00 | GST not stated on page. | "Day" = 1-4 days (event pricing); "Week" = 4-7 days | https://www.allwellhire.com.au/product/chemical-flush-toilet/ |
| Allwell Hire (Mitchelton QLD) | Portable Toilet – Chemical Flush – Trailer Mounted |  |  |  | $110.00 | GST not stated on page. | 1-month minimum hire | https://www.allwellhire.com.au/product/chemical-flush-toilet-builders-hire-1-month-minimum/ |
| Mega Hire (Acacia Ridge QLD) | Toilet skid (Event) |  | $121.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/toilet-skid-event |
| Mega Hire (Acacia Ridge QLD) | Trailer mounted toilet |  | $176.00 |  |  | GST not stated. Catalogue shows day rate only ($X/day); long-term rates on request. |  | https://www.megahire.com.au/products/hire-toilet-freshwater-trailer |

**Proposed RTT:** day POR · weekend POR · week POR. *Rule:* price on request - Published toilet prices are not like-for-like (flat per-hire charges, event 1-4 day pricing, 1-month minimum builders' hire, servicing/pump-outs not shown), so a per-period rate can't be fairly derived. Price on request until the owner confirms the servicing model.


## Excluded - confirm with owner

These are in the Kennards (and formerly Bunnings/Coates) ranges but need licensed operators, trucks or heavy transport, or are site accommodation. They were left out of the RTT price list on purpose. Example Kennards Rocklea rates are given for context only (checked 2026-10-10, incl. GST).

| Excluded group | Examples (Kennards Rocklea: 4hr / day / week) |
|---|---|
| Excavators over 5t | 5.5T zero swing excavator $693/$693/$2,569; 8T excavator $822/$822/$3,858 |
| Large rollers (4t+) and padfoot rollers | 4T smooth double drum $434/$587/$1,961; 7T padfoot single drum $434/$598/$2,079; 13T single drum $570/$570/$2,233 |
| Large skid steers / tracked loaders | Large tracked skid steer $661/$661/$2,533; X-large tracked $516/$619/$2,219 |
| Boom lifts, scissor lifts, man lifts, EWPs, trailer-mounted cherry pickers | Kennards access range (not crawled); Mega Hire 12m trailer boom $374/day |
| Cranes, forklifts, telehandlers, hoists, gantries | Kennards lifting range (not crawled) |
| Site accommodation, ablution and shower blocks | 6.0m x 3.0m M/F ablution block $593 flat; 12m x 3m ablution block $837 flat |
| Vehicles and tippers (licence/insurance) | Kennards tippers/utes/vans (not crawled) |
| Large towable air compressors (100cfm+) and breaker packages | 130 CFM $269/$330/$1,341; 250-275 CFM $373/$461/$1,755 |
| Large generators (20kVA+) and light towers | 20 kVA $239/$239/$718 |
| Ride-on scrubbers, sweepers and floor scrapers | Ride-on battery scrubber $570/$570/$2,052; ride-on LPG floor scraper $1,268/$1,268/$5,547 |
| Road saws, wall saws, large concrete planers/shotblasters, mixer pumps | 600mm petrol road saw $638/$686/$2,647; 50L 415V mixer pump $485/$485/$1,365 |
| Large tracked dumpers, 4WD dumpers, chippers 150mm+ | 1T 4WD high-tip dumper $409/$409/$1,594; 150mm towable chipper $463/$463/$1,394 |
| Rail, traffic management, cable-pulling, confined-space and specialist test equipment | Kennards specialist ranges |


## Published rates: smoothed for consistency (owner approved, 10 October 2026)

Before publishing, the rates above were checked by `scripts/build-hire-data.py`:
- Within each size family (pressure washers by psi, generators by kVA, excavators by tonnage, plate compactors, demolition hammers and jackhammers, impact wrenches, rotary hammers, angle grinders, extension ladders, cement mixers, box trailers, post hole diggers, concrete grinders, floor sanders), a larger or heavier item is never cheaper than a smaller one for the same period.
- Every item keeps day <= weekend <= week.
- Every rate stays at or below the lowest verified competitor price for that period. Where raising the larger item would have broken that cap, the smaller item was lowered instead.

The published catalogue (`data/hire-items.json`) uses the smoothed figures. Every change is listed below. Items not listed are published exactly as researched.

| Item | Period | Researched RTT | Published | Smoothed for consistency |
|---|---|---|---|---|
| Pressure washer - petrol ~2000-2500psi | day | $108.00 | $62.00 | smoothed for consistency: Pressure washers: lowered so it sits at or under the larger Pressure washer - petrol ~3000psi |
| Pressure washer - petrol ~2000-2500psi | week | $432.00 | $289.50 | smoothed for consistency: Pressure washers: lowered so it sits at or under the larger Pressure washer - petrol ~3000psi |
| Generator ~2kVA | day | $89.00 | $45.00 | smoothed for consistency: Generators: lowered so it sits at or under the larger Generator ~3kVA inverter |
| Generator ~10kVA | day | $128.50 | $138.50 | smoothed for consistency: Generators: raised to match the smaller Generator ~6-7kVA |
| Generator ~2kVA | week | $410.00 | $279.00 | smoothed for consistency: Generators: lowered so it sits at or under the larger Generator ~3kVA inverter |
| Mini excavator ~1t | day | $277.00 | $175.50 | smoothed for consistency: Excavators: lowered so it sits at or under the larger Mini excavator ~1.7-1.8t |
| Mini excavator ~1t | week | $1575.00 | $706.50 | smoothed for consistency: Excavators: lowered so it sits at or under the larger Mini excavator ~1.7-1.8t |
| Cordless 1/2in impact wrench (18V) | day | $54.00 | $31.50 | smoothed for consistency: Impact wrenches: lowered so it sits at or under the larger Electric impact wrench 3/4in |
| Cordless 1/2in impact wrench (18V) | week | $202.50 | $88.00 | smoothed for consistency: Impact wrenches: lowered so it sits at or under the larger Electric impact wrench 3/4in |
| Concrete grinder - hand-held | day | $146.50 | $125.00 | smoothed for consistency: Concrete grinders: lowered so it sits at or under the larger Concrete floor grinder (walk-behind, single head) |
| Pressure washer - petrol ~2000-2500psi | weekend | $162.00 | $93.00 | smoothed for consistency: derived weekend recalculated as 1.5x the smoothed day rate (capped at the week rate) |
| Concrete grinder - hand-held | weekend | $220.00 | $187.50 | smoothed for consistency: derived weekend recalculated as 1.5x the smoothed day rate (capped at the week rate) |
| Mini excavator ~1t | weekend | $415.50 | $263.00 | smoothed for consistency: derived weekend recalculated as 1.5x the smoothed day rate (capped at the week rate) |
| Cordless 1/2in impact wrench (18V) | weekend | $81.00 | $47.00 | smoothed for consistency: derived weekend recalculated as 1.5x the smoothed day rate (capped at the week rate) |
| Generator ~2kVA | weekend | $133.50 | $67.50 | smoothed for consistency: derived weekend recalculated as 1.5x the smoothed day rate (capped at the week rate) |
| Generator ~10kVA | weekend | $193.00 | $207.50 | smoothed for consistency: derived weekend recalculated as 1.5x the smoothed day rate (capped at the week rate) |
| Generator ~10kVA | weekend | $207.50 | $208.00 | smoothed for consistency: Generators: raised to match the smaller Generator ~6-7kVA |
