// Strategy backtesting for the WC2010 odds study.
//
// A strategy is a simple rule: given a match's analysis (odds-derived
// probabilities + stage + result), decide whether to place a bet and on which
// outcome. We backtest each strategy with flat 1-unit stakes across the full
// dataset and compute hit rate, profit and return on investment (ROI).
//
// Payout convention (decimal odds, 1-unit stake):
//   win  → returns `odds` units (profit = odds − 1)
//   lose → returns 0     units (profit = −1)
//
// ROI = total profit / total staked  (= profit / number of bets for flat stakes)

import type { Match, Result } from "@/data/types";
import type { MatchAnalysis } from "./analytics";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Bet {
  outcome: Result;
  /** Decimal odds at which the bet is struck. */
  odds: number;
}

export interface Strategy {
  id: string;
  name: string;
  /** One-line label shown in tables / legends. */
  tagline: string;
  /** What the rule does, in plain language. */
  description: string;
  /** Why this rule — the analysis insight it exploits. */
  insight: string;
  /** Returns the bet to place, or null to sit this match out. */
  decide: (a: MatchAnalysis) => Bet | null;
}

export interface BetRecord {
  matchId: string;
  label: string;
  date: string;
  bet: Bet;
  correct: boolean;
  /** Profit on this single bet: (odds − 1) if correct, −1 if wrong. */
  profit: number;
  /** Running profit up to and including this bet. */
  cumulative: number;
}

export interface StrategyResult {
  strategy: Strategy;
  bets: number;
  correct: number;
  hitRate: number;
  /** Total units staked (= bets for flat 1-unit stakes). */
  staked: number;
  /** Total units returned from winning bets. */
  returned: number;
  /** returned − staked. */
  profit: number;
  /** profit / staked. Positive = profitable. */
  roi: number;
  /** Mean decimal odds across placed bets. */
  avgOdds: number;
  records: BetRecord[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function oddsFor(match: Match, r: Result): number {
  return r === "H" ? match.oddsHome : r === "D" ? match.oddsDraw : match.oddsAway;
}

/** True for knockout-stage matches (no draws possible after extra time). */
function isKnockout(a: MatchAnalysis): boolean {
  return a.match.stage !== "Group";
}

/** A bet on the favourite (the odds-implied most likely outcome). */
function betFavourite(a: MatchAnalysis): Bet {
  return { outcome: a.predicted, odds: oddsFor(a.match, a.predicted) };
}

// ── Strategies ───────────────────────────────────────────────────────────────
// Each is grounded in a finding from the accuracy study — see the `insight`
// field for the link back to the calibration / stage analysis.

export const STRATEGIES: Strategy[] = [
  {
    id: "always-fav",
    name: "Always Bet Favourite",
    tagline: "Bet the favourite, every match",
    description:
      "The baseline. Back the outcome with the highest normalised probability in all 64 matches, flat 1 unit each time.",
    insight:
      "Establishes the floor — and in 2010 the floor was a loss. Favourites won only 45.3% of the time, the lowest of the World Cups studied, and the baseline bled money. The market was overconfident in favourites.",
    decide: (a) => betFavourite(a),
  },
  {
    id: "knockout-only",
    name: "Knockout Only",
    tagline: "Bet the favourite, but only in the knockouts",
    description:
      "Back the favourite in every knockout match, from the Round of 16 through the final. Sit out the group stage entirely.",
    insight:
      "Knockout accuracy was far sharper than the group stage (75% vs 42%). The group stage was a swamp of draws and upsets; the knockouts, save the semifinal and final, were where favourites delivered.",
    decide: (a) => (isKnockout(a) ? betFavourite(a) : null),
  },
  {
    id: "strong-fav",
    name: "Strong Favourites",
    tagline: "Bet the favourite only when priced ≥ 50%",
    description:
      "Back the favourite, but only when its normalised probability is 50% or higher. Skip the coin-flips.",
    insight:
      "Above 50% the favourite won only 50% of the time — a coin-flip. The 50–60% band offered no edge in 2010; only the heaviest favourites cleared their price.",
    decide: (a) => (a.favoriteProb >= 0.5 ? betFavourite(a) : null),
  },
  {
    id: "heavy-fav",
    name: "Heavy Favourites",
    tagline: "Bet the favourite only when priced ≥ 60%",
    description:
      "Back the favourite only when its normalised probability is 60% or higher — the high-confidence zone.",
    insight:
      "The 60–70% band converted at 80% — the one zone where confidence was earned. Above 60% was the only place favourites reliably beat their quote in an otherwise inverted tournament.",
    decide: (a) => (a.favoriteProb >= 0.6 ? betFavourite(a) : null),
  },
  {
    id: "skip-deadzone",
    name: "Skip the Dead Zone",
    tagline: "Bet the favourite everywhere except the 40–50% band",
    description:
      "Back the favourite in every match except where its probability lands in the 40–50% 'dead zone' — the tightest calls where draws and upsets pile up.",
    insight:
      "The 33–40% bucket won just 25% of the time and the 40–50% bucket 47%. Filtering the dead zone left 47 bets still losing money — the rot was everywhere below 60%.",
    decide: (a) =>
      a.favoriteProb >= 0.4 && a.favoriteProb < 0.5 ? null : betFavourite(a),
  },
  {
    id: "knockout-strong",
    name: "Knockout + Strong Favourite",
    tagline: "Stack the two best signals",
    description:
      "Back the favourite in knockouts, but only when its probability is ≥ 50%. Combines the stage filter with the confidence filter.",
    insight:
      "Two edges — knockout sharpness and the >50% filter — stack, but in 2010 only three bets qualified and all three won. A perfect record on a tiny sample: high conviction, very wide error bars.",
    decide: (a) =>
      isKnockout(a) && a.favoriteProb >= 0.5 ? betFavourite(a) : null,
  },
  {
    id: "value-draw",
    name: "Value the Draw",
    tagline: "Back the draw in the 40–50% dead zone",
    description:
      "A contrarian play: when the favourite is priced barely ahead (40–50%), back the draw instead. Exploits the pile-up of stalemates in tight matches.",
    insight:
      "The dead zone produced draws, but not enough: 3 wins from 17 bets. With favourites winning only 47% of the 40–50% band, the draw was the right instinct at the wrong price.",
    decide: (a) =>
      a.favoriteProb >= 0.4 && a.favoriteProb < 0.5
        ? { outcome: "D", odds: a.match.oddsDraw }
        : null,
  },
];

// ── Backtest ─────────────────────────────────────────────────────────────────

export function backtestStrategy(
  strategy: Strategy,
  analyses: MatchAnalysis[],
): StrategyResult {
  let cumulative = 0;
  const records: BetRecord[] = [];

  for (const a of analyses) {
    const bet = strategy.decide(a);
    if (!bet) continue;
    const correct = bet.outcome === a.match.result;
    const profit = correct ? bet.odds - 1 : -1;
    cumulative += profit;
    records.push({
      matchId: a.match.id,
      label: `${a.match.homeTeam} v ${a.match.awayTeam}`,
      date: a.match.date,
      bet,
      correct,
      profit,
      cumulative,
    });
  }

  const bets = records.length;
  const correct = records.filter((r) => r.correct).length;
  const staked = bets; // flat 1 unit per bet
  const returned = records
    .filter((r) => r.correct)
    .reduce((s, r) => s + r.bet.odds, 0);
  const profit = returned - staked;
  const avgOdds = bets
    ? records.reduce((s, r) => s + r.bet.odds, 0) / bets
    : 0;

  return {
    strategy,
    bets,
    correct,
    hitRate: bets ? correct / bets : 0,
    staked,
    returned,
    profit,
    roi: staked ? profit / staked : 0,
    avgOdds,
    records,
  };
}

export function backtestAll(analyses: MatchAnalysis[]): StrategyResult[] {
  return STRATEGIES.map((s) => backtestStrategy(s, analyses));
}
