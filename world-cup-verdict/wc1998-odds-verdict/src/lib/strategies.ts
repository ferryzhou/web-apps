// Strategy backtesting for the WC1998 odds study.
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
      "Establishes the floor — and in 1998 the floor held. Favourites won 38 of 64 matches (59.4%) and the baseline returned a small profit. The market was honest about favourites rather than overconfident in them.",
    decide: (a) => betFavourite(a),
  },
  {
    id: "knockout-only",
    name: "Knockout Only",
    tagline: "Bet the favourite, but only in the knockouts",
    description:
      "Back the favourite in every knockout match, from the Round of 16 through the final. Sit out the group stage entirely.",
    insight:
      "The knockout-only filter barely edged the group stage (56% against 60%). A sharp Round of 16 (75%) was undone by a semi-final draw, a third-place upset and France's final defeat of Brazil — the late knockouts are where the filter bled.",
    decide: (a) => (isKnockout(a) ? betFavourite(a) : null),
  },
  {
    id: "strong-fav",
    name: "Strong Favourites",
    tagline: "Bet the favourite only when priced ≥ 50%",
    description:
      "Back the favourite, but only when its normalised probability is 50% or higher. Skip the coin-flips.",
    insight:
      "Above 50% the favourite won 70% of the time — but at short prices that barely cleared breakeven. The 50–60% band was a flat coin-flip (50%); only above 60% did the confidence actually pay.",
    decide: (a) => (a.favoriteProb >= 0.5 ? betFavourite(a) : null),
  },
  {
    id: "heavy-fav",
    name: "Heavy Favourites",
    tagline: "Bet the favourite only when priced ≥ 60%",
    description:
      "Back the favourite only when its normalised probability is 60% or higher — the high-confidence zone.",
    insight:
      "The 60–70% band converted at 69% and the 70–80% band at a perfect 100%. Above 60% was the cleanest edge of the tournament — heavy confidence was earned, not merely assumed.",
    decide: (a) => (a.favoriteProb >= 0.6 ? betFavourite(a) : null),
  },
  {
    id: "skip-deadzone",
    name: "Skip the Dead Zone",
    tagline: "Bet the favourite everywhere except the 40–50% band",
    description:
      "Back the favourite in every match except where its probability lands in the 40–50% 'dead zone' — the tightest calls where draws and upsets pile up.",
    insight:
      "Filtering the 40–50% dead zone — where favourites won exactly half the time — left 46 bets and a tidy profit. The dead zone was genuinely dead for favourite-backers; everything outside it held.",
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
      "Two edges — knockout sharpness and the >50% filter — stack, but only six bets qualified and five won. The lone loss was France, favoured away at Paraguay and held 0-0 at ninety. A near-perfect record on a tiny sample: high conviction, very wide error bars.",
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
      "The dead zone produced draws at a useful rate: 6 wins from 18 bets, the sturdiest edge of any strategy at a usable sample. Where the favourite was barely ahead, the draw was the right side of the price.",
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
