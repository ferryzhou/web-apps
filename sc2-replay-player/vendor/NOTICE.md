# Vendored third-party code

This directory bundles a minimal subset of two open-source libraries so the app
stays fully static and self-contained (their PyPI builds are not installable via
Pyodide's `micropip`).

| Files | Upstream | Version | License |
|-------|----------|---------|---------|
| `mpyq.py` | [mpyq](https://github.com/eagleflo/mpyq) — MPQ archive reader | 0.2.5 | BSD (see `LICENSE.mpyq`) |
| `s2protocol/**` | [s2protocol](https://github.com/Blizzard/s2protocol) — StarCraft II replay protocol | 5.0.16.97425.1 | MIT (see `LICENSE.s2protocol`) |

## Local modifications

- `s2protocol/versions/__init__.py` was rewritten to be Python 3.12-safe. The
  upstream version depends on the `imp` module (removed in Python 3.12) and on
  discovering every bundled protocol file; the replacement uses `importlib` and
  falls back to the latest vendored protocol when an exact build isn't present.
- Only a few recent `protocolNNNNN.py` versions are included (not the full set).
  The header/details streams this app reads use s2protocol's build-stable
  VersionedDecoder, so a recent protocol decodes the vast majority of replays.
- `sc2_summary.py` is original code for this app, not part of either upstream.
