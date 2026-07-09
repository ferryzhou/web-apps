import type { StudyResults } from "@/lib/analytics";
import { Section } from "@/components/ui/Section";
import { ChartCard } from "@/components/ui/ChartCard";
import { StageAccuracyChart } from "@/components/charts/StageAccuracyChart";
import { BucketAccuracyChart } from "@/components/charts/BucketAccuracyChart";
import { CumulativeChart } from "@/components/charts/CumulativeChart";
import { BrierHistogram } from "@/components/charts/BrierHistogram";

interface Props {
  results: StudyResults;
}

export function ResultsDashboard({ results }: Props) {
  const {
    byStage,
    byBucket,
    cumulative,
    brierHistogram,
    accuracy,
    brierScore,
    count,
    correctCount,
    upsetsCount,
  } = results;

  return (
    <Section
      id="results"
      alt
      kicker="Results dashboard"
      title={
        <>
          The aggregate <span className="italic text-gold-deep">verdict</span>.
        </>
      }
      intro="One match is anecdote; sixty-four is evidence. These charts aggregate every forecast and result to show where the market was sharp, where it drifted, and how the story built over the tournament."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          kicker="By stage"
          title="Accuracy by tournament stage"
          caption="Green bars beat the tournament average (dashed); gold bars fall below it. The group stage was a swamp — 42% accuracy and eighteen draws. The knockouts sharpened to 75% through the quarter-finals, then both semifinals and the final went against the favourite."
          delay={0}
        >
          <StageAccuracyChart data={byStage} overallAccuracy={accuracy} />
        </ChartCard>

        <ChartCard
          kicker="By confidence"
          title="Observed vs predicted, by favourite strength"
          caption="Gold = the probability the market gave the favourite; green = how often that favourite actually won. Where green tops gold, the market under-rated the favourite."
          delay={0.05}
        >
          <BucketAccuracyChart data={byBucket} />
        </ChartCard>

        <ChartCard
          kicker="Over time"
          title="Cumulative accuracy"
          caption="Running hit rate after each match. The line stabilises as the sample grows — by the end, the noise of single upsets is smoothed away."
          delay={0.1}
        >
          <CumulativeChart data={cumulative} finalAccuracy={accuracy} />
        </ChartCard>

        <ChartCard
          kicker="Error distribution"
          title="Per-match Brier score"
          caption="How forecast error is spread. A pile near 0 means many clean calls; a fat right tail means confident misses. The mean sits at the dashed marker."
          delay={0.15}
        >
          <BrierHistogram data={brierHistogram} meanBrier={brierScore} />
        </ChartCard>
      </div>

      {/* Inline numeric summary strip */}
      <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-4">
        <SummaryCell label="Matches" value={`${count}`} />
        <SummaryCell label="Correct calls" value={`${correctCount}`} tone="pitch" />
        <SummaryCell label="Upsets" value={`${upsetsCount}`} tone="verdict" />
        <SummaryCell label="Mean Brier" value={brierScore.toFixed(3)} />
      </div>
    </Section>
  );
}

function SummaryCell({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "pitch" | "verdict";
}) {
  const color = tone === "pitch" ? "text-pitch" : tone === "verdict" ? "text-verdict" : "text-ink";
  return (
    <div className="bg-parchment px-6 py-5">
      <div className="kicker">{label}</div>
      <div className={`tnum mt-2 font-display text-3xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}
