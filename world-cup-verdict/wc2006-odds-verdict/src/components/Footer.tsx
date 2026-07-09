import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-ink text-parchment">
      <div className="container relative z-10 max-w-read px-6 py-20">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="kicker text-gold-soft">Colophon</span>
          </div>
          <h3 className="mt-6 max-w-2xl font-display text-3xl font-medium leading-tight md:text-4xl">
            The verdict is only as good as the evidence behind it.
          </h3>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <div className="kicker text-gold-soft">Method</div>
              <p className="mt-3 text-sm leading-relaxed text-parchment/70">
                Decimal odds are converted to implied probabilities, normalised by the
                overround to remove bookmaker margin, and scored against actual results with
                accuracy, Brier score, log loss and ranked probability score. Every figure in
                this study is computed client-side from the dataset below.
              </p>
            </div>
            <div>
              <div className="kicker text-gold-soft">Data</div>
              <p className="mt-3 text-sm leading-relaxed text-parchment/70">
                The 2006 World Cup ran 9 June – 9 July 2006 in Germany. This study
                covers all 64 matches, group stage through the final. The embedded dataset
                is{" "}
                <span className="text-gold-soft">real results with representative pre-match odds</span> —
                outcomes are historical, with decimal odds set to a realistic ~5–7%
                overround. The schema is fixed, so refined odds can be dropped into{" "}
                <span className="tnum">src/data/matches.ts</span> and every metric
                recomputes automatically.
              </p>
            </div>
            <div>
              <div className="kicker text-gold-soft">Scope & limits</div>
              <p className="mt-3 text-sm leading-relaxed text-parchment/70">
                Aggregating across many matches is what surfaces calibration and favourite
                bias invisible in any single game. With a finite sample, confidence intervals
                widen at the extremes — treat per-bucket rates as indicative, not definitive.
                This is an analytical study, not betting advice.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-parchment/15 pt-6 text-xs uppercase tracking-kicker text-parchment/50 sm:flex-row sm:items-center">
            <span>The Verdict · A World Cup 2006 Odds Accuracy Study</span>
            <span className="tnum">Fraunces / Hanken Grotesk / JetBrains Mono</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
