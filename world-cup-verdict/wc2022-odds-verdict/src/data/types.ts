// Core domain types for the WC2022 odds-accuracy study.
// A single Match record is the ground unit; every metric in the app is
// derived from these fields at runtime.

export type Stage = "Group" | "R32" | "R16" | "QF" | "SF" | "3rd" | "Final";

// Match result, from the perspective of the home team.
// H = home win, D = draw, A = away win
export type Result = "H" | "D" | "A";

export interface Match {
  /** Stable id, e.g. "G01", "K09". */
  id: string;
  stage: Stage;
  /** ISO date the match was played. */
  date: string;
  homeTeam: string;
  awayTeam: string;
  /** Decimal (European) pre-match odds. > 1. */
  oddsHome: number;
  oddsDraw: number;
  oddsAway: number;
  /** Ground-truth result. */
  result: Result;
  scoreHome: number;
  scoreAway: number;
}
