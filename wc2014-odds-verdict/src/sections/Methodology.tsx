import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { analyzeMatch } from "@/lib/analytics";
import { matches } from "@/data/matches";

// Worked example uses the opening match of the tournament.
const sample = matches[0];
const a = analyzeMatch(sample);

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

const METRIC_CARDS: {
  name: string;
  formula: ReactNode;
  gloss: string;
  good: string;
}[] = [
  {
    name: "Accuracy",
    formula: (
      <>
        <span className="text-gold">accuracy</span> ={" "}
        <span className="text-ink">correct</span> / N
      </>
    ),
    gloss: "Share of matches where the outcome with the highest probability (the favourite) actually occurred.",
    good: "Higher is better. A naive baseline.",
  },
  {
    name: "Brier score",
    formula: (
      <>
        <span className="text-gold">brier</span> = Σ (p<sub>i</sub> − o<sub>i</sub>)²
      </>
    ),
    gloss: "Mean squared error across all three outcomes (p = forecast prob, o = 1 if it happened, else 0).",
    good: "Lower is better. 0 = perfect, 0.66 = useless.",
  },
  {
    name: "Log loss",
    formula: (
      <>
        <span className="text-gold">logloss</span> = −ln(p<sub>actual</sub>)
      </>
    ),
    gloss: "Takes the probability assigned to the real result and takes its negative log. A confident wrong call explodes toward infinity.",
    good: "Lower is better. Rewards honest confidence.",
  },
  {
    name: "Ranked probability score",
    formula: (
      <>
        <span className="text-gold">rps</span> = ½ Σ (P̂<sub>i</sub> − Ô<sub>i</sub>)²
      </>
    ),
    gloss: "Compares cumulative forecast vs outcome over the ordered outcomes Home → Draw → Away. Sensitive to how far off the call was.",
    good: "Lower is better. Respects outcome ordering.",
  },
];

export function Methodology() {
  return (
    <Section
      id="methodology"
      kicker="Methodology"
      title={
        <>
          From odds to a <span className="italic text-gold-deep">verdict</span>.
        </>
      }
      intro="Bookmaker odds are prices, not probabilities — but they can be converted. Here is the exact pipeline that turns three decimal numbers into a forecast, and the four scores used to judge it."
    >
      {/* ── Worked example: odds → probability ────────────────────────────── */}
      <Reveal>
        <div className="border border-ink/15 bg-parchment">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink/15 bg-parchment-alt px-6 py-4">
            <div>
              <span className="kicker">Worked example · {sample.id}</span>
              <p className="mt-1 font-display text-xl font-medium text-ink">
                {sample.homeTeam} <span className="text-ink-muted">v</span> {sample.awayTeam}
              </p>
            </div>
            <p className="tnum text-sm text-ink-muted">
              final {sample.scoreHome}–{sample.scoreAway} · {sample.result === "H" ? "home win" : sample.result === "D" ? "draw" : "away win"}
            </p>
          </div>

          <div className="grid grid-cols-1 divide-ink/15 md:grid-cols-3 md:divide-x">
            {/* Step 1 — decimal odds */}
            <Step step="01" title="Decimal odds">
              <div className="space-y-2">
                <OddsRow team={sample.homeTeam} odds={sample.oddsHome} />
                <OddsRow team="Draw" odds={sample.oddsDraw} />
                <OddsRow team={sample.awayTeam} odds={sample.oddsAway} />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                The raw market. Decimal odds of 1.95 mean a $1 stake returns $1.95.
              </p>
            </Step>

            {/* Step 2 — implied probability */}
            <Step step="02" title="Implied probability">
              <div className="space-y-2">
                <ProbRow label={sample.homeTeam} value={a.impliedHome} />
                <ProbRow label="Draw" value={a.impliedDraw} />
                <ProbRow label={sample.awayTeam} value={a.impliedAway} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/15 pt-3">
                <span className="text-xs uppercase tracking-kicker text-ink-muted">Sum</span>
                <span className="tnum text-sm font-semibold text-verdict">
                  {a.overround.toFixed(4)} → +{(a.margin * 100).toFixed(2)}% margin
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Invert each price: p = 1 ÷ odds. The sum exceeds 1 — that gap is the bookmaker's margin.
              </p>
            </Step>

            {/* Step 3 — normalized */}
            <Step step="03" title="Forecast probability">
              <div className="space-y-2">
                <ProbRow label={sample.homeTeam} value={a.pHome} strong />
                <ProbRow label="Draw" value={a.pDraw} strong />
                <ProbRow label={sample.awayTeam} value={a.pAway} strong />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/15 pt-3">
                <span className="text-xs uppercase tracking-kicker text-ink-muted">Prediction</span>
                <span className="tnum text-sm font-semibold text-pitch">
                  {a.predicted === "H" ? sample.homeTeam : a.predicted === "A" ? sample.awayTeam : "Draw"} · {pct(a.predictedProb)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                Divide by the overround to strip the margin. The favourite (highest prob) is the forecast.
              </p>
            </Step>
          </div>
        </div>
      </Reveal>

      {/* ── Metric definition cards ───────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <h3 className="mt-16 font-display text-2xl font-medium text-ink">Four ways to score a forecast</h3>
        <p className="mt-3 max-w-prose text-ink-muted">
          Accuracy is intuitive but coarse. Brier, log loss and RPS each measure a different
          kind of being-right, and together they tell the full story.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-ink/15 bg-ink/15 sm:grid-cols-2">
        {METRIC_CARDS.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.05}>
            <div className="h-full bg-parchment p-6">
              <div className="kicker">Metric {String(i + 1).padStart(2, "0")}</div>
              <h4 className="mt-2 font-display text-xl font-semibold text-ink">{m.name}</h4>
              <div className="mt-4 border border-ink/15 bg-parchment-alt px-4 py-3 font-mono text-sm text-ink-soft">
                {m.formula}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{m.gloss}</p>
              <p className="mt-2 text-xs uppercase tracking-kicker text-gold-deep">{m.good}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Step({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3">
        <span className="tnum text-xs font-semibold text-gold">{step}</span>
        <span className="h-px flex-1 bg-ink/15" />
        <span className="text-xs uppercase tracking-kicker text-ink-muted">{title}</span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function OddsRow({ team, odds }: { team: string; odds: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-soft">{team}</span>
      <span className="tnum text-sm font-semibold text-ink">{odds.toFixed(2)}</span>
    </div>
  );
}

function ProbRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className={`text-sm ${strong ? "text-ink" : "text-ink-soft"}`}>{label}</span>
        <span className={`tnum text-sm ${strong ? "font-semibold text-ink" : "text-ink-soft"}`}>
          {pct(value)}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full bg-ink/10">
        <div
          className={`h-full ${strong ? "bg-gold" : "bg-ink/40"}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}
