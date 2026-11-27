# StarCraft II Replay Player

A static, fully client-side web app that reads **StarCraft II `.SC2Replay`
files** and shows a clean match summary — players, races, win/loss, map,
length, game speed, and version. Drop a replay in and it's parsed **entirely in
your browser**; nothing is ever uploaded.

Hostable on GitHub Pages (or any static host) with no backend.

## What it shows today

**Match card**

- Map name and matchup (e.g. `TvZ`)
- Each player: name, race, colour, win/loss, and human-vs-AI
- Team grouping (1v1 shown as a clean "vs" layout; team/FFA games grouped)
- Game length (real time), date played, game speed, and client version
- Battle.net handle per human player

**Analytics dashboard** (from the tracker-event stream)

- Time-series charts, one line per player: **supply**, **army supply**
  (total supply minus workers — each worker costs exactly 1 supply), **income**
  (resources collected / min), **army value**, and **worker count** — each a
  small-multiple with its own axis, a legend, direct end-labels, and a hover
  crosshair/tooltip.
- **Build order** per player: a timestamped list of structures, units and
  upgrades with the supply count when each item began.

**2D minimap playback**

- A top-down animated minimap with play/pause, a scrubber, and 1–8× speed.
  Units are dots and structures are squares (coloured by player); deaths show as
  fading rings. Positions come from the tracker's unit-position stream (unit
  spawn points as a fallback), and the map bounds are auto-fit — so playback is
  internally consistent without needing the map file. It's an approximation of
  where things happened, not the game engine.
- A **live stats HUD** under the map shows each player's supply, army value,
  income, banked resources, and worker count **at the current playhead**, so you
  can watch the economy and army swing as the game unfolds. (Sourced from the
  same tracker score samples as the analytics charts, ~every 10 seconds.)
- A **live army composition** line lists each player's current army by unit type
  and count (e.g. `73 Stalker`, `12 Overlord · 9 Queen`), and a second line does
  the same for **buildings** (e.g. `24 Pylon · 12 WarpGate · 2 Nexus`), both
  tallied from what's alive at that moment — so you can see the army and base mix
  change through the game. Each entry shows a small glyph matching its map marker
  (circle / triangle / square, coloured by player) plus the count and the unit
  type name.

All of the above come from `replay.tracker.events`, which very old replays
(pre-2013) don't contain; each section hides itself gracefully when its data is
absent.

## How it works

Replays are **not** videos — an `.SC2Replay` is an [MPQ archive](https://en.wikipedia.org/wiki/MPQ)
containing the initial game setup plus the stream of player commands the engine
re-simulates from. So there's no frame-by-frame unit data to "play back"
without the game engine, but a lot of structured data *is* available.

This app decodes that data in the browser using:

- **[Pyodide](https://pyodide.org)** — CPython compiled to WebAssembly, loaded
  from a CDN on first use (cached afterwards).
- **[mpyq](https://github.com/eagleflo/mpyq)** + Blizzard's
  **[s2protocol](https://github.com/Blizzard/s2protocol)** — the canonical
  replay parsers, a minimal subset of which is **vendored** under `vendor/` so
  the app stays self-contained and offline-capable (the PyPI builds aren't
  installable via Pyodide's `micropip`).

The match card **and** the analytics all rely only on s2protocol's
*VersionedDecoder* streams (replay header, details, and tracker events), which
are stable across game builds, so a single recent protocol version decodes the
vast majority of replays. (APM, which needs the build-specific game-event
stream, is intentionally left for a later phase.)

### `vendor/` layout

```
vendor/
  mpyq.py                     # MPQ archive reader (pure-Python, stdlib only)
  sc2_summary.py              # our glue: replay bytes -> summary dict
  s2protocol/
    __init__.py  compat.py  decoders.py
    versions/
      __init__.py             # Py3.12-safe loader (upstream uses removed `imp`)
      protocol97425.py        # recent protocol versions (VersionedDecoder is
      protocol97364.py        # build-stable; more can be added for analytics)
```

## Roadmap (phased)

1. **Match card** — ✅
2. **Analytics dashboard** — economy/supply/army/worker graphs + build orders
   from the tracker-event stream. ✅
3. **2D minimap playback** — animated top-down unit movement/deaths with a
   scrubber (uses `SUnitPositionsEvent`, `SUnitBornEvent`, `SUnitDiedEvent`). ✅
4. **APM & game-event analytics** — needs the build-specific game-event stream,
   so more `protocolNNNNN.py` versions get vendored for accurate per-build
   decoding.

### Minimap details & limitations

The minimap has been validated against a real 40-minute ladder replay: bases sit
in map corners, neutral mineral fields trace the familiar arcs at each
expansion, and armies move and thin out over the game. A few things worth
knowing:

- **Buildings vs. units** are told apart by unit type name (against SC2's
  building list), not by which tracker event created them — so warp-ins and
  trained units that fire an init event still render as unit dots, and only
  actual structures show as squares.
- **Unit markers encode type.** Ground units are circles, air units are
  triangles, and structures are squares; each is sized by a tier (units: small
  for workers/lings up to massive for ultralisks/thors/capital ships;
  buildings: by footprint, so 5×5 town halls anchor bases as large squares and
  2×2 depots/pylons stay small). Size/shape update on in-place morphs (e.g.
  Roach→Ravager, Hatchery→Lair). The army-composition list keys each unit type
  to its marker with a matching glyph, so you can read the map.
- **Terrain elevation & ramps (`maps.js`).** Bundled multi-tier elevation
  presets (low ground, mid-ground expansion shelves, high-ground mains, cliff
  rims, and stepped ramps) cover 12 popular 1v1 ladder maps (Alcyone, Site
  Delta, Oceanborn, Post-Youth, Crimson Court, Ghost River, Goldenaura,
  Equilibrium, Amphion, Dynasty, Gresvan, King Sejong Station) and normalize
  automatically into each replay's bounds. Unknown maps fall back to
  schematically inferred high-ground main plateaus & ramps.
- **Map details rendered from tracker objects.** Neutral mineral patches (cyan
  crystals, gold for rich minerals), vespene geysers (green vents, hidden once
  capped by a refinery/assimilator/extractor), Xel'Naga watchtowers (diamonds
  with dashed sensor rings that light up in the controlling player's color),
  destructible rocks (shattering when broken), Zerg creep spread (deduplicated
  from Hatcheries and Creep Tumors), and base territory rings all render with
  toggleable map layers (`Terrain`, `Map features`, `Creep & bases`, `Trails`).
- **Buildings under construction** are tracked via `SUnitInitEvent` →
  `SUnitDoneEvent` and render as dashed translucent squares with a rising
  construction-progress fill until completion.
- **More accurate unit positions & movement.**
  - Exact death coordinates (`m_x`, `m_y`) from `SUnitDiedEvent` are recorded
    so units that march into combat between the ~12-second position ticks move
    to and die at the actual battle location.
  - Sub-second timestamps (`0.01s`) and per-unit move deduplication keep
    trajectories tight without losing endpoints during downsampling.
  - Clamped C¹ cubic Hermite spline interpolation keeps movement continuous in
    both position and velocity across waypoints without stop-and-go freezing or
    overshoot on direction reversals.
  - Legacy HotS (2.x) 1/4-tile `SUnitPositionsEvent` coordinates are
    auto-detected and scaled cleanly.
- **Synced analytics & timeline markers.** Economy charts show a live playhead
  line (click any chart or build-order row to seek), the scrubber marks major
  battles, expansions, and base kills, hovering the minimap inspects units under
  the cursor, and keyboard shortcuts (`Space`, `←`/`→`) control playback.
- **Built-in sample replay.** A "Try sample replay" button loads a synthetic
  13-minute TvZ match immediately without uploading a file or loading Pyodide.
- **Tag recycling is handled.** SC2 reuses a unit's tag index after it dies, so
  units are tracked as discrete instances (keyed by index + recycle) and a dead
  unit is retired the moment its index is reborn — dead units don't linger.
- **Morphed units are shown.** Units produced from eggs (drones, zerglings,
  roaches, queens, …) fire their own `SUnitBornEvent` when they hatch — the egg
  is a separate transient tag that reverts to larva — so they're tracked like
  any other unit. In-place morphs (Overlord→Overseer, Roach→Ravager,
  Hatchery→Lair, Gateway→WarpGate) keep the same tag index, so the instance
  stays on the map through the change.
- Positions are auto-fit with a preserved 1:1 aspect ratio rather than tied to
  true map terrain files (no `.SC2Map` file is needed), so the map is an
  approximation of where things happened — not the game engine.

## Development notes

- Everything is static: open `index.html` over **http(s)** (not `file://`, so
  `fetch()` can load the `vendor/` files into Pyodide's virtual filesystem).
  e.g. `python3 -m http.server` from the repo root, then visit
  `/sc2-replay-player/`.
- No build step, no dependencies to install.

## Credits

- Replay decoding: [s2protocol](https://github.com/Blizzard/s2protocol) (MIT) and
  [mpyq](https://github.com/eagleflo/mpyq) (BSD) — see `vendor/NOTICE.md`.
- StarCraft II is a trademark of Blizzard Entertainment; this project is
  unaffiliated fan tooling and contains no Blizzard assets.
