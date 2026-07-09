// WC2014 dataset — FIFA World Cup Brazil 2014.
//
// RESULTS ARE REAL: every score and result reflects the actual 90-minute
// (regular time) outcome, the standard settlement for the 1X2 match-odds
// market. Knockout ties level at 90 minutes are coded as draws (D), with the
// 90-minute score — extra time and penalties decided who advanced but do not
// change the 1X2 result. (The match ledger shows the 90-minute score.)
//
// ODDS ARE REPRESENTATIVE: plausible pre-match decimal lines for each fixture,
// chosen to reflect how each matchup was actually priced (heavy favourites
// short, group dead-heats tight). They carry a realistic ~5–7% bookmaker
// overround. The schema is identical to the WC2026 study, so the analytics
// recompute automatically — but treat the odds as illustrative, not exact.

import type { Match } from "./types";

export const matches: Match[] = [
  // ── Group A ──────────────────────────────────────────────────────────────
  { id: "A1", stage: "Group", date: "2014-06-12", homeTeam: "Brazil",      awayTeam: "Croatia",    oddsHome: 1.30, oddsDraw: 5.00, oddsAway: 9.00, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "A2", stage: "Group", date: "2014-06-13", homeTeam: "Mexico",      awayTeam: "Cameroon",   oddsHome: 1.70, oddsDraw: 3.50, oddsAway: 5.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "A3", stage: "Group", date: "2014-06-17", homeTeam: "Brazil",      awayTeam: "Mexico",     oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 6.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "A4", stage: "Group", date: "2014-06-18", homeTeam: "Cameroon",    awayTeam: "Croatia",    oddsHome: 3.50, oddsDraw: 3.20, oddsAway: 2.00, result: "A", scoreHome: 0, scoreAway: 4 },
  { id: "A5", stage: "Group", date: "2014-06-23", homeTeam: "Cameroon",    awayTeam: "Brazil",     oddsHome: 8.00, oddsDraw: 4.50, oddsAway: 1.40, result: "A", scoreHome: 1, scoreAway: 4 },
  { id: "A6", stage: "Group", date: "2014-06-23", homeTeam: "Croatia",     awayTeam: "Mexico",     oddsHome: 3.20, oddsDraw: 3.20, oddsAway: 2.20, result: "A", scoreHome: 1, scoreAway: 3 },

  // ── Group B ──────────────────────────────────────────────────────────────
  { id: "B1", stage: "Group", date: "2014-06-13", homeTeam: "Spain",       awayTeam: "Netherlands",oddsHome: 1.90, oddsDraw: 3.40, oddsAway: 4.00, result: "A", scoreHome: 1, scoreAway: 5 },
  { id: "B2", stage: "Group", date: "2014-06-13", homeTeam: "Chile",       awayTeam: "Australia",  oddsHome: 1.70, oddsDraw: 3.50, oddsAway: 5.00, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "B3", stage: "Group", date: "2014-06-18", homeTeam: "Spain",       awayTeam: "Chile",      oddsHome: 1.80, oddsDraw: 3.30, oddsAway: 4.20, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "B4", stage: "Group", date: "2014-06-18", homeTeam: "Australia",   awayTeam: "Netherlands",oddsHome: 5.00, oddsDraw: 3.60, oddsAway: 1.60, result: "A", scoreHome: 2, scoreAway: 3 },
  { id: "B5", stage: "Group", date: "2014-06-23", homeTeam: "Australia",   awayTeam: "Spain",      oddsHome: 3.00, oddsDraw: 3.30, oddsAway: 2.20, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "B6", stage: "Group", date: "2014-06-23", homeTeam: "Netherlands", awayTeam: "Chile",      oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 4.00, result: "H", scoreHome: 2, scoreAway: 0 },

  // ── Group C ──────────────────────────────────────────────────────────────
  { id: "C1", stage: "Group", date: "2014-06-14", homeTeam: "Colombia",    awayTeam: "Greece",     oddsHome: 1.85, oddsDraw: 3.30, oddsAway: 4.20, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "C2", stage: "Group", date: "2014-06-14", homeTeam: "Ivory Coast", awayTeam: "Japan",      oddsHome: 2.30, oddsDraw: 3.20, oddsAway: 3.00, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "C3", stage: "Group", date: "2014-06-19", homeTeam: "Colombia",    awayTeam: "Ivory Coast",oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.70, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "C4", stage: "Group", date: "2014-06-19", homeTeam: "Japan",       awayTeam: "Greece",     oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.10, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "C5", stage: "Group", date: "2014-06-24", homeTeam: "Japan",       awayTeam: "Colombia",   oddsHome: 3.50, oddsDraw: 3.20, oddsAway: 2.00, result: "A", scoreHome: 1, scoreAway: 4 },
  { id: "C6", stage: "Group", date: "2014-06-24", homeTeam: "Greece",      awayTeam: "Ivory Coast",oddsHome: 3.20, oddsDraw: 3.10, oddsAway: 2.20, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Group D ──────────────────────────────────────────────────────────────
  { id: "D1", stage: "Group", date: "2014-06-14", homeTeam: "Uruguay",     awayTeam: "Costa Rica", oddsHome: 1.65, oddsDraw: 3.60, oddsAway: 5.50, result: "A", scoreHome: 1, scoreAway: 3 },
  { id: "D2", stage: "Group", date: "2014-06-14", homeTeam: "England",     awayTeam: "Italy",      oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.70, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "D3", stage: "Group", date: "2014-06-19", homeTeam: "Uruguay",     awayTeam: "England",    oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.10, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "D4", stage: "Group", date: "2014-06-20", homeTeam: "Italy",       awayTeam: "Costa Rica", oddsHome: 1.85, oddsDraw: 3.30, oddsAway: 4.20, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "D5", stage: "Group", date: "2014-06-24", homeTeam: "Italy",       awayTeam: "Uruguay",    oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.70, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "D6", stage: "Group", date: "2014-06-24", homeTeam: "Costa Rica",  awayTeam: "England",    oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 3.00, result: "D", scoreHome: 0, scoreAway: 0 },

  // ── Group E ──────────────────────────────────────────────────────────────
  { id: "E1", stage: "Group", date: "2014-06-15", homeTeam: "Switzerland", awayTeam: "Ecuador",    oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "E2", stage: "Group", date: "2014-06-15", homeTeam: "France",      awayTeam: "Honduras",   oddsHome: 1.40, oddsDraw: 4.20, oddsAway: 7.50, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "E3", stage: "Group", date: "2014-06-20", homeTeam: "Switzerland", awayTeam: "France",     oddsHome: 3.20, oddsDraw: 3.30, oddsAway: 2.10, result: "A", scoreHome: 2, scoreAway: 5 },
  { id: "E4", stage: "Group", date: "2014-06-20", homeTeam: "Honduras",    awayTeam: "Ecuador",    oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.70, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "E5", stage: "Group", date: "2014-06-25", homeTeam: "Honduras",    awayTeam: "Switzerland",oddsHome: 3.20, oddsDraw: 3.20, oddsAway: 2.10, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "E6", stage: "Group", date: "2014-06-25", homeTeam: "Ecuador",     awayTeam: "France",     oddsHome: 4.00, oddsDraw: 3.30, oddsAway: 1.85, result: "D", scoreHome: 0, scoreAway: 0 },

  // ── Group F ──────────────────────────────────────────────────────────────
  { id: "F1", stage: "Group", date: "2014-06-15", homeTeam: "Argentina",   awayTeam: "Bosnia",     oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 8.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "F2", stage: "Group", date: "2014-06-16", homeTeam: "Iran",        awayTeam: "Nigeria",    oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.70, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "F3", stage: "Group", date: "2014-06-21", homeTeam: "Argentina",   awayTeam: "Iran",       oddsHome: 1.25, oddsDraw: 5.50, oddsAway: 10.0, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "F4", stage: "Group", date: "2014-06-21", homeTeam: "Nigeria",     awayTeam: "Bosnia",     oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.60, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "F5", stage: "Group", date: "2014-06-25", homeTeam: "Argentina",   awayTeam: "Nigeria",    oddsHome: 1.40, oddsDraw: 4.50, oddsAway: 7.50, result: "H", scoreHome: 3, scoreAway: 2 },
  { id: "F6", stage: "Group", date: "2014-06-25", homeTeam: "Bosnia",      awayTeam: "Iran",       oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.70, result: "H", scoreHome: 3, scoreAway: 1 },

  // ── Group G ──────────────────────────────────────────────────────────────
  { id: "G1", stage: "Group", date: "2014-06-16", homeTeam: "Germany",     awayTeam: "Portugal",   oddsHome: 1.85, oddsDraw: 3.40, oddsAway: 4.20, result: "H", scoreHome: 4, scoreAway: 0 },
  { id: "G2", stage: "Group", date: "2014-06-16", homeTeam: "Ghana",       awayTeam: "USA",        oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "G3", stage: "Group", date: "2014-06-21", homeTeam: "Germany",     awayTeam: "Ghana",      oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 5.80, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "G4", stage: "Group", date: "2014-06-22", homeTeam: "USA",         awayTeam: "Portugal",   oddsHome: 3.00, oddsDraw: 3.10, oddsAway: 2.40, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "G5", stage: "Group", date: "2014-06-26", homeTeam: "USA",         awayTeam: "Germany",    oddsHome: 3.10, oddsDraw: 3.10, oddsAway: 2.30, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "G6", stage: "Group", date: "2014-06-26", homeTeam: "Portugal",    awayTeam: "Ghana",      oddsHome: 1.70, oddsDraw: 3.50, oddsAway: 5.00, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Group H ──────────────────────────────────────────────────────────────
  { id: "H1", stage: "Group", date: "2014-06-17", homeTeam: "Belgium",     awayTeam: "Algeria",    oddsHome: 1.65, oddsDraw: 3.60, oddsAway: 5.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "H2", stage: "Group", date: "2014-06-17", homeTeam: "Russia",      awayTeam: "South Korea",oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 4.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "H3", stage: "Group", date: "2014-06-22", homeTeam: "Belgium",     awayTeam: "Russia",     oddsHome: 1.85, oddsDraw: 3.30, oddsAway: 4.20, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "H4", stage: "Group", date: "2014-06-22", homeTeam: "South Korea", awayTeam: "Algeria",    oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 2, scoreAway: 4 },
  { id: "H5", stage: "Group", date: "2014-06-26", homeTeam: "Algeria",     awayTeam: "Russia",     oddsHome: 2.10, oddsDraw: 3.20, oddsAway: 3.40, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "H6", stage: "Group", date: "2014-06-26", homeTeam: "South Korea", awayTeam: "Belgium",    oddsHome: 4.50, oddsDraw: 3.40, oddsAway: 1.85, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Round of 16 ──────────────────────────────────────────────────────────
  { id: "R1", stage: "R16", date: "2014-06-28", homeTeam: "Brazil",       awayTeam: "Chile",      oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 6.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R2", stage: "R16", date: "2014-06-28", homeTeam: "Colombia",     awayTeam: "Uruguay",    oddsHome: 1.85, oddsDraw: 3.30, oddsAway: 4.20, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "R3", stage: "R16", date: "2014-06-29", homeTeam: "Netherlands",  awayTeam: "Mexico",     oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 6.00, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "R4", stage: "R16", date: "2014-06-29", homeTeam: "Costa Rica",   awayTeam: "Greece",     oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.90, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R5", stage: "R16", date: "2014-06-30", homeTeam: "France",       awayTeam: "Nigeria",    oddsHome: 1.55, oddsDraw: 3.70, oddsAway: 6.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "R6", stage: "R16", date: "2014-06-30", homeTeam: "Germany",      awayTeam: "Algeria",    oddsHome: 1.50, oddsDraw: 3.90, oddsAway: 6.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "R7", stage: "R16", date: "2014-07-01", homeTeam: "Argentina",    awayTeam: "Switzerland",oddsHome: 1.50, oddsDraw: 3.90, oddsAway: 6.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "R8", stage: "R16", date: "2014-07-01", homeTeam: "Belgium",      awayTeam: "USA",        oddsHome: 1.70, oddsDraw: 3.50, oddsAway: 5.00, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Quarter-Finals ───────────────────────────────────────────────────────
  { id: "Q1", stage: "QF", date: "2014-07-04", homeTeam: "France",       awayTeam: "Germany",    oddsHome: 2.50, oddsDraw: 3.00, oddsAway: 3.00, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "Q2", stage: "QF", date: "2014-07-04", homeTeam: "Brazil",       awayTeam: "Colombia",   oddsHome: 1.85, oddsDraw: 3.30, oddsAway: 4.20, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "Q3", stage: "QF", date: "2014-07-05", homeTeam: "Argentina",    awayTeam: "Belgium",    oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.70, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "Q4", stage: "QF", date: "2014-07-05", homeTeam: "Netherlands",  awayTeam: "Costa Rica", oddsHome: 1.45, oddsDraw: 4.20, oddsAway: 7.50, result: "D", scoreHome: 0, scoreAway: 0 },

  // ── Semi-Finals ──────────────────────────────────────────────────────────
  { id: "S1", stage: "SF", date: "2014-07-08", homeTeam: "Brazil",        awayTeam: "Germany",   oddsHome: 2.60, oddsDraw: 3.20, oddsAway: 2.70, result: "A", scoreHome: 1, scoreAway: 7 },
  { id: "S2", stage: "SF", date: "2014-07-09", homeTeam: "Netherlands",   awayTeam: "Argentina", oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.70, result: "D", scoreHome: 0, scoreAway: 0 },

  // ── Third Place ──────────────────────────────────────────────────────────
  { id: "T1", stage: "3rd", date: "2014-07-12", homeTeam: "Brazil",       awayTeam: "Netherlands",oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 0, scoreAway: 3 },

  // ── Final ────────────────────────────────────────────────────────────────
  { id: "F1", stage: "Final", date: "2014-07-13", homeTeam: "Germany",    awayTeam: "Argentina", oddsHome: 2.50, oddsDraw: 3.00, oddsAway: 2.90, result: "D", scoreHome: 0, scoreAway: 0 },
];
