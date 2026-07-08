import type { StrategyResult } from "@/lib/strategies";
import { Section } from "@/components/ui/Section";
import { ChartCard } from "@/components/ui/ChartCard";
import { Reveal } from "@/components/ui/Reveal";
import { StrategyRoiChart } from "@/components/charts/StrategyRoiChart";
import { StrategyCumulativeChart } from "@/components/charts/StrategyCumulativeChart";

interface Props {
  results: StrategyResult[];
}

export function Strategies({ results }: Props) {
  // Sort by ROI descending for the table / cards.
  const ranked = [...results].sort((a, b) => b.roi - a.roi);
  const best = ranked[0];
  const baseline = results.find((r) => r.strategy.id === "always-fav")!;
  // Most credible = best ROI among strategies with ≥ 10 bets (less variance).
  const credible = ranked
    .filter((r) => r.bets >= 10)
    .sort((a, b) => b.roi - a.roi)[0];

  return (
    <Section
      id="strategies"
      alt
      kicker="Strategy lab"
      title={
        <>
          Turning the verdict into <span className="italic text-gold-deep">bets</span>.
        </>
      }
      intro="The accuracy study tells us where the market is sharp and where it slips. The strategy lab turns each insight into a simple, rule-based betting strategy and backtests it across all 64 matches with a flat 1-unit stake. ROI is profit divided by total staked — the honest bottom line."
    >
      {/* Method note */}
      <Reveal>
        <div className="mb-8 border-l-2 border-gold/50 bg-parchment px-5 py-4 text-sm leading-relaxed text-ink-soft">
          <span className="kicker text-gold-deep">Method</span>
          <p className="mt-2">
            Each strategy decides, per match, whether to bet and on which outcome —
            using only the pre-match odds, the stage, and the derived probabilities
            (never the result). A correct bet at decimal odds <span className="tnum">o</span>{" "}
            returns <span className="tnum">o</span> units (profit{" "}
            <span className="tnum">o − 1</span>); a losing bet returns{" "}
            <span className="tnum">0</span> (profit <span className="tnum">−1</span>).
            Flat 1 unit per bet, no staking plan, no rollover.
          </p>
        </div>
      </Reveal>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          kicker="Return on investment"
          title="ROI by strategy"
          caption="Profit per unit staked, sorted best → worst. Green clears breakeven; the dashed baseline (Always Bet Favourite) shows the efficient-market floor."
          delay={0}
        >
          <StrategyRoiChart results={results} />
        </ChartCard>

        <ChartCard
          kicker="Profit trajectory"
          title="Cumulative profit over bets placed"
          caption="Running profit in units as each strategy's bets settle. Steeper green and crimson lines belong to the knockout-led strategies; the flat grey dash is the breakeven baseline."
          delay={0.05}
        >
          <StrategyCumulativeChart results={results} />
        </ChartCard>
      </div>

      {/* Comparison table */}
      <Reveal delay={0.1}>
        <div className="mt-8 overflow-x-auto scroll-thin">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-ink/25">
                <th className="py-3 pr-4 font-mono text-[0.66rem] uppercase tracking-wider text-ink-muted">
                  Strategy
                </th>
                <th className="hidden py-3 pr-4 font-mono text-[0.66rem] uppercase tracking-wider text-ink-muted md:table-cell">
                  Rule
                </th>
                <th className="py-3 pr-4 text-right font-mono text-[0.66rem] uppercase tracking-wider text-ink-muted">
                  Bets
                </th>
                <th className="py-3 pr-4 text-right font-mono text-[0.66rem] uppercase tracking-wider text-ink-muted">
                  Hit rate
                </th>
                <th className="hidden py-3 pr-4 text-right font-mono text-[0.66rem] uppercase tracking-wider text-ink-muted sm:table-cell">
                  Avg odds
                </th>
                <th className="py-3 pr-4 text-right font-mono text-[0.66rem] uppercase tracking-wider text-ink-muted">
                  Profit
                </th>
                <th className="py-3 pr-2 text-right font-mono text-[0.66rem] uppercase tracking-wider text-ink-muted">
                  ROI
                </th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((r, i) => (
                <tr
                  key={r.strategy.id}
                  className={`border-b border-ink/10 ${
                    i === 0 ? "bg-gold/8" : ""
                  }`}
                >
                  <td className="py-3 pr-4">
                    <div className="font-display text-[0.95rem] font-medium text-ink">
                      {r.strategy.name}
                    </div>
                    <div className="font-mono text-[0.66rem] text-ink-muted md:hidden">
                      {r.strategy.tagline}
                    </div>
                  </td>
                  <td className="hidden py-3 pr-4 align-middle text-sm text-ink-muted md:table-cell">
                    {r.strategy.tagline}
                  </td>
                  <td className="tnum py-3 pr-4 text-right text-sm text-ink">
                    {r.bets}
                  </td>
                  <td className="tnum py-3 pr-4 text-right text-sm text-ink">
                    {(r.hitRate * 100).toFixed(1)}%
                  </td>
                  <td className="tnum hidden py-3 pr-4 text-right text-sm text-ink sm:table-cell">
                    {r.avgOdds.toFixed(2)}
                  </td>
                  <td
                    className={`tnum py-3 pr-4 text-right text-sm font-semibold ${
                      r.profit >= 0 ? "text-pitch-deep" : "text-verdict-deep"
                    }`}
                  >
                    {r.profit >= 0 ? "+" : ""}
                    {r.profit.toFixed(2)}
                  </td>
                  <td
                    className={`tnum py-3 pr-2 text-right text-sm font-semibold ${
                      r.roi >= 0 ? "text-pitch-deep" : "text-verdict-deep"
                    }`}
                  >
                    {r.roi >= 0 ? "+" : ""}
                    {(r.roi * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Strategy insight cards */}
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ranked.map((r, i) => (
          <Reveal key={r.strategy.id} delay={0.04 * i}>
            <article className="flex h-full flex-col border border-ink/15 bg-parchment p-5">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-display text-lg font-medium leading-tight text-ink">
                  {r.strategy.name}
                </h4>
                <span
                  className={`tnum shrink-0 border px-2 py-0.5 text-[0.62rem] font-semibold ${
                    r.roi >= 0
                      ? "border-pitch/30 bg-pitch/12 text-pitch-deep"
                      : "border-verdict/30 bg-verdict/12 text-verdict-deep"
                  }`}
                >
                  {r.roi >= 0 ? "+" : ""}
                  {(r.roi * 100).toFixed(1)}%
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">
                {r.strategy.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {r.strategy.description}
              </p>
              <div className="mt-4 border-t border-ink/10 pt-3">
                <div className="kicker text-gold-deep">Insight</div>
                <p className="mt-1.5 text-[0.82rem] italic leading-relaxed text-ink-muted">
                  {r.strategy.insight}
                </p>
              </div>
              <div className="mt-4 flex gap-4 border-t border-ink/10 pt-3 text-xs">
                <Metric label="Bets" value={`${r.bets}`} />
                <Metric
                  label="Hit rate"
                  value={`${(r.hitRate * 100).toFixed(0)}%`}
                />
                <Metric
                  label="Profit"
                  value={`${r.profit >= 0 ? "+" : ""}${r.profit.toFixed(2)}`}
                  tone={r.profit >= 0 ? "pitch" : "verdict"}
                />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Verdict panel */}
      <Reveal delay={0.1}>
        <div className="grain relative mt-10 overflow-hidden bg-ink px-8 py-10 text-parchment md:px-12">
          <div className="relative z-10">
            <div className="kicker text-gold-soft">The betting verdict</div>
            <p className="mt-4 max-w-prose font-display text-2xl font-medium leading-snug">
              Bet every favourite and you{" "}
              <span className="text-parchment/60">break even</span> — the market is
              efficient in aggregate. The edge lives in the filters.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <VerdictStat
                label="Best ROI"
                value={`+${(best.roi * 100).toFixed(1)}%`}
                name={best.strategy.name}
                note={`${best.bets} bets · ${best.hitRate >= 1 ? "100%" : (best.hitRate * 100).toFixed(0) + "%"} hit rate`}
                tone="gold"
              />
              <VerdictStat
                label="Most credible"
                value={`+${(credible.roi * 100).toFixed(1)}%`}
                name={credible.strategy.name}
                note={`${credible.bets} bets · best ROI at a usable sample`}
                tone="pitch"
              />
              <VerdictStat
                label="Baseline"
                value={`${baseline.roi >= 0 ? "+" : ""}${(baseline.roi * 100).toFixed(1)}%`}
                name={baseline.strategy.name}
                note={`${baseline.bets} bets · the efficient-market floor`}
                tone="muted"
              />
            </div>
            <p className="mt-8 max-w-prose text-sm leading-relaxed text-parchment/60">
              <span className="font-semibold text-parchment/80">Caveat.</span> This
              is a 64-match sample. Strategies built on as few as eight bets carry
              wide error bars — a single upset swings ROI by double digits. The
              knockout filter produced the highest return (8 bets, +50.6%), but the
              value-draw signal across the dead zone (19 bets, +16.3%) is the
              sturdiest. Real confidence needs hundreds of matches. Treat these
              results as a demonstration of method, not a licence to print money.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Metric({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "pitch" | "verdict";
}) {
  const color =
    tone === "pitch"
      ? "text-pitch-deep"
      : tone === "verdict"
        ? "text-verdict-deep"
        : "text-ink";
  return (
    <div>
      <div className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      <div className={`tnum mt-0.5 text-sm font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function VerdictStat({
  label,
  value,
  name,
  note,
  tone,
}: {
  label: string;
  value: string;
  name: string;
  note: string;
  tone: "gold" | "pitch" | "muted";
}) {
  const color =
    tone === "gold"
      ? "text-gold-soft"
      : tone === "pitch"
        ? "text-pitch-soft"
        : "text-parchment/50";
  return (
    <div className="border-l border-parchment/15 pl-5">
      <div className="kicker text-parchment/50">{label}</div>
      <div className={`tnum mt-2 font-display text-3xl font-semibold ${color}`}>
        {value}
      </div>
      <div className="mt-1.5 font-display text-base text-parchment">{name}</div>
      <div className="mt-1 text-xs leading-relaxed text-parchment/55">{note}</div>
    </div>
  );
}
