// WC2002 dataset — FIFA World Cup Korea/Japan 2002.
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
  { id: "A1", stage: "Group", date: "2002-05-31", homeTeam: "France",       awayTeam: "Senegal",      oddsHome: 1.40, oddsDraw: 4.20, oddsAway: 8.00, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "A2", stage: "Group", date: "2002-06-01", homeTeam: "Uruguay",      awayTeam: "Denmark",      oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "A3", stage: "Group", date: "2002-06-06", homeTeam: "Denmark",      awayTeam: "Senegal",      oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "A4", stage: "Group", date: "2002-06-06", homeTeam: "France",       awayTeam: "Uruguay",      oddsHome: 1.70, oddsDraw: 3.30, oddsAway: 5.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "A5", stage: "Group", date: "2002-06-11", homeTeam: "Denmark",      awayTeam: "France",       oddsHome: 3.10, oddsDraw: 3.20, oddsAway: 2.10, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "A6", stage: "Group", date: "2002-06-11", homeTeam: "Senegal",      awayTeam: "Uruguay",      oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.80, result: "D", scoreHome: 3, scoreAway: 3 },

  // ── Group B ──────────────────────────────────────────────────────────────
  { id: "B1", stage: "Group", date: "2002-06-02", homeTeam: "Paraguay",     awayTeam: "South Africa", oddsHome: 2.00, oddsDraw: 3.10, oddsAway: 3.60, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "B2", stage: "Group", date: "2002-06-02", homeTeam: "Spain",        awayTeam: "Slovenia",     oddsHome: 1.40, oddsDraw: 4.00, oddsAway: 8.00, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "B3", stage: "Group", date: "2002-06-07", homeTeam: "Spain",        awayTeam: "Paraguay",     oddsHome: 1.55, oddsDraw: 3.60, oddsAway: 6.00, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "B4", stage: "Group", date: "2002-06-08", homeTeam: "South Africa", awayTeam: "Slovenia",     oddsHome: 1.90, oddsDraw: 3.20, oddsAway: 4.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "B5", stage: "Group", date: "2002-06-12", homeTeam: "South Africa", awayTeam: "Spain",        oddsHome: 3.40, oddsDraw: 3.10, oddsAway: 2.10, result: "A", scoreHome: 2, scoreAway: 3 },
  { id: "B6", stage: "Group", date: "2002-06-12", homeTeam: "Slovenia",     awayTeam: "Paraguay",     oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.50, result: "A", scoreHome: 1, scoreAway: 3 },

  // ── Group C ──────────────────────────────────────────────────────────────
  { id: "C1", stage: "Group", date: "2002-06-03", homeTeam: "Brazil",       awayTeam: "Turkey",       oddsHome: 1.35, oddsDraw: 4.20, oddsAway: 8.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "C2", stage: "Group", date: "2002-06-04", homeTeam: "Costa Rica",   awayTeam: "China",        oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 5.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "C3", stage: "Group", date: "2002-06-08", homeTeam: "Brazil",       awayTeam: "China",        oddsHome: 1.15, oddsDraw: 6.00, oddsAway: 17.0, result: "H", scoreHome: 4, scoreAway: 0 },
  { id: "C4", stage: "Group", date: "2002-06-09", homeTeam: "Turkey",       awayTeam: "Costa Rica",   oddsHome: 1.90, oddsDraw: 3.20, oddsAway: 4.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "C5", stage: "Group", date: "2002-06-13", homeTeam: "Turkey",       awayTeam: "China",        oddsHome: 1.30, oddsDraw: 4.50, oddsAway: 9.00, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "C6", stage: "Group", date: "2002-06-13", homeTeam: "Brazil",       awayTeam: "Costa Rica",   oddsHome: 1.30, oddsDraw: 4.50, oddsAway: 9.00, result: "H", scoreHome: 5, scoreAway: 2 },

  // ── Group D ──────────────────────────────────────────────────────────────
  { id: "D1", stage: "Group", date: "2002-06-04", homeTeam: "South Korea",  awayTeam: "Poland",       oddsHome: 2.10, oddsDraw: 3.10, oddsAway: 3.30, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "D2", stage: "Group", date: "2002-06-05", homeTeam: "USA",          awayTeam: "Portugal",     oddsHome: 3.50, oddsDraw: 3.20, oddsAway: 2.05, result: "H", scoreHome: 3, scoreAway: 2 },
  { id: "D3", stage: "Group", date: "2002-06-10", homeTeam: "South Korea",  awayTeam: "USA",          oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "D4", stage: "Group", date: "2002-06-10", homeTeam: "Portugal",     awayTeam: "Poland",       oddsHome: 1.40, oddsDraw: 4.00, oddsAway: 8.00, result: "H", scoreHome: 4, scoreAway: 0 },
  { id: "D5", stage: "Group", date: "2002-06-14", homeTeam: "Portugal",     awayTeam: "South Korea",  oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "D6", stage: "Group", date: "2002-06-14", homeTeam: "Poland",       awayTeam: "USA",          oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "H", scoreHome: 3, scoreAway: 1 },

  // ── Group E ──────────────────────────────────────────────────────────────
  { id: "E1", stage: "Group", date: "2002-06-01", homeTeam: "Ireland",      awayTeam: "Cameroon",     oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "E2", stage: "Group", date: "2002-06-01", homeTeam: "Germany",      awayTeam: "Saudi Arabia", oddsHome: 1.20, oddsDraw: 6.00, oddsAway: 15.0, result: "H", scoreHome: 8, scoreAway: 0 },
  { id: "E3", stage: "Group", date: "2002-06-05", homeTeam: "Germany",      awayTeam: "Ireland",      oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 5.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "E4", stage: "Group", date: "2002-06-06", homeTeam: "Cameroon",     awayTeam: "Saudi Arabia", oddsHome: 1.40, oddsDraw: 4.00, oddsAway: 8.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "E5", stage: "Group", date: "2002-06-11", homeTeam: "Cameroon",     awayTeam: "Germany",      oddsHome: 3.40, oddsDraw: 3.10, oddsAway: 2.10, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "E6", stage: "Group", date: "2002-06-11", homeTeam: "Saudi Arabia", awayTeam: "Ireland",      oddsHome: 4.50, oddsDraw: 3.40, oddsAway: 1.80, result: "A", scoreHome: 0, scoreAway: 3 },

  // ── Group F ──────────────────────────────────────────────────────────────
  { id: "F1", stage: "Group", date: "2002-06-02", homeTeam: "England",      awayTeam: "Sweden",       oddsHome: 2.10, oddsDraw: 3.10, oddsAway: 3.30, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "F2", stage: "Group", date: "2002-06-02", homeTeam: "Argentina",    awayTeam: "Nigeria",      oddsHome: 1.45, oddsDraw: 3.90, oddsAway: 7.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "F3", stage: "Group", date: "2002-06-07", homeTeam: "Sweden",       awayTeam: "Nigeria",      oddsHome: 1.90, oddsDraw: 3.20, oddsAway: 4.00, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "F4", stage: "Group", date: "2002-06-07", homeTeam: "Argentina",    awayTeam: "England",      oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "F5", stage: "Group", date: "2002-06-12", homeTeam: "Sweden",       awayTeam: "Argentina",    oddsHome: 3.10, oddsDraw: 3.10, oddsAway: 2.20, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "F6", stage: "Group", date: "2002-06-12", homeTeam: "Nigeria",      awayTeam: "England",      oddsHome: 3.20, oddsDraw: 3.10, oddsAway: 2.20, result: "D", scoreHome: 0, scoreAway: 0 },

  // ── Group G ──────────────────────────────────────────────────────────────
  { id: "G1", stage: "Group", date: "2002-06-03", homeTeam: "Croatia",      awayTeam: "Mexico",       oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "G2", stage: "Group", date: "2002-06-03", homeTeam: "Italy",        awayTeam: "Ecuador",      oddsHome: 1.40, oddsDraw: 4.00, oddsAway: 8.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "G3", stage: "Group", date: "2002-06-08", homeTeam: "Italy",        awayTeam: "Croatia",      oddsHome: 1.55, oddsDraw: 3.60, oddsAway: 6.00, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "G4", stage: "Group", date: "2002-06-09", homeTeam: "Mexico",       awayTeam: "Ecuador",      oddsHome: 1.90, oddsDraw: 3.20, oddsAway: 4.00, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G5", stage: "Group", date: "2002-06-13", homeTeam: "Mexico",       awayTeam: "Italy",        oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.50, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G6", stage: "Group", date: "2002-06-13", homeTeam: "Ecuador",      awayTeam: "Croatia",      oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.50, result: "H", scoreHome: 1, scoreAway: 0 },

  // ── Group H ──────────────────────────────────────────────────────────────
  { id: "H1", stage: "Group", date: "2002-06-04", homeTeam: "Japan",        awayTeam: "Belgium",      oddsHome: 2.10, oddsDraw: 3.10, oddsAway: 3.30, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "H2", stage: "Group", date: "2002-06-05", homeTeam: "Russia",       awayTeam: "Tunisia",      oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 5.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "H3", stage: "Group", date: "2002-06-09", homeTeam: "Japan",        awayTeam: "Russia",       oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "H4", stage: "Group", date: "2002-06-10", homeTeam: "Tunisia",      awayTeam: "Belgium",      oddsHome: 3.20, oddsDraw: 3.10, oddsAway: 2.20, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "H5", stage: "Group", date: "2002-06-14", homeTeam: "Belgium",      awayTeam: "Russia",       oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "H", scoreHome: 3, scoreAway: 2 },
  { id: "H6", stage: "Group", date: "2002-06-14", homeTeam: "Tunisia",      awayTeam: "Japan",        oddsHome: 4.00, oddsDraw: 3.30, oddsAway: 1.85, result: "A", scoreHome: 0, scoreAway: 2 },

  // ── Round of 16 ──────────────────────────────────────────────────────────
  { id: "R1", stage: "R16", date: "2002-06-15", homeTeam: "Germany",      awayTeam: "Paraguay",     oddsHome: 1.55, oddsDraw: 3.70, oddsAway: 6.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "R2", stage: "R16", date: "2002-06-15", homeTeam: "England",     awayTeam: "Denmark",      oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 5.00, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "R3", stage: "R16", date: "2002-06-16", homeTeam: "Sweden",      awayTeam: "Senegal",      oddsHome: 2.00, oddsDraw: 3.10, oddsAway: 3.60, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R4", stage: "R16", date: "2002-06-16", homeTeam: "Spain",       awayTeam: "Ireland",      oddsHome: 1.55, oddsDraw: 3.70, oddsAway: 6.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R5", stage: "R16", date: "2002-06-17", homeTeam: "Mexico",      awayTeam: "USA",          oddsHome: 2.00, oddsDraw: 3.10, oddsAway: 3.60, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "R6", stage: "R16", date: "2002-06-17", homeTeam: "Brazil",      awayTeam: "Belgium",      oddsHome: 1.35, oddsDraw: 4.20, oddsAway: 8.50, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "R7", stage: "R16", date: "2002-06-18", homeTeam: "Italy",       awayTeam: "South Korea",  oddsHome: 1.55, oddsDraw: 3.60, oddsAway: 6.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R8", stage: "R16", date: "2002-06-18", homeTeam: "Japan",       awayTeam: "Turkey",       oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Quarter-Finals ───────────────────────────────────────────────────────
  { id: "Q1", stage: "QF", date: "2002-06-21", homeTeam: "Brazil",      awayTeam: "England",      oddsHome: 1.90, oddsDraw: 3.20, oddsAway: 4.00, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "Q2", stage: "QF", date: "2002-06-21", homeTeam: "Germany",    awayTeam: "USA",          oddsHome: 1.45, oddsDraw: 3.90, oddsAway: 7.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "Q3", stage: "QF", date: "2002-06-22", homeTeam: "Spain",      awayTeam: "South Korea",  oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 5.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "Q4", stage: "QF", date: "2002-06-22", homeTeam: "Senegal",    awayTeam: "Turkey",       oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.70, result: "D", scoreHome: 0, scoreAway: 0 },

  // ── Semi-Finals ──────────────────────────────────────────────────────────
  { id: "S1", stage: "SF", date: "2002-06-25", homeTeam: "Germany",    awayTeam: "South Korea",  oddsHome: 1.50, oddsDraw: 3.80, oddsAway: 6.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "S2", stage: "SF", date: "2002-06-26", homeTeam: "Brazil",     awayTeam: "Turkey",       oddsHome: 1.45, oddsDraw: 3.90, oddsAway: 7.00, result: "H", scoreHome: 1, scoreAway: 0 },

  // ── Third Place ──────────────────────────────────────────────────────────
  { id: "T1", stage: "3rd", date: "2002-06-29", homeTeam: "South Korea", awayTeam: "Turkey",     oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.80, result: "A", scoreHome: 2, scoreAway: 3 },

  // ── Final ────────────────────────────────────────────────────────────────
  { id: "F1", stage: "Final", date: "2002-06-30", homeTeam: "Brazil",  awayTeam: "Germany",      oddsHome: 1.90, oddsDraw: 3.20, oddsAway: 4.00, result: "H", scoreHome: 2, scoreAway: 0 },
];
