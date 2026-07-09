import type { StudyResults } from "@/lib/analytics";
import { Section } from "@/components/ui/Section";
import { ChartCard } from "@/components/ui/ChartCard";
import { Reveal } from "@/components/ui/Reveal";
import { ReliabilityChart } from "@/components/charts/ReliabilityChart";
import { MarginHistogram } from "@/components/charts/MarginHistogram";

interface Props {
  results: StudyResults;
}

export function CalibrationLab({ results }: Props) {
  const { calibration, analyses, meanMargin, favoriteBias, accuracy } = results;
  const predictedPct = favoriteBias.predicted * 100;
  const observedPct = favoriteBias.observed * 100;
  const biasPct = favoriteBias.bias * 100;
  // Positive bias = favourites won MORE often than predicted (market under-rated them).
  const biasTone = biasPct >= 0 ? "pitch" : "verdict";
  const biasText =
    biasPct >= 0
      ? "Favourites outperformed their price — the market slightly under-rated them."
      : "Favourites underperformed their price — the market slightly over-rated them.";

  return (
    <Section
      id="calibration"
      kicker="Calibration lab"
      title={
        <>
          Were the odds <span className="italic text-gold-deep">honest</span>?
        </>
      }
      intro="Accuracy asks did the favourite win. Calibration asks a sharper question: when the market said 70%, did it happen 70% of the time? A forecast can be right often and still be badly calibrated."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          kicker="Reliability"
          title="Reliability diagram"
          caption="Each point is a bucket of matches. Gold = observed favourite-win rate at that predicted-probability level; dashed = perfect calibration. Above the line: favourites won more than priced. Below: they won less."
          delay={0}
        >
          <ReliabilityChart data={calibration} />
        </ChartCard>

        {/* Favourite-bias panel */}
        <Reveal delay={0.05}>
          <div className="flex h-full flex-col border border-ink/15 bg-parchment">
            <div className="border-b border-ink/15 bg-parchment-alt px-6 py-4">
              <div className="kicker">Favourite bias</div>
              <h4 className="mt-1 font-display text-lg font-medium text-ink">
                Predicted vs observed favourite-win rate
              </h4>
            </div>
            <div className="flex-1 p-6">
              <div className="grid grid-cols-2 gap-6">
                <BiasStat label="Predicted" value={predictedPct} decimals={1} tone="ink" />
                <BiasStat label="Observed" value={observedPct} decimals={1} tone="gold" />
              </div>

              {/* Divergence bar */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs uppercase tracking-kicker text-ink-muted">
                  <span>0%</span>
                  <span>bias = observed − predicted</span>
                  <span>±10%</span>
                </div>
                <div className="relative mt-2 h-3 w-full bg-ink/10">
                  {/* centre line */}
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/40" />
                  <span
                    className={`absolute top-0 h-full ${biasTone === "pitch" ? "bg-pitch" : "bg-verdict"}`}
                    style={{
                      left: biasPct >= 0 ? "50%" : `${50 + biasPct * 5}%`,
                      width: `${Math.abs(biasPct) * 5}%`,
                    }}
                  />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className={`tnum font-display text-3xl font-semibold ${biasTone === "pitch" ? "text-pitch" : "text-verdict"}`}>
                    {biasPct >= 0 ? "+" : ""}{biasPct.toFixed(1)}%
                  </span>
                  <span className="text-sm text-ink-muted">bias</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{biasText}</p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden border border-ink/15 bg-ink/15">
                <MiniCell label="Calibration pts" value={`${calibration.length}`} />
                <MiniCell label="Observed fav. wins" value={`${results.correctCount}`} />
                <MiniCell label="Overall accuracy" value={`${(accuracy * 100).toFixed(1)}%`} />
              </div>
            </div>
          </div>
        </Reveal>

        <ChartCard
          kicker="Bookmaker margin"
          title="Overround distribution"
          caption="The overround is the sum of implied probabilities minus 1 — the bookmaker's built-in edge. The gold bar marks the bin containing the tournament mean."
          delay={0.1}
        >
          <MarginHistogram analyses={analyses} meanMargin={meanMargin} />
        </ChartCard>

        <Reveal delay={0.15}>
          <div className="flex h-full flex-col justify-center border border-ink/15 bg-ink p-8 text-parchment">
            <div className="kicker text-gold-soft">Interpretation</div>
            <p className="mt-4 font-display text-2xl font-medium leading-snug">
              An <span className="text-gold-soft">honest</span> market, undone in the
              middle.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-parchment/70">
              Clear favourites, priced at 60% or higher, delivered 14 of 15 — France's
              opening defeat to Senegal was the lone blemish at the top of the market.
              Below that line the honesty broke down: the 33–40% band won just 25% of the
              time and the 40–50% band 40%, the stretch where Argentina and Portugal were
              unseated in the groups and France finished goalless and out. South Korea
              rode two level-at-ninety draws past Italy and Spain to a semi-final no one
              had priced; Senegal, who beat the holders in the opener, reached the last
              eight. Nineteen draws filled the gaps. Netted across 64 matches, the
              aggregate favourite bias of{" "}
              <span className="tnum text-gold-soft">
                {biasPct >= 0 ? "+" : ""}{biasPct.toFixed(1)}%
              </span>{" "}
              is a rounding error — the market was honest in the round, even as the
              tournament was cruel in the detail.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function BiasStat({
  label,
  value,
  decimals,
  tone,
}: {
  label: string;
  value: number;
  decimals: number;
  tone: "ink" | "gold";
}) {
  return (
    <div>
      <div className="kicker">{label}</div>
      <div
        className={`tnum mt-2 font-display text-4xl font-semibold ${
          tone === "gold" ? "text-gold-deep" : "text-ink"
        }`}
      >
        {value.toFixed(decimals)}%
      </div>
    </div>
  );
}

function MiniCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-parchment px-3 py-3">
      <div className="kicker text-[0.6rem]">{label}</div>
      <div className="tnum mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
