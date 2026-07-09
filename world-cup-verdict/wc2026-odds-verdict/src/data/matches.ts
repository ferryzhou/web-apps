import type { Match } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// FIFA World Cup 2026 — representative match dataset
// ─────────────────────────────────────────────────────────────────────────────
// The 2026 tournament runs 11 Jun – 19 Jul 2026 across USA / Canada / Mexico.
// As of the study cut-off the group stage and early knockouts are complete.
//
// IMPORTANT: This is an ILLUSTRATIVE, REPRESENTATIVE dataset hand-assembled for
// the study. Decimal odds are plausible bookmaker-style figures; results are
// plausible outcomes chosen to exercise a realistic spread of favorites, draws
// and upsets. The schema matches `Match`, so real results can be dropped in
// without touching any code — the analytics recompute automatically.
//
// 48 matches: 36 group stage + 8 Round of 32 + 4 Round of 16.
// Knockout bracket is internally consistent: every R16 participant won its R32
// tie, and no knockout ends in a draw (extra time / pens resolved as a result).
// ─────────────────────────────────────────────────────────────────────────────

export const matches: Match[] = [
  // ── Group stage (36) ───────────────────────────────────────────────────────
  { id: "G01", stage: "Group", date: "2026-06-11", homeTeam: "Mexico", awayTeam: "South Africa", oddsHome: 1.95, oddsDraw: 3.55, oddsAway: 3.90, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "G02", stage: "Group", date: "2026-06-12", homeTeam: "Canada", awayTeam: "Morocco", oddsHome: 3.10, oddsDraw: 3.25, oddsAway: 2.30, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G03", stage: "Group", date: "2026-06-12", homeTeam: "USA", awayTeam: "Uzbekistan", oddsHome: 1.55, oddsDraw: 3.95, oddsAway: 5.75, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G04", stage: "Group", date: "2026-06-13", homeTeam: "France", awayTeam: "Saudi Arabia", oddsHome: 1.18, oddsDraw: 7.50, oddsAway: 15.00, result: "H", scoreHome: 4, scoreAway: 0 },
  { id: "G05", stage: "Group", date: "2026-06-13", homeTeam: "Australia", awayTeam: "Denmark", oddsHome: 3.40, oddsDraw: 3.20, oddsAway: 2.15, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "G06", stage: "Group", date: "2026-06-13", homeTeam: "Tunisia", awayTeam: "Ecuador", oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.65, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G07", stage: "Group", date: "2026-06-14", homeTeam: "Spain", awayTeam: "New Zealand", oddsHome: 1.12, oddsDraw: 9.00, oddsAway: 19.00, result: "H", scoreHome: 5, scoreAway: 0 },
  { id: "G08", stage: "Group", date: "2026-06-14", homeTeam: "Nigeria", awayTeam: "Switzerland", oddsHome: 2.55, oddsDraw: 3.20, oddsAway: 2.85, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G09", stage: "Group", date: "2026-06-14", homeTeam: "Croatia", awayTeam: "Japan", oddsHome: 2.20, oddsDraw: 3.20, oddsAway: 3.30, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G10", stage: "Group", date: "2026-06-15", homeTeam: "Brazil", awayTeam: "Serbia", oddsHome: 1.50, oddsDraw: 4.20, oddsAway: 6.20, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "G11", stage: "Group", date: "2026-06-15", homeTeam: "Costa Rica", awayTeam: "Senegal", oddsHome: 3.60, oddsDraw: 3.15, oddsAway: 2.05, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G12", stage: "Group", date: "2026-06-15", homeTeam: "Belgium", awayTeam: "Iran", oddsHome: 1.45, oddsDraw: 4.30, oddsAway: 7.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "G13", stage: "Group", date: "2026-06-16", homeTeam: "England", awayTeam: "Paraguay", oddsHome: 1.40, oddsDraw: 4.50, oddsAway: 7.80, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "G14", stage: "Group", date: "2026-06-16", homeTeam: "Qatar", awayTeam: "Uruguay", oddsHome: 4.80, oddsDraw: 3.50, oddsAway: 1.75, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G15", stage: "Group", date: "2026-06-16", homeTeam: "South Korea", awayTeam: "Wales", oddsHome: 2.35, oddsDraw: 3.20, oddsAway: 3.10, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G16", stage: "Group", date: "2026-06-17", homeTeam: "Argentina", awayTeam: "Egypt", oddsHome: 1.60, oddsDraw: 3.90, oddsAway: 5.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G17", stage: "Group", date: "2026-06-17", homeTeam: "Iceland", awayTeam: "Ghana", oddsHome: 3.05, oddsDraw: 3.15, oddsAway: 2.40, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "G18", stage: "Group", date: "2026-06-17", homeTeam: "Portugal", awayTeam: "Cameroon", oddsHome: 1.35, oddsDraw: 4.80, oddsAway: 9.00, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "G19", stage: "Group", date: "2026-06-18", homeTeam: "Germany", awayTeam: "Scotland", oddsHome: 1.30, oddsDraw: 5.20, oddsAway: 10.00, result: "H", scoreHome: 4, scoreAway: 1 },
  { id: "G20", stage: "Group", date: "2026-06-18", homeTeam: "Colombia", awayTeam: "Ivory Coast", oddsHome: 2.10, oddsDraw: 3.20, oddsAway: 3.50, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G21", stage: "Group", date: "2026-06-18", homeTeam: "Norway", awayTeam: "Jamaica", oddsHome: 1.85, oddsDraw: 3.50, oddsAway: 4.30, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "G22", stage: "Group", date: "2026-06-19", homeTeam: "Netherlands", awayTeam: "Panama", oddsHome: 1.38, oddsDraw: 4.60, oddsAway: 8.50, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "G23", stage: "Group", date: "2026-06-19", homeTeam: "Mexico", awayTeam: "Morocco", oddsHome: 2.45, oddsDraw: 3.20, oddsAway: 2.95, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G24", stage: "Group", date: "2026-06-19", homeTeam: "Canada", awayTeam: "South Africa", oddsHome: 2.70, oddsDraw: 3.15, oddsAway: 2.75, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G25", stage: "Group", date: "2026-06-20", homeTeam: "France", awayTeam: "Denmark", oddsHome: 1.65, oddsDraw: 3.75, oddsAway: 5.20, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G26", stage: "Group", date: "2026-06-20", homeTeam: "Australia", awayTeam: "Saudi Arabia", oddsHome: 2.00, oddsDraw: 3.30, oddsAway: 3.80, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "G27", stage: "Group", date: "2026-06-20", homeTeam: "Spain", awayTeam: "Switzerland", oddsHome: 1.55, oddsDraw: 4.10, oddsAway: 5.90, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G28", stage: "Group", date: "2026-06-21", homeTeam: "Nigeria", awayTeam: "New Zealand", oddsHome: 1.50, oddsDraw: 4.25, oddsAway: 6.30, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "G29", stage: "Group", date: "2026-06-21", homeTeam: "Ecuador", awayTeam: "Tunisia", oddsHome: 2.55, oddsDraw: 3.10, oddsAway: 2.95, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "G30", stage: "Group", date: "2026-06-21", homeTeam: "Croatia", awayTeam: "Japan", oddsHome: 2.30, oddsDraw: 3.15, oddsAway: 3.15, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "G31", stage: "Group", date: "2026-06-22", homeTeam: "Brazil", awayTeam: "Senegal", oddsHome: 1.58, oddsDraw: 3.95, oddsAway: 5.70, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G32", stage: "Group", date: "2026-06-22", homeTeam: "Serbia", awayTeam: "Costa Rica", oddsHome: 1.95, oddsDraw: 3.35, oddsAway: 3.90, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "G33", stage: "Group", date: "2026-06-22", homeTeam: "Belgium", awayTeam: "Uruguay", oddsHome: 2.05, oddsDraw: 3.30, oddsAway: 3.65, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G34", stage: "Group", date: "2026-06-23", homeTeam: "England", awayTeam: "Wales", oddsHome: 1.70, oddsDraw: 3.60, oddsAway: 4.80, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "G35", stage: "Group", date: "2026-06-23", homeTeam: "Paraguay", awayTeam: "South Korea", oddsHome: 3.20, oddsDraw: 3.10, oddsAway: 2.30, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "G36", stage: "Group", date: "2026-06-23", homeTeam: "Qatar", awayTeam: "Iran", oddsHome: 3.10, oddsDraw: 3.10, oddsAway: 2.35, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Round of 32 (8) ─────────────────────────────────────────────────────────
  { id: "K01", stage: "R32", date: "2026-06-28", homeTeam: "France", awayTeam: "Nigeria", oddsHome: 1.45, oddsDraw: 4.30, oddsAway: 6.80, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "K02", stage: "R32", date: "2026-06-28", homeTeam: "USA", awayTeam: "Uruguay", oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.70, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "K03", stage: "R32", date: "2026-06-29", homeTeam: "Spain", awayTeam: "South Korea", oddsHome: 1.60, oddsDraw: 3.85, oddsAway: 5.60, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "K04", stage: "R32", date: "2026-06-29", homeTeam: "Brazil", awayTeam: "Switzerland", oddsHome: 1.50, oddsDraw: 4.15, oddsAway: 6.20, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "K05", stage: "R32", date: "2026-06-30", homeTeam: "Argentina", awayTeam: "Denmark", oddsHome: 1.80, oddsDraw: 3.45, oddsAway: 4.40, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "K06", stage: "R32", date: "2026-06-30", homeTeam: "Germany", awayTeam: "Colombia", oddsHome: 1.95, oddsDraw: 3.35, oddsAway: 3.90, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "K07", stage: "R32", date: "2026-07-01", homeTeam: "England", awayTeam: "Senegal", oddsHome: 1.55, oddsDraw: 3.95, oddsAway: 6.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "K08", stage: "R32", date: "2026-07-01", homeTeam: "Portugal", awayTeam: "Croatia", oddsHome: 1.90, oddsDraw: 3.35, oddsAway: 4.00, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Round of 16 (4) ─────────────────────────────────────────────────────────
  { id: "K09", stage: "R16", date: "2026-07-04", homeTeam: "France", awayTeam: "USA", oddsHome: 1.70, oddsDraw: 3.45, oddsAway: 4.85, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "K10", stage: "R16", date: "2026-07-04", homeTeam: "Spain", awayTeam: "Brazil", oddsHome: 2.55, oddsDraw: 3.20, oddsAway: 2.75, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "K11", stage: "R16", date: "2026-07-05", homeTeam: "Argentina", awayTeam: "Colombia", oddsHome: 1.85, oddsDraw: 3.40, oddsAway: 4.25, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "K12", stage: "R16", date: "2026-07-05", homeTeam: "England", awayTeam: "Portugal", oddsHome: 2.30, oddsDraw: 3.20, oddsAway: 3.05, result: "H", scoreHome: 2, scoreAway: 1 },
];
