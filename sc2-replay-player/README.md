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

- Time-series charts, one line per player: **supply**, **income**
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
- **Spawned/temporary units are filtered** (creep tumors, larva, eggs,
  broodlings, locusts, interceptors, and AI rally beacons) — a single
  creep-spreading bot can lay thousands of tumors, which otherwise bury the map
  in dots.
- **Tag recycling is handled.** SC2 reuses a unit's tag index after it dies, so
  units are tracked as discrete instances (keyed by index + recycle) and a dead
  unit is retired the moment its index is reborn — dead units don't linger.
- **Morphed units are shown.** Units produced from eggs (drones, zerglings,
  roaches, queens, …) fire their own `SUnitBornEvent` when they hatch — the egg
  is a separate transient tag that reverts to larva — so they're tracked like
  any other unit. In-place morphs (Overlord→Overseer, Roach→Ravager,
  Hatchery→Lair, Gateway→WarpGate) keep the same tag index, so the instance
  stays on the map through the change. On the test replay, every one of the
  1,095 tracked units reaches its type via a birth/init event — none are
  reachable only through a type-change — so nothing is missing. (A morphed unit
  keeps its pre-morph dot/square glyph, which for a minimap is immaterial.)
- Positions are auto-fit rather than tied to true map cells (no map file is
  needed), so the map is an approximation of where things happened — not the
  game engine.
- **Movement is interpolated.** The tracker reports unit positions only about
  every ~12 seconds, so playback lerps each unit between its samples rather than
  teleporting it — otherwise units freeze then jump.
- **Idle units (especially workers) barely move.** The position stream is
  dominated by units that travel the map (army); mining workers are reported
  rarely, so they stay near their base. That reflects the tracker data, not a
  playback bug.

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
