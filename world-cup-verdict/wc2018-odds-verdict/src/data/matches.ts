// WC2018 dataset — FIFA World Cup Russia 2018.
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
  { id: "A1", stage: "Group", date: "2018-06-14", homeTeam: "Russia",      awayTeam: "Saudi Arabia", oddsHome: 1.90, oddsDraw: 3.60, oddsAway: 4.00, result: "H", scoreHome: 5, scoreAway: 0 },
  { id: "A2", stage: "Group", date: "2018-06-15", homeTeam: "Egypt",       awayTeam: "Uruguay",     oddsHome: 3.40, oddsDraw: 3.10, oddsAway: 2.20, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "A3", stage: "Group", date: "2018-06-19", homeTeam: "Russia",      awayTeam: "Egypt",       oddsHome: 2.20, oddsDraw: 3.20, oddsAway: 3.10, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "A4", stage: "Group", date: "2018-06-20", homeTeam: "Uruguay",     awayTeam: "Saudi Arabia",oddsHome: 1.50, oddsDraw: 3.80, oddsAway: 6.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "A5", stage: "Group", date: "2018-06-25", homeTeam: "Uruguay",     awayTeam: "Russia",      oddsHome: 2.10, oddsDraw: 3.10, oddsAway: 3.40, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "A6", stage: "Group", date: "2018-06-25", homeTeam: "Saudi Arabia",awayTeam: "Egypt",       oddsHome: 2.60, oddsDraw: 3.20, oddsAway: 2.70, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Group B ──────────────────────────────────────────────────────────────
  { id: "B1", stage: "Group", date: "2018-06-15", homeTeam: "Morocco",     awayTeam: "Iran",        oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.70, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "B2", stage: "Group", date: "2018-06-15", homeTeam: "Portugal",    awayTeam: "Spain",       oddsHome: 2.80, oddsDraw: 3.30, oddsAway: 2.50, result: "D", scoreHome: 3, scoreAway: 3 },
  { id: "B3", stage: "Group", date: "2018-06-20", homeTeam: "Portugal",    awayTeam: "Morocco",     oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 6.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "B4", stage: "Group", date: "2018-06-20", homeTeam: "Iran",        awayTeam: "Spain",       oddsHome: 4.50, oddsDraw: 3.40, oddsAway: 1.85, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "B5", stage: "Group", date: "2018-06-25", homeTeam: "Iran",        awayTeam: "Portugal",    oddsHome: 4.50, oddsDraw: 3.30, oddsAway: 1.85, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "B6", stage: "Group", date: "2018-06-25", homeTeam: "Spain",       awayTeam: "Morocco",     oddsHome: 1.40, oddsDraw: 4.30, oddsAway: 8.00, result: "D", scoreHome: 2, scoreAway: 2 },

  // ── Group C ──────────────────────────────────────────────────────────────
  { id: "C1", stage: "Group", date: "2018-06-16", homeTeam: "France",      awayTeam: "Australia",   oddsHome: 1.40, oddsDraw: 4.20, oddsAway: 7.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "C2", stage: "Group", date: "2018-06-16", homeTeam: "Peru",        awayTeam: "Denmark",     oddsHome: 3.00, oddsDraw: 3.10, oddsAway: 2.35, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "C3", stage: "Group", date: "2018-06-21", homeTeam: "Denmark",     awayTeam: "Australia",   oddsHome: 1.95, oddsDraw: 3.30, oddsAway: 3.80, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "C4", stage: "Group", date: "2018-06-21", homeTeam: "France",      awayTeam: "Peru",        oddsHome: 1.45, oddsDraw: 3.90, oddsAway: 7.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "C5", stage: "Group", date: "2018-06-26", homeTeam: "Australia",   awayTeam: "Peru",        oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.70, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "C6", stage: "Group", date: "2018-06-26", homeTeam: "Denmark",     awayTeam: "France",      oddsHome: 3.40, oddsDraw: 3.10, oddsAway: 2.10, result: "D", scoreHome: 0, scoreAway: 0 },

  // ── Group D ──────────────────────────────────────────────────────────────
  { id: "D1", stage: "Group", date: "2018-06-16", homeTeam: "Argentina",   awayTeam: "Iceland",     oddsHome: 1.30, oddsDraw: 4.80, oddsAway: 9.50, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "D2", stage: "Group", date: "2018-06-16", homeTeam: "Croatia",     awayTeam: "Nigeria",     oddsHome: 1.80, oddsDraw: 3.40, oddsAway: 4.20, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "D3", stage: "Group", date: "2018-06-21", homeTeam: "Argentina",   awayTeam: "Croatia",     oddsHome: 2.20, oddsDraw: 3.20, oddsAway: 3.20, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "D4", stage: "Group", date: "2018-06-22", homeTeam: "Nigeria",     awayTeam: "Iceland",     oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.20, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "D5", stage: "Group", date: "2018-06-26", homeTeam: "Iceland",     awayTeam: "Croatia",     oddsHome: 3.40, oddsDraw: 3.20, oddsAway: 2.10, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "D6", stage: "Group", date: "2018-06-26", homeTeam: "Nigeria",     awayTeam: "Argentina",   oddsHome: 3.20, oddsDraw: 3.20, oddsAway: 2.20, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Group E ──────────────────────────────────────────────────────────────
  { id: "E1", stage: "Group", date: "2018-06-17", homeTeam: "Costa Rica",  awayTeam: "Serbia",      oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.60, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "E2", stage: "Group", date: "2018-06-17", homeTeam: "Brazil",      awayTeam: "Switzerland", oddsHome: 1.40, oddsDraw: 4.20, oddsAway: 8.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "E3", stage: "Group", date: "2018-06-22", homeTeam: "Brazil",      awayTeam: "Costa Rica",  oddsHome: 1.30, oddsDraw: 5.00, oddsAway: 10.0, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "E4", stage: "Group", date: "2018-06-22", homeTeam: "Serbia",      awayTeam: "Switzerland", oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.80, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "E5", stage: "Group", date: "2018-06-27", homeTeam: "Serbia",      awayTeam: "Brazil",      oddsHome: 5.50, oddsDraw: 3.80, oddsAway: 1.55, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "E6", stage: "Group", date: "2018-06-27", homeTeam: "Switzerland", awayTeam: "Costa Rica",  oddsHome: 1.80, oddsDraw: 3.50, oddsAway: 4.20, result: "D", scoreHome: 2, scoreAway: 2 },

  // ── Group F ──────────────────────────────────────────────────────────────
  { id: "F1", stage: "Group", date: "2018-06-17", homeTeam: "Germany",     awayTeam: "Mexico",      oddsHome: 1.45, oddsDraw: 4.20, oddsAway: 7.00, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "F2", stage: "Group", date: "2018-06-18", homeTeam: "Sweden",      awayTeam: "South Korea", oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.70, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "F3", stage: "Group", date: "2018-06-23", homeTeam: "South Korea", awayTeam: "Mexico",      oddsHome: 3.40, oddsDraw: 3.20, oddsAway: 2.10, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "F4", stage: "Group", date: "2018-06-23", homeTeam: "Germany",     awayTeam: "Sweden",      oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "F5", stage: "Group", date: "2018-06-27", homeTeam: "South Korea", awayTeam: "Germany",     oddsHome: 6.50, oddsDraw: 4.20, oddsAway: 1.45, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "F6", stage: "Group", date: "2018-06-27", homeTeam: "Mexico",      awayTeam: "Sweden",      oddsHome: 2.30, oddsDraw: 3.20, oddsAway: 3.10, result: "A", scoreHome: 0, scoreAway: 3 },

  // ── Group G ──────────────────────────────────────────────────────────────
  { id: "G1", stage: "Group", date: "2018-06-18", homeTeam: "Belgium",     awayTeam: "Panama",      oddsHome: 1.30, oddsDraw: 5.00, oddsAway: 10.0, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "G2", stage: "Group", date: "2018-06-18", homeTeam: "Tunisia",     awayTeam: "England",     oddsHome: 4.50, oddsDraw: 3.40, oddsAway: 1.85, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "G3", stage: "Group", date: "2018-06-23", homeTeam: "Belgium",     awayTeam: "Tunisia",     oddsHome: 1.45, oddsDraw: 4.30, oddsAway: 7.00, result: "H", scoreHome: 5, scoreAway: 2 },
  { id: "G4", stage: "Group", date: "2018-06-24", homeTeam: "England",     awayTeam: "Panama",      oddsHome: 1.30, oddsDraw: 5.00, oddsAway: 10.0, result: "H", scoreHome: 6, scoreAway: 1 },
  { id: "G5", stage: "Group", date: "2018-06-28", homeTeam: "England",     awayTeam: "Belgium",     oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.60, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "G6", stage: "Group", date: "2018-06-28", homeTeam: "Panama",      awayTeam: "Tunisia",     oddsHome: 2.70, oddsDraw: 3.20, oddsAway: 2.60, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Group H ──────────────────────────────────────────────────────────────
  { id: "H1", stage: "Group", date: "2018-06-19", homeTeam: "Colombia",    awayTeam: "Japan",       oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.70, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "H2", stage: "Group", date: "2018-06-19", homeTeam: "Poland",      awayTeam: "Senegal",     oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.20, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "H3", stage: "Group", date: "2018-06-24", homeTeam: "Japan",       awayTeam: "Senegal",     oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.60, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "H4", stage: "Group", date: "2018-06-24", homeTeam: "Poland",      awayTeam: "Colombia",    oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.80, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "H5", stage: "Group", date: "2018-06-28", homeTeam: "Senegal",     awayTeam: "Colombia",    oddsHome: 3.40, oddsDraw: 3.20, oddsAway: 2.10, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "H6", stage: "Group", date: "2018-06-28", homeTeam: "Japan",       awayTeam: "Poland",      oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.20, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Round of 16 ──────────────────────────────────────────────────────────
  { id: "R1", stage: "R16", date: "2018-06-30", homeTeam: "France",       awayTeam: "Argentina",  oddsHome: 1.90, oddsDraw: 3.40, oddsAway: 4.00, result: "H", scoreHome: 4, scoreAway: 3 },
  { id: "R2", stage: "R16", date: "2018-06-30", homeTeam: "Uruguay",      awayTeam: "Portugal",   oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.70, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "R3", stage: "R16", date: "2018-07-01", homeTeam: "Spain",        awayTeam: "Russia",     oddsHome: 1.95, oddsDraw: 3.30, oddsAway: 3.80, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R4", stage: "R16", date: "2018-07-01", homeTeam: "Croatia",      awayTeam: "Denmark",    oddsHome: 1.95, oddsDraw: 3.30, oddsAway: 3.80, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R5", stage: "R16", date: "2018-07-02", homeTeam: "Brazil",       awayTeam: "Mexico",     oddsHome: 1.50, oddsDraw: 3.90, oddsAway: 6.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "R6", stage: "R16", date: "2018-07-02", homeTeam: "Belgium",      awayTeam: "Japan",      oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 5.80, result: "H", scoreHome: 3, scoreAway: 2 },
  { id: "R7", stage: "R16", date: "2018-07-03", homeTeam: "Sweden",       awayTeam: "Switzerland",oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.80, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "R8", stage: "R16", date: "2018-07-03", homeTeam: "Colombia",     awayTeam: "England",    oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.90, result: "D", scoreHome: 1, scoreAway: 1 },

  // ── Quarter-Finals ───────────────────────────────────────────────────────
  { id: "Q1", stage: "QF", date: "2018-07-06", homeTeam: "France",       awayTeam: "Uruguay",    oddsHome: 1.85, oddsDraw: 3.30, oddsAway: 4.20, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "Q2", stage: "QF", date: "2018-07-06", homeTeam: "Brazil",       awayTeam: "Belgium",    oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 4.00, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "Q3", stage: "QF", date: "2018-07-07", homeTeam: "Russia",       awayTeam: "Croatia",    oddsHome: 3.40, oddsDraw: 3.20, oddsAway: 2.10, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "Q4", stage: "QF", date: "2018-07-07", homeTeam: "Sweden",       awayTeam: "England",    oddsHome: 3.20, oddsDraw: 3.10, oddsAway: 2.20, result: "A", scoreHome: 0, scoreAway: 2 },

  // ── Semi-Finals ──────────────────────────────────────────────────────────
  { id: "S1", stage: "SF", date: "2018-07-10", homeTeam: "France",       awayTeam: "Belgium",    oddsHome: 2.40, oddsDraw: 3.00, oddsAway: 3.10, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "S2", stage: "SF", date: "2018-07-11", homeTeam: "Croatia",      awayTeam: "England",    oddsHome: 2.90, oddsDraw: 3.00, oddsAway: 2.50, result: "D", scoreHome: 1, scoreAway: 1 },

  // ── Third Place ──────────────────────────────────────────────────────────
  { id: "T1", stage: "3rd", date: "2018-07-14", homeTeam: "Belgium",      awayTeam: "England",    oddsHome: 1.95, oddsDraw: 3.40, oddsAway: 3.80, result: "H", scoreHome: 2, scoreAway: 0 },

  // ── Final ────────────────────────────────────────────────────────────────
  { id: "F1", stage: "Final", date: "2018-07-15", homeTeam: "France",     awayTeam: "Croatia",    oddsHome: 2.20, oddsDraw: 3.30, oddsAway: 3.20, result: "H", scoreHome: 4, scoreAway: 2 },
];
