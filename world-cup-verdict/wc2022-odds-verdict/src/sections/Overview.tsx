import type { StudyResults } from "@/lib/analytics";
import { StatCard } from "@/components/ui/StatCard";
import { Reveal } from "@/components/ui/Reveal";

interface OverviewProps {
  results: StudyResults;
}

export function Overview({ results }: OverviewProps) {
  const {
    count,
    accuracy,
    brierScore,
    logLossScore,
    rpsScore,
    correctCount,
    upsetsCount,
    drawsCount,
    meanMargin,
  } = results;

  const accuracyPct = accuracy * 100;

  return (
    <section id="overview" className="relative scroll-mt-24">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="grain relative overflow-hidden bg-parchment">
        {/* Decorative oversized backdrop numeral */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[34rem] font-semibold leading-none text-ink/[0.035] md:text-[42rem]"
        >
          22
        </span>
        {/* Decorative vertical hairlines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex justify-between px-[8%] opacity-[0.5]">
          <span className="h-full w-px bg-ink/8" />
          <span className="h-full w-px bg-ink/8" />
          <span className="h-full w-px bg-ink/8" />
        </div>

        <div className="container relative z-10 max-w-read px-6 pb-24 pt-36 md:pt-44">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="kicker text-gold-deep">A study of prediction · FIFA World Cup 2022</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-8 font-display text-[4.5rem] font-semibold leading-[0.92] tracking-tightest text-ink sm:text-[6rem] md:text-[8.5rem]">
              The Verdict
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl font-display text-2xl font-medium leading-snug text-ink-soft md:text-3xl">
              Did the bookmakers call it right?
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-muted">
              We treat every pre-match betting line as a probabilistic forecast and every
              final whistle as ground truth. Across{" "}
              <span className="tnum text-ink">{count}</span> matches of the 2022 World Cup,
              this study measures how often the market was right — and exactly where it
              was wrong.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-ink/15 py-5">
              <HeroStat value={`${count}`} label="Matches analysed" />
              <HeroStat
                value={`${accuracyPct.toFixed(1)}%`}
                label="Prediction accuracy"
                accent
              />
              <HeroStat value={`${correctCount}/${count}`} label="Favorites that won" />
              <HeroStat value={`${upsetsCount}`} label="Upsets" />
              <HeroStat value={`${(meanMargin * 100).toFixed(1)}%`} label="Mean bookmaker margin" />
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <a
              href="#methodology"
              className="mt-12 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <span className="kicker">Read the study</span>
              <span className="text-gold">↓</span>
            </a>
          </Reveal>
        </div>
      </div>

      {/* ── Headline metrics ──────────────────────────────────────────────── */}
      <div className="bg-parchment py-20 md:py-28">
        <div className="container max-w-read">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="kicker shrink-0">Headline findings</span>
              <span className="h-px flex-1 bg-ink/15" />
            </div>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-muted">
              Five numbers summarise the market's performance. Accuracy is the headline;
              Brier, log loss and RPS reward confidence that is earned and punish
              confidence that is not.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              label="Accuracy"
              value={accuracyPct}
              decimals={1}
              suffix="%"
              accent="gold"
              hint="The favourite won this share of all matches. A naive baseline of always picking the favourite."
              delay={0}
            />
            <StatCard
              label="Brier score"
              value={brierScore}
              decimals={3}
              accent="ink"
              hint="Mean squared error of the full probability forecast. 0 is perfect; lower is better."
              delay={0.05}
            />
            <StatCard
              label="Log loss"
              value={logLossScore}
              decimals={3}
              accent="ink"
              hint="Penalises confident wrong calls heavily. Lower is better; 0 is perfect."
              delay={0.1}
            />
            <StatCard
              label="RPS"
              value={rpsScore}
              decimals={3}
              accent="ink"
              hint="Ranked probability score over ordered H/D/A outcomes. Lower is better."
              delay={0.15}
            />
            <StatCard
              label="Matches"
              value={count}
              accent="pitch"
              hint={`${drawsCount} draws, ${upsetsCount} upsets. All 64 matches, group stage through the final.`}
              delay={0.2}
            />
          </div>
        </div>
      </div>

      {/* ── Executive summary ─────────────────────────────────────────────── */}
      <div className="bg-parchment-alt py-20 md:py-28">
        <div className="container max-w-read">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="kicker shrink-0">Executive summary</span>
              <span className="h-px flex-1 bg-ink/15" />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-8 max-w-prose space-y-5 text-[1.05rem] leading-relaxed text-ink-soft">
              <p className="dropcap">
                The market got it right{" "}
                <span className="tnum font-semibold text-ink">
                  {accuracyPct.toFixed(1)}%
                </span>{" "}
                of the time: in{" "}
                <span className="tnum font-semibold text-ink">
                  {correctCount}
                </span>{" "}
                of{" "}
                <span className="tnum font-semibold text-ink">{count}</span>{" "}
                matches the team carrying the shortest odds went on to win. That is a
                respectable hit rate, but accuracy alone flatters a forecaster. The deeper
                question is whether the odds were{" "}
                <em className="font-display italic text-ink">calibrated</em> — whether a
                side priced as a 70% chance really won seven times in ten.
              </p>
              <p>
                On the whole, the market was honest rather than heroic. Heavy favourites
                almost always delivered, and the Brier score of{" "}
                <span className="tnum font-semibold text-ink">
                  {brierScore.toFixed(3)}
                </span>{" "}
                and log loss of{" "}
                <span className="tnum font-semibold text-ink">
                  {logLossScore.toFixed(3)}
                </span>{" "}
                sit in the range expected of a competent probability forecast. The cracks
                show in the middle of the ground: tightly-matched group games produced{" "}
                <span className="tnum font-semibold text-ink">{drawsCount}</span> draws and{" "}
                <span className="tnum font-semibold text-ink">{upsetsCount}</span> upsets,
                exactly where the odds were least confident.
              </p>
              <p>
                The headline lesson is the favourite-longshot tension. Aggregated across
                the tournament, favourites won slightly more often than their price
                implied and longshots less often — the classic signature of a market that
                under-rates strong favourites and over-rates outsiders. The twist sits in
                the tightest matches: where the favourite was priced barely ahead, draws
                and upsets piled up and the favourite won less than quoted. The
                Calibration Lab lays both halves bare.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span
        className={`tnum font-display text-2xl font-semibold leading-none md:text-3xl ${
          accent ? "text-gold-deep" : "text-ink"
        }`}
      >
        {value}
      </span>
      <span className="mt-2 text-[0.7rem] uppercase tracking-kicker text-ink-muted">
        {label}
      </span>
    </div>
  );
}
