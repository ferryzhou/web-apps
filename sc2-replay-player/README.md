# StarCraft II Replay Player

A static, fully client-side web app that reads **StarCraft II `.SC2Replay`
files** and shows a clean match summary — players, races, win/loss, map,
length, game speed, and version. Drop a replay in and it's parsed **entirely in
your browser**; nothing is ever uploaded.

Hostable on GitHub Pages (or any static host) with no backend.

## What it shows today (match-card tier)

- Map name and matchup (e.g. `TvZ`)
- Each player: name, race, colour, win/loss, and human-vs-AI
- Team grouping (1v1 shown as a clean "vs" layout; team/FFA games grouped)
- Game length (real time), date played, game speed, and client version
- Battle.net handle per human player

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

The match card relies only on s2protocol's *VersionedDecoder* streams (replay
header + details), which are stable across game builds, so a single recent
protocol version decodes the vast majority of replays.

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

1. **Match card** — this tier. ✅
2. **Analytics dashboard** — resources/supply/APM graphs, build orders and
   upgrade timings from the tracker-event stream.
3. **2D minimap playback** — animate unit positions/deaths on a top-down map
   with a scrubber.

Tiers 2–3 need build-specific decoding for some streams; more `protocolNNNNN.py`
versions will be vendored as those land.

## Development notes

- Everything is static: open `index.html` over **http(s)** (not `file://`, so
  `fetch()` can load the `vendor/` files into Pyodide's virtual filesystem).
  e.g. `python3 -m http.server` from the repo root, then visit
  `/sc2-replay-player/`.
- No build step, no dependencies to install.
