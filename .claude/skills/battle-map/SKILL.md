---
name: battle-map
description: Build an interactive HTML/SVG historical campaign map in a fixed "aged-silk parchment" house style — framed parchment card, double border, red seal stamp, calligraphic Chinese title, hatched approximate borders, teal/red/brown army routes, gold battle rings, clickable city markers, a phase-toggle, and source-critical footnotes. Use this skill WHENEVER the user asks to create, draw, or generate a battle map, campaign map, 战役地图, 进军图, 北伐地图, or any map of a historical military campaign or expedition — even if they don't name the style. The whole point is style consistency across maps, so always use this skill for battle maps rather than improvising a new look.
---

# Battle Map (战役地图)

Produce a single self-contained `.html` file: an interactive SVG campaign map rendered in one fixed visual identity, so every map the user requests looks like it belongs to the same atlas. The user has an existing series (Huan Wen's three Northern Expeditions, the Feishui campaign) in this exact style — match it precisely. Do not redesign; reuse the house style and only change the content.

## Workflow

1. **Verify the history first.** Web-search the campaign before drawing: the sequence of phases, the key battle sites, who advanced where, and the modern locations of place names. Cross-check against primary sources — for Chinese medieval campaigns that means 《资治通鉴》 and 《晋书》 (or the relevant standard history). Note any source discrepancies; they become footnotes.
2. **Read the design skill.** `view /mnt/skills/public/frontend-design/SKILL.md` once, to stay aligned with environment styling constraints.
3. **Build from the template.** Copy `references/template.html` and fill in the placeholders (title, combatants, phases, rivers, cities, routes, footnotes). Keep all CSS tokens and structure unchanged. See "House style" and "Filling the template" below.
4. **Geo-projection.** Place cities by their real relative geography. A light Mercator-style projection is enough: `x = (lon − lon0)·k`, `y = −(lat − lat0)·k` mapped into the ~1000×640 viewBox, then nudge labels to avoid collisions. Rivers and the border are smooth Bézier paths, not polylines.
5. **Validate before delivering.** Run a Node check for SVG tag balance, `<pattern>` defined-before-used, and JS syntax (see "Validation"). Fix anything that fails.
6. **Output two filenames.** Save `战役名.html` (Chinese) AND an ASCII copy like `campaign-year.html`. Chinese filenames URL-encode badly on static hosting; the ASCII copy is what goes to GitHub Pages.
7. **Offer the next step.** Mention the map can go straight onto their GitHub Pages (there is currently no GitHub MCP connector, so publishing is manual — drag-drop upload or `git push`), and offer a unified index page if they now have several maps.

## House style (do not alter)

These tokens ARE the brand. Copy them verbatim from the template's `:root`.

- **Ground:** dark wood-grain radial `radial-gradient(circle at 20% 10%, #4a4334, #322c20 55%, #221d14)`.
- **Card:** parchment `--paper:#e9dec4` inside a `3px double var(--border)` frame with inset warm shadow. Max-width 880px, centered, single column.
- **Type:** `Ma Shan Zheng` for the title and seal (calligraphic); `Noto Serif SC` for everything else, with `Songti SC/SimSun` fallback.
- **Seal:** a small red (`--seal:#9a2b1e`) square stamp, rotated ~−5°, top-right of the frame, 2×2 calligraphic characters naming the battle (e.g. 淝/水/之/役).
- **Army colors (semantic, by role not by name):**
  - protagonist / the side the map follows → **teal** `--advance:#1f4e54`
  - opponent → **vermilion** `--enemy:#9a2b1e`
  - rout or retreat → **brown dashed** `--ret:#7a5a23`
  - For the user's series the protagonist is Eastern Jin, so Jin is teal; in a defensive battle the attacker is still the "enemy" red, and the dramatic collapse is brown. Keep this logic: don't recolor by dynasty, recolor by role.
- **Map marks:** gold ring `--gold:#9c7a2c` = pitched battle; red diamond = enemy camp; rivers `--water:#5f7f88` as thin smooth strokes; mountains as small triple-peak strokes.
- **Borders:** never a hard line. Two diagonal-hatch `<pattern>` fills (one per realm) plus a dot-dash "约界" (approximate boundary) stroke, with a footnote saying the border is schematic.
- **Arrowheads:** SVG `<marker>` per army color; routes draw on with a dash-offset animation, guarded by `prefers-reduced-motion`.

## Filling the template

The template is the Feishui map reduced to a fillable scaffold. Replace, in order:

- **Header:** `<h1>` battle name; `.sub` line with era dating and `<b>opponent</b>` / `<i>protagonist</i>`.
- **Seal:** four characters.
- **Tabs:** one `全图 · 战前` button plus one button per phase. Match `data-p` values to the phase group ids (`phAll`, `ph1`…). Most campaigns split cleanly into 3–5 phases (advance → key engagement → decisive battle → collapse/return).
- **Territory:** two hatched polygons sharing one boundary path; the `.border` dot-dash path reuses the same `d`. Place `.realm` labels inside each shaded zone.
- **Rivers + names:** smooth Béziers; rotate `.rname` labels along the flow.
- **Cities:** `<g class="city" data-city="key">` with a circle + `.cname`; capital gets `.cap`. Every city in the `CITY` JS object becomes clickable and drives the annotation panel.
- **Phase groups:** `<g id="phN" class="ph">` holding that phase's `.march` routes (`.j`/`.q`/`.rout`), `.mlabel` labels, camps, battle rings, and `.anno` notes.
- **Panel + footnotes:** the `PH` JS object holds each phase's narrative (title, date, 2 paragraphs); the `CITY` object holds per-city notes. Footnotes use `注一/注二/注三` — at least one must state the schematic-border caveat and cite the sources used.

## Language

Default to **简体中文** (matches the existing series). Offer 繁体 as an option. Annotations should read like terse classical-history captions, grounded in the sources — not modern paraphrase.

## Validation

```bash
node -e "
const fs=require('fs');const h=fs.readFileSync('FILE.html','utf8');
[...h.matchAll(/id=\"([A-Za-z0-9_]+Hatch)\"/g)].forEach(m=>{const id=m[1];
  const d=h.indexOf('id=\"'+id+'\"'),u=h.indexOf('url(#'+id+')');
  if(d<0||u<0||d>u)throw new Error('pattern order: '+id);});
const go=(h.match(/<g\b/g)||[]).length,gc=(h.match(/<\/g>/g)||[]).length;
const so=(h.match(/<svg\b/g)||[]).length,sc=(h.match(/<\/svg>/g)||[]).length;
if(go!==gc)throw new Error('<g> unbalanced '+go+'/'+gc);
if(so!==sc)throw new Error('<svg> unbalanced');
const m=h.match(/<script>([\s\S]*?)<\/script>/);new Function(m[1].replace(/document/g,'__d'));
console.log('OK g',go,'svg',so);
"
```

## Notes

- Keep everything in one HTML file with no external JS/CSS except the Google Fonts link — these maps must run offline-ish and host on a static page.
- Annotations are the scholarship; get names, dates, and troop figures right and flag uncertainty rather than inventing it.
- The signature element is the seal + hatched approximate borders + teal/red/brown route grammar. If a new map drops those, it has left the series.
