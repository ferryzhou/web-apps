// WC2022 dataset — FIFA World Cup Qatar 2022.
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
  { id: "A1", stage: "Group", date: "2022-11-20", homeTeam: "Qatar",      awayTeam: "Ecuador",    oddsHome: 3.80, oddsDraw: 3.40, oddsAway: 1.95, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "A2", stage: "Group", date: "2022-11-21", homeTeam: "Senegal",    awayTeam: "Netherlands",oddsHome: 5.50, oddsDraw: 3.60, oddsAway: 1.55, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "A3", stage: "Group", date: "2022-11-25", homeTeam: "Qatar",      awayTeam: "Senegal",   oddsHome: 3.60, oddsDraw: 3.50, oddsAway: 2.00, result: "A", scoreHome: 1, scoreAway: 3 },
  { id: "A4", stage: "Group", date: "2022-11-25", homeTeam: "Netherlands",awayTeam: "Ecuador",   oddsHome: 1.70, oddsDraw: 3.60, oddsAway: 5.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "A5", stage: "Group", date: "2022-11-29", homeTeam: "Ecuador",    awayTeam: "Senegal",   oddsHome: 2.70, oddsDraw: 3.20, oddsAway: 2.60, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "A6", stage: "Group", date: "2022-11-29", homeTeam: "Netherlands",awayTeam: "Qatar",     oddsHome: 1.25, oddsDraw: 5.50, oddsAway: 9.00, result: "H", scoreHome: 2, scoreAway: 0 },

  // ── Group B ──────────────────────────────────────────────────────────────
  { id: "B1", stage: "Group", date: "2022-11-21", homeTeam: "England",    awayTeam: "Iran",      oddsHome: 1.25, oddsDraw: 6.00, oddsAway: 9.50, result: "H", scoreHome: 6, scoreAway: 2 },
  { id: "B2", stage: "Group", date: "2022-11-21", homeTeam: "USA",        awayTeam: "Wales",     oddsHome: 2.00, oddsDraw: 3.30, oddsAway: 3.70, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "B3", stage: "Group", date: "2022-11-25", homeTeam: "Wales",      awayTeam: "Iran",      oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.60, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "B4", stage: "Group", date: "2022-11-25", homeTeam: "England",    awayTeam: "USA",       oddsHome: 1.45, oddsDraw: 4.20, oddsAway: 7.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "B5", stage: "Group", date: "2022-11-29", homeTeam: "Wales",      awayTeam: "England",   oddsHome: 7.50, oddsDraw: 4.50, oddsAway: 1.40, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "B6", stage: "Group", date: "2022-11-29", homeTeam: "Iran",       awayTeam: "USA",       oddsHome: 3.00, oddsDraw: 3.10, oddsAway: 2.35, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Group C ──────────────────────────────────────────────────────────────
  { id: "C1", stage: "Group", date: "2022-11-22", homeTeam: "Argentina",  awayTeam: "Saudi Arabia", oddsHome: 1.18, oddsDraw: 7.00, oddsAway: 15.0, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "C2", stage: "Group", date: "2022-11-22", homeTeam: "Mexico",     awayTeam: "Poland",      oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.80, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "C3", stage: "Group", date: "2022-11-26", homeTeam: "Poland",     awayTeam: "Saudi Arabia",oddsHome: 1.95, oddsDraw: 3.40, oddsAway: 4.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "C4", stage: "Group", date: "2022-11-26", homeTeam: "Argentina",  awayTeam: "Mexico",      oddsHome: 1.45, oddsDraw: 4.00, oddsAway: 7.50, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "C5", stage: "Group", date: "2022-11-30", homeTeam: "Poland",     awayTeam: "Argentina",   oddsHome: 5.50, oddsDraw: 3.80, oddsAway: 1.55, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "C6", stage: "Group", date: "2022-11-30", homeTeam: "Saudi Arabia",awayTeam: "Mexico",     oddsHome: 3.40, oddsDraw: 3.40, oddsAway: 2.10, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Group D ──────────────────────────────────────────────────────────────
  { id: "D1", stage: "Group", date: "2022-11-22", homeTeam: "Denmark",    awayTeam: "Tunisia",   oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 5.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "D2", stage: "Group", date: "2022-11-22", homeTeam: "France",     awayTeam: "Australia", oddsHome: 1.25, oddsDraw: 5.50, oddsAway: 10.0, result: "H", scoreHome: 4, scoreAway: 1 },
  { id: "D3", stage: "Group", date: "2022-11-26", homeTeam: "Tunisia",    awayTeam: "Australia", oddsHome: 2.90, oddsDraw: 3.10, oddsAway: 2.50, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "D4", stage: "Group", date: "2022-11-26", homeTeam: "France",     awayTeam: "Denmark",   oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "D5", stage: "Group", date: "2022-11-30", homeTeam: "Australia",  awayTeam: "Denmark",   oddsHome: 4.00, oddsDraw: 3.30, oddsAway: 1.90, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "D6", stage: "Group", date: "2022-11-30", homeTeam: "France",     awayTeam: "Tunisia",   oddsHome: 1.40, oddsDraw: 4.30, oddsAway: 7.50, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Group E ──────────────────────────────────────────────────────────────
  { id: "E1", stage: "Group", date: "2022-11-23", homeTeam: "Germany",    awayTeam: "Japan",     oddsHome: 1.35, oddsDraw: 4.80, oddsAway: 8.50, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "E2", stage: "Group", date: "2022-11-23", homeTeam: "Spain",      awayTeam: "Costa Rica",oddsHome: 1.25, oddsDraw: 6.00, oddsAway: 11.0, result: "H", scoreHome: 7, scoreAway: 0 },
  { id: "E3", stage: "Group", date: "2022-11-27", homeTeam: "Japan",      awayTeam: "Costa Rica",oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.50, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "E4", stage: "Group", date: "2022-11-27", homeTeam: "Spain",      awayTeam: "Germany",   oddsHome: 2.50, oddsDraw: 3.30, oddsAway: 2.90, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "E5", stage: "Group", date: "2022-12-01", homeTeam: "Costa Rica", awayTeam: "Germany",   oddsHome: 8.00, oddsDraw: 5.00, oddsAway: 1.35, result: "A", scoreHome: 2, scoreAway: 4 },
  { id: "E6", stage: "Group", date: "2022-12-01", homeTeam: "Japan",      awayTeam: "Spain",     oddsHome: 3.60, oddsDraw: 3.40, oddsAway: 2.05, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Group F ──────────────────────────────────────────────────────────────
  { id: "F1", stage: "Group", date: "2022-11-23", homeTeam: "Morocco",    awayTeam: "Croatia",   oddsHome: 3.40, oddsDraw: 3.10, oddsAway: 2.20, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "F2", stage: "Group", date: "2022-11-23", homeTeam: "Belgium",    awayTeam: "Canada",    oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "F3", stage: "Group", date: "2022-11-27", homeTeam: "Belgium",    awayTeam: "Morocco",   oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 5.00, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "F4", stage: "Group", date: "2022-11-27", homeTeam: "Croatia",    awayTeam: "Canada",    oddsHome: 1.45, oddsDraw: 4.20, oddsAway: 7.00, result: "H", scoreHome: 4, scoreAway: 1 },
  { id: "F5", stage: "Group", date: "2022-12-01", homeTeam: "Croatia",    awayTeam: "Belgium",   oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.70, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "F6", stage: "Group", date: "2022-12-01", homeTeam: "Canada",     awayTeam: "Morocco",   oddsHome: 4.00, oddsDraw: 3.30, oddsAway: 1.95, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Group G ──────────────────────────────────────────────────────────────
  { id: "G1", stage: "Group", date: "2022-11-24", homeTeam: "Switzerland",awayTeam: "Cameroon",  oddsHome: 1.60, oddsDraw: 3.70, oddsAway: 5.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "G2", stage: "Group", date: "2022-11-24", homeTeam: "Brazil",     awayTeam: "Serbia",    oddsHome: 1.30, oddsDraw: 5.00, oddsAway: 10.0, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "G3", stage: "Group", date: "2022-11-28", homeTeam: "Cameroon",   awayTeam: "Serbia",    oddsHome: 3.30, oddsDraw: 3.20, oddsAway: 2.30, result: "D", scoreHome: 3, scoreAway: 3 },
  { id: "G4", stage: "Group", date: "2022-11-28", homeTeam: "Brazil",     awayTeam: "Switzerland",oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 8.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "G5", stage: "Group", date: "2022-12-02", homeTeam: "Serbia",     awayTeam: "Switzerland",oddsHome: 2.70, oddsDraw: 3.40, oddsAway: 2.50, result: "A", scoreHome: 2, scoreAway: 3 },
  { id: "G6", stage: "Group", date: "2022-12-02", homeTeam: "Cameroon",   awayTeam: "Brazil",    oddsHome: 7.00, oddsDraw: 4.50, oddsAway: 1.45, result: "H", scoreHome: 1, scoreAway: 0 },

  // ── Group H ──────────────────────────────────────────────────────────────
  { id: "H1", stage: "Group", date: "2022-11-24", homeTeam: "Uruguay",    awayTeam: "South Korea", oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 4.20, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "H2", stage: "Group", date: "2022-11-24", homeTeam: "Portugal",   awayTeam: "Ghana",     oddsHome: 1.50, oddsDraw: 4.20, oddsAway: 6.50, result: "H", scoreHome: 3, scoreAway: 2 },
  { id: "H3", stage: "Group", date: "2022-11-28", homeTeam: "South Korea",awayTeam: "Ghana",     oddsHome: 2.30, oddsDraw: 3.30, oddsAway: 3.00, result: "A", scoreHome: 2, scoreAway: 3 },
  { id: "H4", stage: "Group", date: "2022-11-28", homeTeam: "Portugal",   awayTeam: "Uruguay",   oddsHome: 1.85, oddsDraw: 3.40, oddsAway: 4.20, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "H5", stage: "Group", date: "2022-12-02", homeTeam: "Ghana",      awayTeam: "Uruguay",   oddsHome: 3.40, oddsDraw: 3.30, oddsAway: 2.10, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "H6", stage: "Group", date: "2022-12-02", homeTeam: "South Korea",awayTeam: "Portugal",  oddsHome: 4.00, oddsDraw: 3.40, oddsAway: 1.90, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Round of 16 (90-minute result; ties settled as draws in the 1X2 market)
  { id: "R1", stage: "R16", date: "2022-12-03", homeTeam: "Netherlands",  awayTeam: "USA",       oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 6.00, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "R2", stage: "R16", date: "2022-12-03", homeTeam: "Argentina",    awayTeam: "Australia", oddsHome: 1.25, oddsDraw: 5.50, oddsAway: 10.0, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "R3", stage: "R16", date: "2022-12-04", homeTeam: "France",       awayTeam: "Poland",    oddsHome: 1.40, oddsDraw: 4.30, oddsAway: 7.50, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "R4", stage: "R16", date: "2022-12-04", homeTeam: "England",      awayTeam: "Senegal",   oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.50, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "R5", stage: "R16", date: "2022-12-05", homeTeam: "Croatia",      awayTeam: "Japan",     oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.30, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R6", stage: "R16", date: "2022-12-05", homeTeam: "Brazil",       awayTeam: "South Korea", oddsHome: 1.40, oddsDraw: 4.50, oddsAway: 7.50, result: "H", scoreHome: 4, scoreAway: 1 },
  { id: "R7", stage: "R16", date: "2022-12-06", homeTeam: "Morocco",      awayTeam: "Spain",     oddsHome: 4.50, oddsDraw: 3.00, oddsAway: 1.85, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "R8", stage: "R16", date: "2022-12-06", homeTeam: "Portugal",     awayTeam: "Switzerland",oddsHome: 1.70, oddsDraw: 3.60, oddsAway: 5.00, result: "H", scoreHome: 6, scoreAway: 1 },

  // ── Quarter-finals (90-minute result)
  { id: "Q1", stage: "QF", date: "2022-12-09", homeTeam: "Croatia",      awayTeam: "Brazil",      oddsHome: 3.60, oddsDraw: 3.10, oddsAway: 2.05, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "Q2", stage: "QF", date: "2022-12-09", homeTeam: "Netherlands",  awayTeam: "Argentina",   oddsHome: 3.00, oddsDraw: 3.00, oddsAway: 2.40, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "Q3", stage: "QF", date: "2022-12-10", homeTeam: "Morocco",      awayTeam: "Portugal",    oddsHome: 4.50, oddsDraw: 3.00, oddsAway: 1.85, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "Q4", stage: "QF", date: "2022-12-10", homeTeam: "England",      awayTeam: "France",      oddsHome: 2.80, oddsDraw: 3.00, oddsAway: 2.60, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Semi-finals
  { id: "S1", stage: "SF", date: "2022-12-13", homeTeam: "Argentina",    awayTeam: "Croatia",     oddsHome: 1.70, oddsDraw: 3.50, oddsAway: 5.00, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "S2", stage: "SF", date: "2022-12-14", homeTeam: "France",       awayTeam: "Morocco",     oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 6.00, result: "H", scoreHome: 2, scoreAway: 0 },

  // ── Third place
  { id: "T1", stage: "3rd", date: "2022-12-17", homeTeam: "Croatia",     awayTeam: "Morocco",     oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 4.00, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Final (90 minutes: 2-2; Argentina won on penalties after extra time)
  { id: "F1", stage: "Final", date: "2022-12-18", homeTeam: "Argentina", awayTeam: "France",      oddsHome: 2.70, oddsDraw: 3.20, oddsAway: 2.60, result: "D", scoreHome: 2, scoreAway: 2 },
];
