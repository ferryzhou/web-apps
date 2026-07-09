// WC2010 dataset — FIFA World Cup South Africa 2010.
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
  { id: "A1", stage: "Group", date: "2010-06-11", homeTeam: "South Africa", awayTeam: "Mexico",   oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.60, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "A2", stage: "Group", date: "2010-06-11", homeTeam: "Uruguay",      awayTeam: "France",   oddsHome: 2.30, oddsDraw: 3.00, oddsAway: 3.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "A3", stage: "Group", date: "2010-06-16", homeTeam: "South Africa", awayTeam: "Uruguay",  oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "A4", stage: "Group", date: "2010-06-17", homeTeam: "France",       awayTeam: "Mexico",   oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "A5", stage: "Group", date: "2010-06-22", homeTeam: "Mexico",       awayTeam: "Uruguay",  oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.70, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "A6", stage: "Group", date: "2010-06-22", homeTeam: "France",       awayTeam: "South Africa", oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 4.00, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Group B ──────────────────────────────────────────────────────────────
  { id: "B1", stage: "Group", date: "2010-06-12", homeTeam: "South Korea",  awayTeam: "Greece",   oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "B2", stage: "Group", date: "2010-06-12", homeTeam: "Argentina",    awayTeam: "Nigeria",  oddsHome: 1.40, oddsDraw: 4.20, oddsAway: 7.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "B3", stage: "Group", date: "2010-06-17", homeTeam: "Greece",       awayTeam: "Nigeria",  oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.60, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "B4", stage: "Group", date: "2010-06-17", homeTeam: "Argentina",    awayTeam: "South Korea", oddsHome: 1.45, oddsDraw: 3.90, oddsAway: 7.00, result: "H", scoreHome: 4, scoreAway: 1 },
  { id: "B5", stage: "Group", date: "2010-06-22", homeTeam: "Nigeria",      awayTeam: "South Korea", oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "B6", stage: "Group", date: "2010-06-22", homeTeam: "Greece",       awayTeam: "Argentina",oddsHome: 6.50, oddsDraw: 4.00, oddsAway: 1.45, result: "A", scoreHome: 0, scoreAway: 2 },

  // ── Group C ──────────────────────────────────────────────────────────────
  { id: "C1", stage: "Group", date: "2010-06-12", homeTeam: "England",      awayTeam: "USA",      oddsHome: 1.70, oddsDraw: 3.50, oddsAway: 5.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "C2", stage: "Group", date: "2010-06-13", homeTeam: "Algeria",      awayTeam: "Slovenia", oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.70, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "C3", stage: "Group", date: "2010-06-18", homeTeam: "USA",          awayTeam: "Slovenia", oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "C4", stage: "Group", date: "2010-06-18", homeTeam: "England",      awayTeam: "Algeria",  oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 6.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "C5", stage: "Group", date: "2010-06-23", homeTeam: "Slovenia",     awayTeam: "England",  oddsHome: 3.20, oddsDraw: 3.20, oddsAway: 2.10, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "C6", stage: "Group", date: "2010-06-23", homeTeam: "USA",          awayTeam: "Algeria",  oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 5.00, result: "H", scoreHome: 1, scoreAway: 0 },

  // ── Group D ──────────────────────────────────────────────────────────────
  { id: "D1", stage: "Group", date: "2010-06-13", homeTeam: "Germany",      awayTeam: "Australia",oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 8.50, result: "H", scoreHome: 4, scoreAway: 0 },
  { id: "D2", stage: "Group", date: "2010-06-13", homeTeam: "Serbia",       awayTeam: "Ghana",    oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.60, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "D3", stage: "Group", date: "2010-06-18", homeTeam: "Germany",      awayTeam: "Serbia",   oddsHome: 1.40, oddsDraw: 4.20, oddsAway: 7.50, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "D4", stage: "Group", date: "2010-06-19", homeTeam: "Ghana",        awayTeam: "Australia",oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "D5", stage: "Group", date: "2010-06-23", homeTeam: "Australia",    awayTeam: "Serbia",   oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.60, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "D6", stage: "Group", date: "2010-06-23", homeTeam: "Ghana",        awayTeam: "Germany",  oddsHome: 3.20, oddsDraw: 3.20, oddsAway: 2.10, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Group E ──────────────────────────────────────────────────────────────
  { id: "E1", stage: "Group", date: "2010-06-14", homeTeam: "Netherlands",  awayTeam: "Denmark",  oddsHome: 1.50, oddsDraw: 3.80, oddsAway: 6.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "E2", stage: "Group", date: "2010-06-14", homeTeam: "Japan",        awayTeam: "Cameroon", oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.60, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "E3", stage: "Group", date: "2010-06-19", homeTeam: "Netherlands",  awayTeam: "Japan",    oddsHome: 1.55, oddsDraw: 3.70, oddsAway: 5.80, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "E4", stage: "Group", date: "2010-06-19", homeTeam: "Cameroon",     awayTeam: "Denmark",  oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.60, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "E5", stage: "Group", date: "2010-06-24", homeTeam: "Denmark",      awayTeam: "Japan",    oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "A", scoreHome: 1, scoreAway: 3 },
  { id: "E6", stage: "Group", date: "2010-06-24", homeTeam: "Cameroon",     awayTeam: "Netherlands", oddsHome: 6.50, oddsDraw: 4.00, oddsAway: 1.45, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Group F ──────────────────────────────────────────────────────────────
  { id: "F1", stage: "Group", date: "2010-06-14", homeTeam: "Italy",        awayTeam: "Paraguay", oddsHome: 1.60, oddsDraw: 3.50, oddsAway: 5.50, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "F2", stage: "Group", date: "2010-06-15", homeTeam: "New Zealand",  awayTeam: "Slovakia", oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.60, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "F3", stage: "Group", date: "2010-06-20", homeTeam: "Slovakia",     awayTeam: "Paraguay", oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.60, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "F4", stage: "Group", date: "2010-06-20", homeTeam: "Italy",        awayTeam: "New Zealand", oddsHome: 1.25, oddsDraw: 5.00, oddsAway: 10.0, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "F5", stage: "Group", date: "2010-06-24", homeTeam: "Paraguay",     awayTeam: "New Zealand", oddsHome: 1.60, oddsDraw: 3.60, oddsAway: 5.50, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "F6", stage: "Group", date: "2010-06-24", homeTeam: "Slovakia",     awayTeam: "Italy",    oddsHome: 3.20, oddsDraw: 3.20, oddsAway: 2.10, result: "H", scoreHome: 3, scoreAway: 2 },

  // ── Group G ──────────────────────────────────────────────────────────────
  { id: "G1", stage: "Group", date: "2010-06-15", homeTeam: "Ivory Coast",  awayTeam: "Portugal", oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "G2", stage: "Group", date: "2010-06-15", homeTeam: "Brazil",       awayTeam: "North Korea", oddsHome: 1.20, oddsDraw: 6.00, oddsAway: 15.0, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G3", stage: "Group", date: "2010-06-20", homeTeam: "Brazil",       awayTeam: "Ivory Coast", oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 8.50, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "G4", stage: "Group", date: "2010-06-21", homeTeam: "Portugal",     awayTeam: "North Korea", oddsHome: 1.25, oddsDraw: 5.50, oddsAway: 10.0, result: "H", scoreHome: 7, scoreAway: 0 },
  { id: "G5", stage: "Group", date: "2010-06-25", homeTeam: "Portugal",     awayTeam: "Brazil",   oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.80, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "G6", stage: "Group", date: "2010-06-25", homeTeam: "North Korea",  awayTeam: "Ivory Coast", oddsHome: 3.50, oddsDraw: 3.20, oddsAway: 2.00, result: "A", scoreHome: 0, scoreAway: 3 },

  // ── Group H ──────────────────────────────────────────────────────────────
  { id: "H1", stage: "Group", date: "2010-06-16", homeTeam: "Honduras",     awayTeam: "Chile",    oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.60, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "H2", stage: "Group", date: "2010-06-16", homeTeam: "Spain",        awayTeam: "Switzerland", oddsHome: 1.30, oddsDraw: 4.50, oddsAway: 9.50, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "H3", stage: "Group", date: "2010-06-21", homeTeam: "Chile",        awayTeam: "Switzerland", oddsHome: 2.10, oddsDraw: 3.20, oddsAway: 3.40, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "H4", stage: "Group", date: "2010-06-21", homeTeam: "Spain",        awayTeam: "Honduras", oddsHome: 1.25, oddsDraw: 5.50, oddsAway: 10.0, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "H5", stage: "Group", date: "2010-06-25", homeTeam: "Chile",        awayTeam: "Spain",    oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.60, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "H6", stage: "Group", date: "2010-06-25", homeTeam: "Switzerland",  awayTeam: "Honduras", oddsHome: 1.80, oddsDraw: 3.30, oddsAway: 4.20, result: "D", scoreHome: 0, scoreAway: 0 },

  // ── Round of 16 ──────────────────────────────────────────────────────────
  { id: "R1", stage: "R16", date: "2010-06-26", homeTeam: "Uruguay",       awayTeam: "South Korea", oddsHome: 2.10, oddsDraw: 3.10, oddsAway: 3.40, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "R2", stage: "R16", date: "2010-06-26", homeTeam: "USA",           awayTeam: "Ghana",    oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.80, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R3", stage: "R16", date: "2010-06-27", homeTeam: "Germany",       awayTeam: "England",  oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.20, result: "H", scoreHome: 4, scoreAway: 1 },
  { id: "R4", stage: "R16", date: "2010-06-27", homeTeam: "Argentina",     awayTeam: "Mexico",   oddsHome: 1.65, oddsDraw: 3.60, oddsAway: 5.50, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "R5", stage: "R16", date: "2010-06-28", homeTeam: "Netherlands",   awayTeam: "Slovakia", oddsHome: 1.40, oddsDraw: 4.30, oddsAway: 7.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "R6", stage: "R16", date: "2010-06-28", homeTeam: "Brazil",        awayTeam: "Chile",    oddsHome: 1.55, oddsDraw: 3.70, oddsAway: 6.00, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "R7", stage: "R16", date: "2010-06-29", homeTeam: "Paraguay",      awayTeam: "Japan",    oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.70, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "R8", stage: "R16", date: "2010-06-29", homeTeam: "Spain",         awayTeam: "Portugal", oddsHome: 1.85, oddsDraw: 3.30, oddsAway: 4.20, result: "H", scoreHome: 1, scoreAway: 0 },

  // ── Quarter-Finals ───────────────────────────────────────────────────────
  { id: "Q1", stage: "QF", date: "2010-07-02", homeTeam: "Netherlands",   awayTeam: "Brazil",   oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "Q2", stage: "QF", date: "2010-07-02", homeTeam: "Uruguay",       awayTeam: "Ghana",    oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "Q3", stage: "QF", date: "2010-07-03", homeTeam: "Argentina",     awayTeam: "Germany",  oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.60, result: "A", scoreHome: 0, scoreAway: 4 },
  { id: "Q4", stage: "QF", date: "2010-07-03", homeTeam: "Paraguay",      awayTeam: "Spain",    oddsHome: 3.60, oddsDraw: 3.20, oddsAway: 2.00, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Semi-Finals ──────────────────────────────────────────────────────────
  { id: "S1", stage: "SF", date: "2010-07-06", homeTeam: "Uruguay",       awayTeam: "Netherlands", oddsHome: 2.10, oddsDraw: 3.10, oddsAway: 3.40, result: "A", scoreHome: 2, scoreAway: 3 },
  { id: "S2", stage: "SF", date: "2010-07-07", homeTeam: "Germany",       awayTeam: "Spain",    oddsHome: 2.60, oddsDraw: 3.00, oddsAway: 2.70, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Third Place ──────────────────────────────────────────────────────────
  { id: "T1", stage: "3rd", date: "2010-07-10", homeTeam: "Uruguay",      awayTeam: "Germany",  oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.60, result: "A", scoreHome: 2, scoreAway: 3 },

  // ── Final ────────────────────────────────────────────────────────────────
  { id: "F1", stage: "Final", date: "2010-07-11", homeTeam: "Netherlands", awayTeam: "Spain",   oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.50, result: "D", scoreHome: 0, scoreAway: 0 },
];
