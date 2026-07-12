# The Verdict · World Cup Odds Accuracy

A cross-tournament study of how accurately pre-match betting odds predicted the
outcomes of eight FIFA World Cups (1998–2026, 496 matches) — accuracy,
calibration, favourite bias, and a strategy lab.

- `index.html` — the portal tying the eight editions together.
- `wcYYYY-odds-verdict/` — one self-contained app per tournament, each with its
  match data under `src/data/matches.ts`.

## Verifying the numbers

`verify-tournament.mjs` independently recomputes the accuracy, calibration,
favourite-bias, and strategy-ROI metrics that each app's narrative quotes. It
reads an app's `src/data/matches.ts` directly, reimplements the analytics in
plain JS, and prints the results — so you can confirm the quoted figures match
the underlying data.

```sh
node verify-tournament.mjs wc2022-odds-verdict
```

Pass any tournament directory as the argument.
