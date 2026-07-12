# Arbitrage Suite

Three related apps exploring one idea — profit from the same thing selling at
different prices in different places — consolidated under a single hub
(`index.html`):

- **`strategy-lab/`** (think): taxonomy of price-gap domains, five-test screening
  framework, edge calculator with leg-risk EV, research-plan generator.
- **`case-studies/`** (learn): betting-market case studies from real timestamped
  data plus the published record — papers, experiments, companies, syndicates,
  and account-limiting statistics.
- **`spread-monitor/`** (execute): client-side monitor polling free public
  exchange APIs for the same asset's bid/ask across venues, computing the
  fee-adjusted executable cross with staleness filtering.
- **`value-vs-arb/`** (go deeper): why the scalable version of the idea is
  model-vs-market pricing rather than venue-vs-venue arbitrage — mechanics,
  maturation ladder, closing line value, and an interactive crossover simulator
  (capped arb income vs Kelly-compounded value edge, Monte Carlo).

Everything is single-file HTML+JS; open any `index.html` directly.
