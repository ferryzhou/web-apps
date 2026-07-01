---
name: battle-map
description: Build an interactive HTML/SVG historical campaign map in a fixed "aged-silk parchment" house style — framed parchment card, double border, red seal stamp, calligraphic Chinese title, hatched approximate borders, teal/red/brown army routes, gold battle rings, clickable city markers, a phase-toggle, and source-critical footnotes. Use this skill WHENEVER the user asks to create, draw, or generate a battle map, campaign map, 战役地图, 进军图, 北伐地图, or any map of a historical military campaign or expedition — even if they don't name the style. The whole point is style consistency across maps, so always use this skill for battle maps rather than improvising a new look.
---

# Battle Map (战役地图)

Produce a single self-contained `.html` file: an interactive SVG campaign map rendered in one fixed visual identity, so every map the user requests looks like it belongs to the same atlas. The user has an existing series (Huan Wen's three Northern Expeditions, the Feishui campaign) in this exact style — match it precisely. Do not redesign; reuse the house style and only change the content.

**Two things make a map good, not just pretty: the scholarship under it, and the geography being true.** Research deeply first, project by real coordinates, and make the campaign's *decisive mechanism* (often supply, a pass, a canal — not the battles) legible. The rest of this file is how.

## Workflow

1. **Deep research FIRST — build a research brief before drawing.** Follow `references/research-checklist.md`. Produce: (a) the phase breakdown; (b) a **coordinate table** of every city AND every river/lake with modern location + (lon, lat); (c) explicit answers to the **standard questions** — *was movement by water or land, and why did it change? what were the supply lines and where were they cut? how many powers, and where does each force (incl. reinforcements) enter from?* Anchor to primary sources (《资治通鉴》 + the relevant 正史), note discrepancies as footnotes. For any non-trivial campaign or significant redraw, **present the brief (or at least the coordinate table + answers) to the user before committing to the full build** — and use `AskUserQuestion` for scope calls (e.g. full reprojection vs. light touch-up, how to handle an off-map capital).
2. **Read the design skill** once: `view /mnt/skills/public/frontend-design/SKILL.md`.
3. **Pick your starting file.** `references/template.html` is the minimal scaffold (2 realms, no logistics). `references/example-huanwen3-369.html` is the full exemplar (3 hatched realms, off-map edge arrow, gold 漕运/粮道 supply artery + ✕ cut-marks, 水路 vs 陆路 legs, and the 释要 explainer). **Start from the exemplar whenever the campaign has supply lines, 3+ powers, water-vs-land movement, or a decisive logistical mechanism.** Keep all CSS tokens; change only content.
4. **Project by real coordinates** (see *Geo-projection*). Turn the coordinate table into a linear light-Mercator projection; far outliers become **edge arrows**, not squashed frames. Geometry must read true (correct who-is-N/S/E/W-of-whom), never a schematic vertical spine.
5. **Draw the two route grammars.** Movement routes (teal/red by role); AND, when logistics decides the campaign, the **gold 漕运/粮道 supply artery** with red ✕ cut-marks. Distinguish **water legs** (drawn along rivers/canals) from **land legs**.
6. **Add a 释要 explainer block** (encouraged) when one mechanism decides the outcome — a mini schematic + two-column prose so the crux is legible without the footnotes. See *The 释要 explainer*.
7. **Validate AND screenshot.** Run the Node check (tag balance, pattern order, JS syntax) *and* screenshot every phase in a headless browser; fix label collisions and geometry; iterate.
8. **Output two filenames.** `战役名.html` (Chinese) AND an ASCII copy like `campaign-year.html` — the ASCII copy is what hosts on GitHub Pages.
9. **Offer the next step.** Mention it can go onto their GitHub Pages, and offer to add it to / build a unified index page if they have several maps.

## House style (do not alter)

These tokens ARE the brand. Copy them verbatim from the template's `:root`.

- **Ground:** dark wood-grain radial `radial-gradient(circle at 20% 10%, #4a4334, #322c20 55%, #221d14)`.
- **Card:** parchment `--paper:#e9dec4` inside a `3px double var(--border)` frame with inset warm shadow. Max-width 880px, centered, single column.
- **Type:** `Ma Shan Zheng` for the title and seal (calligraphic); `Noto Serif SC` for everything else, with `Songti SC/SimSun` fallback.
- **Seal:** a small red (`--seal:#9a2b1e`) square stamp, rotated ~−5°, top-right of the frame, 2×2 calligraphic characters naming the battle (e.g. 淝/水/之/役).
- **Army colors (semantic, by ROLE not by name):**
  - protagonist / the side the map follows → **teal** `--advance:#1f4e54`
  - opponent → **vermilion** `--enemy:#9a2b1e`
  - rout or retreat → **brown dashed** `--ret:#7a5a23`
  - a **third power** (e.g. a relief army from another state) → **muted purple** `--qin:#5c4a6e`, dashed (`.march.qin`). Still recolor by role, not dynasty; purple is reserved for "third party," not "any enemy."
- **Map marks:** gold ring `--gold:#9c7a2c` = pitched battle; red diamond = enemy camp; rivers `--water:#5f7f88` as thin smooth strokes; mountains as triple-peak strokes / faint `.mtn.fill` silhouettes; marshes as `.marsh`.
- **Borders:** never a hard line. Diagonal-hatch `<pattern>` fills (one per realm — a **third** realm uses a distinct hatch *direction*, see below) plus a dot-dash "约界" (approximate boundary) stroke, with a footnote saying the border is schematic.
- **Arrowheads:** SVG `<marker>` per army color; routes draw on with a dash-offset animation, guarded by `prefers-reduced-motion`.

## Geo-projection (accurate, not schematic)

viewBox is `0 0 1000 640`. From the coordinate table:

```
x = OX + (lon − LON0) · KX
y = OY − (lat − LAT0) · KY        // minus so north is up
```

- Pick a lon/lat window covering the theater with a margin; set KX≈KY so extremes land inside ~`x∈[60,960]`, `y∈[70,590]`. Full recipe + a worked example in `references/research-checklist.md`.
- **Off-map outliers** (a distant capital an army sets out from; a far refuge a ruler eyes) must NOT squash the theater — leave them out of the window and draw an **edge arrow** + a route entering from that edge (see 长安 in the exemplar), or relegate to a footnote.
- Rivers and borders are smooth **Bézier** paths through the control points, never polylines.
- The projection is fixed once chosen; to fix collisions you nudge **label** x/y, not city positions.

## Logistics grammar: movement vs supply

Many campaigns are decided by supply, not battle. When research question 2 says so, make it first-class:

- **Movement paths** = the teal/red/purple `.march` routes. Mark **water legs** by routing them along the rivers/canals; mark a **land** phase (e.g. after a fleet is burned) with the brown `.rout` grammar. If the advance was a fleet and the retreat overland, that contrast IS the narrative — show it.
- **Supply artery** = the gold `.supply` band+core with `.grain` diamonds — a beaded line laid over the waterways/roads that carried grain, labeled 漕运·粮道. It can run *with* the advance (a fleet carries its own grain) and branch to an intended resupply line.
- **Cut-marks** = red `.cut` (circle + ✕) where the supply was severed, with a `.clabel`. Put them in the phase where the cutting happens.
- Give supply its own legend entries (漕运·粮道 / 断粮道) and a footnote explaining it was decisive.

## Multiple realms & off-map forces

Two realms use `qinHatch` (red, +45°) and `jinHatch` (teal, −45°). For a **third** realm add a third pattern with a distinct hatch *direction* so the three read apart — the exemplar uses horizontal:

```html
<pattern id="fqinHatch" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="rgba(92,74,110,.06)"/><line x1="0" y1="0" x2="9" y2="0" stroke="rgba(92,74,110,.30)" stroke-width="1"/></pattern>
```

Label it with `.realm.f` (purple). Add an `af` arrow-marker in purple for that power's routes. Every reinforcing army gets an origin — on-map node or off-map edge arrow (see *Geo-projection*).

## The 释要 explainer (optional, encouraged)

When one mechanism decides the campaign (a canal that had to be dug, a sluice that had to be opened, a pass, a cut supply line), add an `.explain` block *after the interactive panel, before the notes*, so a reader grasps the crux without parsing footnotes. Structure (see exemplar):

- `h3` title + `.lead` one-liner ("何以…之败,系于…").
- A small `.schem` SVG — a **logic diagram**, not a second geographic map (e.g. two water basins + a watershed + the two canals, color-coded teal=运兵 / gold=运粮 / red ✕=断).
- `.intro` sentence, a two-column `.cols` (`.c.a` teal / `.c.b` gold) explaining each element, and a `.kicker` that lands the verdict ("非战之罪,实漕运之败").

## Filling the template

Replace, in order:

- **Header:** `<h1>` battle name; `.sub` line with era dating and `<b>opponent</b>` / `<i>protagonist</i>` (and `<em>` third power if any).
- **Seal:** four characters.
- **Tabs:** one `全图 · 战前` button plus one per phase. Match `data-p` to the phase group ids (`phAll`, `ph1`…). Most campaigns split into 3–5 phases (advance → key engagement → decisive battle → collapse/return); name phases by their substance (e.g. 凿渠北上 / 断粮道 / 大溃).
- **Territory:** hatched polygons sharing boundary paths; `.border` dot-dash reuses the same `d`; `.realm` labels inside each zone. Add a third realm per above when needed.
- **Rivers + names:** smooth Béziers; rotate `.rname` labels along the flow.
- **Cities:** `<g class="city" data-city="key">` with a circle + `.cname`; capital gets `.cap`. Every city in `CITY{}` becomes clickable and drives the panel.
- **Phase groups:** `<g id="phN" class="ph">` holding that phase's `.march` routes, supply/cut layers, `.mlabel` labels, camps, battle rings, `.anno` notes.
- **Panel + footnotes:** `PH{}` holds each phase's narrative (title, date, 2 paragraphs); `CITY{}` holds per-city notes. Footnotes `注一/注二/…` — at least one states the schematic-border/coordinate caveat and cites the sources; add one for the decisive mechanism (supply, pass) when relevant.

## Language

Default to **简体中文** (matches the series). Offer 繁体 as an option. Annotations read like terse classical-history captions grounded in the sources — not modern paraphrase.

## Validation

Run this Node check; fix anything it flags:

```bash
node -e "
const fs=require('fs');const h=fs.readFileSync('FILE.html','utf8');
[...h.matchAll(/id=\"([A-Za-z0-9_]+Hatch)\"/g)].forEach(m=>{const id=m[1];
  const d=h.indexOf('id=\"'+id+'\"'),u=h.indexOf('url(#'+id+')');
  if(d<0||u<0||d>u)throw new Error('pattern order: '+id);});
const go=(h.match(/<g\b/g)||[]).length,gc=(h.match(/<\/g>/g)||[]).length;
const so=(h.match(/<svg\b/g)||[]).length,sc=(h.match(/<\/svg>/g)||[]).length;
const to=(h.match(/<text\b/g)||[]).length,tc=(h.match(/<\/text>/g)||[]).length;
if(go!==gc)throw new Error('<g> unbalanced '+go+'/'+gc);
if(so!==sc)throw new Error('<svg> unbalanced');
if(to!==tc)throw new Error('<text> unbalanced '+to+'/'+tc);
const m=h.match(/<script>([\s\S]*?)<\/script>/);new Function(m[1].replace(/document/g,'__d'));
console.log('OK g',go,'svg',so,'text',to);
"
```

Then **screenshot every phase** in a headless browser and eyeball for label collisions and true geometry (Playwright/Chromium is preinstalled in this environment; browser path may vary):

```js
const { chromium } = require('playwright');   // or the environment's playwright path
const b = await chromium.launch();            // add executablePath if needed
const p = await b.newPage({ viewport:{width:960,height:1400}, deviceScaleFactor:2 });
await p.goto('file://ABSOLUTE/PATH.html', { waitUntil:'networkidle' });
for (const ph of ['all','1','2','3']) {
  if (ph!=='all') await p.click(`.tabs button[data-p="${ph}"]`);
  await p.waitForTimeout(900);
  await p.screenshot({ path:`/tmp/ph-${ph}.png`, fullPage:true });
}
await b.close();
```

Read the screenshots back and iterate until labels are clear and the geography reads true.

## Notes

- Keep everything in one HTML file with no external JS/CSS except the Google Fonts link — these maps must run offline-ish and host on a static page.
- Annotations are the scholarship; get names, dates, and troop figures right and flag uncertainty rather than inventing it.
- The signature element is the seal + hatched approximate borders + teal/red/brown(/purple) route grammar. If a new map drops those, it has left the series.
