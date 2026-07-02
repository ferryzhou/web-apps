# Deep-research checklist (do this BEFORE drawing)

A battle map is only as good as the scholarship under it. Produce a **research brief** first;
the map is just the brief rendered. For any non-trivial campaign, present the brief (or at least
the coordinate table + the answers to the standard questions) to the user before committing to a
full redraw — geography decisions are expensive to undo.

## 1. Sources

Web-search the campaign, then cross-check the standard history. For Chinese medieval campaigns:
《资治通鉴》 (find the exact 卷) + the relevant 正史 (《晋书》《宋书》《魏书》…). Wikipedia/Baidu are
fine for orientation and modern place-names, but anchor claims (dates, troop figures, who moved
where) to the primary text. Note every discrepancy — they become footnotes (注).

WebFetch of Wikipedia can 403; if so, search-snippet + Baidu/百度百科 + ctext usually suffice.

## 2. The standard questions — answer ALL of them explicitly

These are the questions that separate a real map from a decorative one. The Huan Wen 3rd
expedition map turned good only once each was answered:

1. **Mode of movement, leg by leg.** Was the advance by **water** (fleet/舟师) or **land**? The
   retreat? If the mode changed, **why?** (e.g. Huan Wen advanced by fleet up canals, then *burned
   the boats* and retreated overland — that contrast is the story.) Draw water legs following
   rivers; draw land legs as land routes.
2. **Supply / logistics.** What were the **grain-supply lines** (漕运/粮道)? Were they canals,
   roads, a fleet? **Where and how were they cut or did they fail?** Is logistics the *decisive*
   factor? If yes, supply becomes a first-class layer on the map (gold artery + ✕ cut-marks),
   not an afterthought.
3. **How many powers, and where does each force enter?** Two-sided, or a third party? For every
   army — including reinforcements — identify its **origin**, even if that origin is off the map
   edge (a distant capital → an edge arrow). "Where did the relief army come from?" is a question
   readers always have; answer it on the map.
4. **Every place = modern city + (lon, lat).** No place goes on the map without a modern
   identification and coordinates. Flag any site whose location is disputed.
5. **Discrepancies** between sources (troop numbers, a place's identity, a date) → footnotes,
   phrased as source-critical caveats, not silent choices.

## 3. Coordinate table (fill this before drawing)

Cities — group by power/role:

| 地名 | 今地 (modern) | 经度 E | 纬度 N | 归属/角色 |
|------|--------------|--------|--------|-----------|
| …    | …            | 114.42 | 35.55  | 晋·最远点  |

Waters (rivers, canals, lakes) — give a course as 2–4 control points, not one dot:

| 水名 | 走向 / 控制点 (lon,lat → lon,lat) | 角色 |
|------|-----------------------------------|------|
| 黄河 | 西→东,枋头在南岸                    | 主脉 |
| 桓公渎 | 巨野泽(116.0,35.5) 新凿,引汶入清   | 369新开漕渠 |

Terrain worth drawing: mountain ranges that channel movement (a pass, a flank), marshes/lakes a
canal was dug through. Note them with rough coordinates too.

## 4. Projection cookbook (turn coordinates into SVG)

The viewBox is `0 0 1000 640`. Use a simple linear (light-Mercator) projection:

```
x = OX + (lon − LON0) · KX
y = OY − (lat − LAT0) · KY        // minus: north is up
```

- Choose a **lon/lat window** that covers the theater with a margin. Find min/max lon & lat of the
  places you must show; set LON0 = left-edge lon, LAT0 = bottom-edge lat.
- Choose **KX, KY** so the extremes land inside roughly `x∈[60,960]`, `y∈[70,590]` (leave margins
  for labels). Keep KX ≈ KY for undistorted shapes (a small aspect stretch is fine).
- **Worked example (Huan Wen 3rd, theater ≈ 111–119.3°E, 31.3–36.6°N):**
  `x = 95 + (lon−111.0)·103.6`, `y = 600 − (lat−31.3)·106`.
  → 枋头(114.42,35.55)=(449,148); 邺(114.20,36.28)=(427,74); 石门·荥阳(113.40,34.92)=(344,216).
- **Off-map outliers.** A far capital (e.g. 长安 108.95°E, well west of the window) should NOT
  squash the theater. Leave it out of the window and draw an **edge arrow** ("⟵ 长安·关中") plus a
  route entering from that edge. Same for a distant refuge a fleeing ruler eyes (和龙 etc.) —
  mention in a note rather than distort the frame.
- Rivers/borders are smooth **Bézier** paths through the control points, never polylines.
- After drawing: **screenshot every phase** and check the geometry reads true (who is N/S/E/W of
  whom) and that labels don't collide. Nudge label x/y; the projection stays fixed.

## 5. Sanity check the result against the brief

Before delivering, re-read the brief and confirm the map answers questions 1–5 visibly: a viewer
should be able to see the movement mode, the supply line and where it broke, and where each power
came from — without reading the footnotes.
