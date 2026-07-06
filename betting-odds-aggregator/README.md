# Betting Odds Aggregator — Argentina vs Cape Verde (World Cup 2026)

A single-file web app that aggregates **real, published, timestamped betting odds from
multiple sources** for one game — the 2026 FIFA World Cup Round of 32 match between
Argentina and Cape Verde (Jul 3, 2026, Miami; 1–1 after 90 minutes, Argentina 3–2 a.e.t.) —
and lets you explore whether the price differences between sources were exploitable.

## What it does

- **Odds board** — the 3-way 90-minute moneyline from DraftKings, FanDuel, a FOX-quoted
  book, three Irish operators, the Oddschecker consensus, and the Kalshi prediction
  market, viewable in American / decimal / implied-probability format, with the best
  price per outcome starred and each source's overround (margin) computed.
- **Odds movement chart** — implied probability per outcome across three observation
  windows (opening line Jun 28 → match day → near kickoff), consensus line + per-source
  dots, with a crosshair tooltip and an equivalent data table.
- **Arbitrage scanner** — combines the best price per outcome across sources; if the
  implied probabilities sum to under 100% it computes the dutching stakes and the
  guaranteed profit. Toggles let you include/exclude the prediction market and apply
  Kalshi's ≈ `7% × P × (1−P)` per-contract fee — which is exactly what kills the raw
  0.4% cross-source edge that appears at match-day prices.
- **Strategy simulator** — place a hypothetical bet (all-in, dutching, or custom stakes
  per outcome) at the prices of a chosen time window, settle it against the *real*
  result (Draw at 90'), and see the P&L under every counterfactual outcome too.

## Data integrity

All odds are real published numbers compiled on **Jul 6, 2026** from public sources
(DraftKings Network, FanDuel Research and Sportsbook, FOX Sports, topendsports,
Oddschecker, Kalshi, OddsShark, ESPN). Every figure appears in the in-app
**Data provenance** table with its source link and its timestamp *at the precision the
source actually supports* — day-level for media-republished lines. The app deliberately
does not fabricate intraday timestamps.

Known limitations (also stated in-app): media-quoted lines can lag the live line; a
computed "arbitrage" ignores bet limits, simultaneous-fill risk, and settlement-rule
differences. For exact-instant multi-book snapshots the upgrade path is
[The Odds API](https://the-odds-api.com/)'s historical endpoint.

## Match replay & in-play explorer (`replay.html`)

A companion page that pulls **minute-level historical odds — including in-play prices
during the match** — from [The Odds API](https://the-odds-api.com/)'s historical
endpoint (5-minute snapshots, per-bookmaker `last_update` timestamps), entirely
client-side with the user's own API key:

- The key is entered in the page, kept in `localStorage`, and sent only to
  `api.the-odds-api.com` — never embedded in this repo or sent anywhere else.
- Fetches show an upfront credit-cost estimate (historical calls cost ~10 credits ×
  regions per snapshot; a paid The Odds API plan is required) and quota headers after
  each call. Datasets can be downloaded as JSON and re-loaded later for free.
- **Implied-probability chart** through the match: median per outcome with a
  min–max band across books, goal/period markers annotated (wall-clock placement of
  match-clock events is approximate and labeled as such).
- **Volatility strip**: largest per-snapshot move in median implied probability —
  spikes align with goals.
- **Staleness-aware arb scan**: per snapshot, best price per outcome across books →
  implied total, with a freshness filter that drops books whose `last_update` lags
  the snapshot. This filter is the point: most in-play "arbs" in sampled data are one
  slow book still pricing the pre-goal state (the table's "stale spread" column makes
  that visible).

## Run it

Open `index.html` in a browser. No build step, no dependencies, no network calls —
the dataset is embedded. `replay.html` makes network calls only to The Odds API and
only when you click fetch.
