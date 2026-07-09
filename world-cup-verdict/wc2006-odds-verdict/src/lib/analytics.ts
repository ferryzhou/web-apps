// Pure-TS analytics for the WC2006 odds-accuracy study.
// All metrics here are derived from the `Match` records — no I/O, no globals.
// Anything shown in the UI is computed by `analyzeStudy(matches)`.

import type { Match, Result, Stage } from "@/data/types";

// ── Outcome indicator ────────────────────────────────────────────────────────
function indicator(result: Result, target: Result): 0 | 1 {
  return result === target ? 1 : 0;
}

// ── Per-match analysis ───────────────────────────────────────────────────────
export interface MatchAnalysis {
  match: Match;
  impliedHome: number;
  impliedDraw: number;
  impliedAway: number;
  /** Sum of implied probabilities; > 1 because of the bookmaker margin. */
  overround: number;
  /** Bookmaker margin as a fraction, e.g. 0.054 = 5.4%. */
  margin: number;
  /** Margin-free normalized probabilities (sum to 1). */
  pHome: number;
  pDraw: number;
  pAway: number;
  /** The outcome with the highest normalized probability (the odds "prediction"). */
  predicted: Result;
  /** Normalized probability assigned to the predicted outcome. */
  predictedProb: number;
  /** Highest of the three normalized probabilities (= favorite's chance). */
  favoriteProb: number;
  /** Whether the predicted outcome matched the real result. */
  correct: boolean;
  brier: number;
  logLoss: number;
  /** Ranked Probability Score over ordered outcomes H/D/A. */
  rps: number;
}

export function analyzeMatch(match: Match): MatchAnalysis {
  const impliedHome = 1 / match.oddsHome;
  const impliedDraw = 1 / match.oddsDraw;
  const impliedAway = 1 / match.oddsAway;
  const overround = impliedHome + impliedDraw + impliedAway;
  const margin = overround - 1;

  const pHome = impliedHome / overround;
  const pDraw = impliedDraw / overround;
  const pAway = impliedAway / overround;

  const probs: Record<Result, number> = { H: pHome, D: pDraw, A: pAway };
  const predicted = (["H", "D", "A"] as Result[]).reduce((best, r) =>
    probs[r] > probs[best] ? r : best,
  );
  const predictedProb = probs[predicted];
  const favoriteProb = Math.max(pHome, pDraw, pAway);
  const correct = predicted === match.result;

  // Brier (multi-category): sum of squared errors over all outcomes.
  const iH = indicator(match.result, "H");
  const iD = indicator(match.result, "D");
  const iA = indicator(match.result, "A");
  const brier =
    (pHome - iH) ** 2 + (pDraw - iD) ** 2 + (pAway - iA) ** 2;

  // Log loss: -ln(probability assigned to the actual outcome).
  const pActual = probs[match.result];
  const logLoss = -Math.log(Math.max(pActual, 1e-9));

  // Ranked Probability Score for ordered outcomes [H, D, A].
  // RPS = (1/(r-1)) * sum_{i=1}^{r-1} (cumPred_i - cumObs_i)^2, r = 3.
  const cumPred1 = pHome;
  const cumObs1 = iH;
  const cumPred2 = pHome + pDraw;
  const cumObs2 = iH + iD;
  const rps = 0.5 * ((cumPred1 - cumObs1) ** 2 + (cumPred2 - cumObs2) ** 2);

  return {
    match,
    impliedHome,
    impliedDraw,
    impliedAway,
    overround,
    margin,
    pHome,
    pDraw,
    pAway,
    predicted,
    predictedProb,
    favoriteProb,
    correct,
    brier,
    logLoss,
    rps,
  };
}

// ── Aggregates & breakdowns ──────────────────────────────────────────────────
export interface StageBreakdown {
  stage: Stage;
  label: string;
  count: number;
  accuracy: number;
  brier: number;
  correct: number;
}

export interface BucketBreakdown {
  label: string;
  count: number;
  accuracy: number;
  meanFavoriteProb: number;
}

export interface CumulativePoint {
  index: number;
  id: string;
  label: string;
  accuracy: number;
  brier: number;
}

export interface HistogramBin {
  binLabel: string;
  count: number;
}

export interface CalibrationBin {
  binLabel: string;
  /** Midpoint of the predicted-probability bin (for plotting). */
  mid: number;
  count: number;
  /** Mean favorite predicted probability in this bin. */
  meanPredicted: number;
  /** Observed favorite-win frequency in this bin. */
  observedFreq: number;
}

export interface StudyResults {
  analyses: MatchAnalysis[];
  count: number;
  accuracy: number;
  brierScore: number;
  logLossScore: number;
  rpsScore: number;
  meanMargin: number;
  correctCount: number;
  drawsCount: number;
  /** Matches where the favorite (predicted) did not win. */
  upsetsCount: number;
  byStage: StageBreakdown[];
  byBucket: BucketBreakdown[];
  cumulative: CumulativePoint[];
  brierHistogram: HistogramBin[];
  calibration: CalibrationBin[];
  favoriteBias: {
    predicted: number;
    observed: number;
    bias: number;
  };
}

const STAGE_ORDER: Stage[] = ["Group", "R32", "R16", "QF", "SF", "3rd", "Final"];
const STAGE_LABEL: Record<Stage, string> = {
  Group: "Group Stage",
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarter-Final",
  SF: "Semi-Final",
  "3rd": "3rd Place",
  Final: "Final",
};

const CONFIDENCE_BUCKETS: { label: string; lo: number; hi: number }[] = [
  { label: "33–40%", lo: 0.333, hi: 0.4 },
  { label: "40–50%", lo: 0.4, hi: 0.5 },
  { label: "50–60%", lo: 0.5, hi: 0.6 },
  { label: "60–70%", lo: 0.6, hi: 0.7 },
  { label: "70–80%", lo: 0.7, hi: 0.8 },
  { label: "80%+", lo: 0.8, hi: 1.001 },
];

const CALIBRATION_BINS: { label: string; lo: number; hi: number }[] = [
  { label: "≤40%", lo: 0, hi: 0.4 },
  { label: "40–50%", lo: 0.4, hi: 0.5 },
  { label: "50–60%", lo: 0.5, hi: 0.6 },
  { label: "60–70%", lo: 0.6, hi: 0.7 },
  { label: "70–80%", lo: 0.7, hi: 0.8 },
  { label: "80%+", lo: 0.8, hi: 1.001 },
];

export function stageLabel(stage: Stage): string {
  return STAGE_LABEL[stage];
}

export function resultLabel(r: Result): string {
  return r === "H" ? "Home win" : r === "D" ? "Draw" : "Away win";
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function analyzeStudy(matches: Match[]): StudyResults {
  const analyses = matches
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map(analyzeMatch);

  const count = analyses.length;
  const correctCount = analyses.filter((a) => a.correct).length;
  const accuracy = correctCount / count;
  const brierScore = mean(analyses.map((a) => a.brier));
  const logLossScore = mean(analyses.map((a) => a.logLoss));
  const rpsScore = mean(analyses.map((a) => a.rps));
  const meanMargin = mean(analyses.map((a) => a.margin));
  const drawsCount = analyses.filter((a) => a.match.result === "D").length;
  // An "upset" is a non-draw where the favourite lost (the underdog won).
  // Draws are tracked separately, so draws + upsets + correct = total.
  const upsetsCount = analyses.filter((a) => !a.correct && a.match.result !== "D").length;

  // By stage (only stages that appear in the data).
  const presentStages = STAGE_ORDER.filter((s) =>
    analyses.some((a) => a.match.stage === s),
  );
  const byStage: StageBreakdown[] = presentStages.map((stage) => {
    const subset = analyses.filter((a) => a.match.stage === stage);
    const correct = subset.filter((a) => a.correct).length;
    return {
      stage,
      label: STAGE_LABEL[stage],
      count: subset.length,
      correct,
      accuracy: correct / subset.length,
      brier: mean(subset.map((a) => a.brier)),
    };
  });

  // By confidence bucket (favorite's normalized prob).
  const byBucket: BucketBreakdown[] = CONFIDENCE_BUCKETS.map((b) => {
    const subset = analyses.filter(
      (a) => a.favoriteProb >= b.lo && a.favoriteProb < b.hi,
    );
    const correct = subset.filter((a) => a.correct).length;
    return {
      label: b.label,
      count: subset.length,
      accuracy: subset.length ? correct / subset.length : 0,
      meanFavoriteProb: subset.length
        ? mean(subset.map((a) => a.favoriteProb))
        : 0,
    };
  }).filter((b) => b.count > 0);

  // Cumulative accuracy + brier over match order.
  let runningCorrect = 0;
  const cumulative: CumulativePoint[] = analyses.map((a, i) => {
    if (a.correct) runningCorrect += 1;
    return {
      index: i + 1,
      id: a.match.id,
      label: `${a.match.homeTeam} v ${a.match.awayTeam}`,
      accuracy: runningCorrect / (i + 1),
      brier: mean(analyses.slice(0, i + 1).map((x) => x.brier)),
    };
  });

  // Brier histogram (0–0.7 in 0.1 bins).
  const brierEdges = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1.0];
  const brierHistogram: HistogramBin[] = [];
  for (let i = 0; i < brierEdges.length - 1; i++) {
    const lo = brierEdges[i];
    const hi = brierEdges[i + 1];
    const c = analyses.filter(
      (a) => a.brier >= lo && (i === brierEdges.length - 2 ? a.brier <= hi : a.brier < hi),
    ).length;
    brierHistogram.push({
      binLabel: i === brierEdges.length - 2 ? "0.7+" : `${lo.toFixed(1)}–${hi.toFixed(1)}`,
      count: c,
    });
  }

  // Calibration: bin by favorite predicted prob, compare predicted vs observed.
  const calibration: CalibrationBin[] = CALIBRATION_BINS.map((b) => {
    const subset = analyses.filter(
      (a) => a.favoriteProb >= b.lo && a.favoriteProb < b.hi,
    );
    const observed = subset.filter((a) => a.correct).length;
    return {
      binLabel: b.label,
      mid: (b.lo + Math.min(b.hi, 1)) / 2,
      count: subset.length,
      meanPredicted: subset.length
        ? mean(subset.map((a) => a.favoriteProb))
        : 0,
      observedFreq: subset.length ? observed / subset.length : 0,
    };
  }).filter((b) => b.count > 0);

  // Favorite bias: average predicted favorite prob vs observed favorite-win rate.
  const predicted = mean(analyses.map((a) => a.favoriteProb));
  const observed = accuracy; // favorite win rate == overall accuracy (prediction = favorite)
  const favoriteBias = {
    predicted,
    observed,
    bias: observed - predicted,
  };

  return {
    analyses,
    count,
    accuracy,
    brierScore,
    logLossScore,
    rpsScore,
    meanMargin,
    correctCount,
    drawsCount,
    upsetsCount,
    byStage,
    byBucket,
    cumulative,
    brierHistogram,
    calibration,
    favoriteBias,
  };
}
