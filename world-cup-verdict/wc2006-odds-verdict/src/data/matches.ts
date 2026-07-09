// WC2006 dataset — FIFA World Cup Germany 2006.
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
  { id: "A1", stage: "Group", date: "2006-06-09", homeTeam: "Germany",      awayTeam: "Costa Rica", oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 9.00, result: "H", scoreHome: 4, scoreAway: 2 },
  { id: "A2", stage: "Group", date: "2006-06-09", homeTeam: "Poland",       awayTeam: "Ecuador",   oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.20, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "A3", stage: "Group", date: "2006-06-14", homeTeam: "Germany",      awayTeam: "Poland",    oddsHome: 1.45, oddsDraw: 3.80, oddsAway: 7.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "A4", stage: "Group", date: "2006-06-15", homeTeam: "Costa Rica",   awayTeam: "Ecuador",   oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.50, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "A5", stage: "Group", date: "2006-06-20", homeTeam: "Ecuador",      awayTeam: "Germany",   oddsHome: 5.50, oddsDraw: 3.60, oddsAway: 1.55, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "A6", stage: "Group", date: "2006-06-20", homeTeam: "Costa Rica",   awayTeam: "Poland",    oddsHome: 2.60, oddsDraw: 3.10, oddsAway: 2.70, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Group B ──────────────────────────────────────────────────────────────
  { id: "B1", stage: "Group", date: "2006-06-10", homeTeam: "England",      awayTeam: "Paraguay",  oddsHome: 1.55, oddsDraw: 3.60, oddsAway: 6.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "B2", stage: "Group", date: "2006-06-10", homeTeam: "Trinidad & Tobago", awayTeam: "Sweden", oddsHome: 3.20, oddsDraw: 3.10, oddsAway: 2.20, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "B3", stage: "Group", date: "2006-06-15", homeTeam: "England",      awayTeam: "Trinidad & Tobago", oddsHome: 1.30, oddsDraw: 4.50, oddsAway: 9.50, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "B4", stage: "Group", date: "2006-06-15", homeTeam: "Sweden",       awayTeam: "Paraguay",  oddsHome: 1.60, oddsDraw: 3.50, oddsAway: 5.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "B5", stage: "Group", date: "2006-06-20", homeTeam: "Sweden",       awayTeam: "England",   oddsHome: 2.60, oddsDraw: 3.00, oddsAway: 2.70, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "B6", stage: "Group", date: "2006-06-20", homeTeam: "Paraguay",     awayTeam: "Trinidad & Tobago", oddsHome: 1.70, oddsDraw: 3.40, oddsAway: 4.80, result: "H", scoreHome: 2, scoreAway: 0 },

  // ── Group C ──────────────────────────────────────────────────────────────
  { id: "C1", stage: "Group", date: "2006-06-10", homeTeam: "Argentina",    awayTeam: "Ivory Coast", oddsHome: 1.60, oddsDraw: 3.50, oddsAway: 5.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "C2", stage: "Group", date: "2006-06-11", homeTeam: "Serbia & Montenegro", awayTeam: "Netherlands", oddsHome: 3.20, oddsDraw: 3.10, oddsAway: 2.20, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "C3", stage: "Group", date: "2006-06-16", homeTeam: "Argentina",    awayTeam: "Serbia & Montenegro", oddsHome: 1.25, oddsDraw: 5.00, oddsAway: 10.0, result: "H", scoreHome: 6, scoreAway: 0 },
  { id: "C4", stage: "Group", date: "2006-06-16", homeTeam: "Netherlands",  awayTeam: "Ivory Coast", oddsHome: 1.65, oddsDraw: 3.50, oddsAway: 5.20, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "C5", stage: "Group", date: "2006-06-21", homeTeam: "Netherlands",  awayTeam: "Argentina", oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.60, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "C6", stage: "Group", date: "2006-06-21", homeTeam: "Ivory Coast",  awayTeam: "Serbia & Montenegro", oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "H", scoreHome: 3, scoreAway: 2 },

  // ── Group D ──────────────────────────────────────────────────────────────
  { id: "D1", stage: "Group", date: "2006-06-11", homeTeam: "Mexico",       awayTeam: "Iran",      oddsHome: 1.55, oddsDraw: 3.60, oddsAway: 5.80, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "D2", stage: "Group", date: "2006-06-11", homeTeam: "Angola",       awayTeam: "Portugal",  oddsHome: 6.00, oddsDraw: 3.80, oddsAway: 1.50, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "D3", stage: "Group", date: "2006-06-16", homeTeam: "Mexico",       awayTeam: "Angola",    oddsHome: 1.45, oddsDraw: 3.80, oddsAway: 7.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "D4", stage: "Group", date: "2006-06-17", homeTeam: "Portugal",     awayTeam: "Iran",      oddsHome: 1.50, oddsDraw: 3.70, oddsAway: 6.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "D5", stage: "Group", date: "2006-06-21", homeTeam: "Portugal",     awayTeam: "Mexico",    oddsHome: 2.10, oddsDraw: 3.10, oddsAway: 3.40, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "D6", stage: "Group", date: "2006-06-21", homeTeam: "Iran",         awayTeam: "Angola",    oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "D", scoreHome: 1, scoreAway: 1 },

  // ── Group E ──────────────────────────────────────────────────────────────
  { id: "E1", stage: "Group", date: "2006-06-12", homeTeam: "Italy",        awayTeam: "Ghana",     oddsHome: 1.50, oddsDraw: 3.70, oddsAway: 6.50, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "E2", stage: "Group", date: "2006-06-12", homeTeam: "USA",          awayTeam: "Czech Republic", oddsHome: 2.80, oddsDraw: 3.00, oddsAway: 2.50, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "E3", stage: "Group", date: "2006-06-17", homeTeam: "Italy",        awayTeam: "USA",       oddsHome: 1.40, oddsDraw: 3.90, oddsAway: 8.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "E4", stage: "Group", date: "2006-06-17", homeTeam: "Czech Republic", awayTeam: "Ghana",   oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "E5", stage: "Group", date: "2006-06-22", homeTeam: "Italy",        awayTeam: "Czech Republic", oddsHome: 1.70, oddsDraw: 3.30, oddsAway: 4.80, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "E6", stage: "Group", date: "2006-06-22", homeTeam: "Ghana",        awayTeam: "USA",       oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Group F ──────────────────────────────────────────────────────────────
  { id: "F1", stage: "Group", date: "2006-06-13", homeTeam: "Brazil",       awayTeam: "Croatia",   oddsHome: 1.35, oddsDraw: 4.20, oddsAway: 8.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "F2", stage: "Group", date: "2006-06-12", homeTeam: "Australia",    awayTeam: "Japan",     oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "F3", stage: "Group", date: "2006-06-18", homeTeam: "Brazil",       awayTeam: "Australia", oddsHome: 1.35, oddsDraw: 4.20, oddsAway: 8.50, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "F4", stage: "Group", date: "2006-06-18", homeTeam: "Japan",        awayTeam: "Croatia",   oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.50, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "F5", stage: "Group", date: "2006-06-22", homeTeam: "Japan",        awayTeam: "Brazil",    oddsHome: 6.50, oddsDraw: 4.00, oddsAway: 1.45, result: "A", scoreHome: 1, scoreAway: 4 },
  { id: "F6", stage: "Group", date: "2006-06-22", homeTeam: "Croatia",      awayTeam: "Australia", oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "D", scoreHome: 2, scoreAway: 2 },

  // ── Group G ──────────────────────────────────────────────────────────────
  { id: "G1", stage: "Group", date: "2006-06-13", homeTeam: "South Korea",  awayTeam: "Togo",      oddsHome: 1.80, oddsDraw: 3.30, oddsAway: 4.20, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G2", stage: "Group", date: "2006-06-13", homeTeam: "France",       awayTeam: "Switzerland", oddsHome: 1.55, oddsDraw: 3.50, oddsAway: 5.80, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "G3", stage: "Group", date: "2006-06-18", homeTeam: "South Korea",  awayTeam: "France",    oddsHome: 3.60, oddsDraw: 3.20, oddsAway: 2.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "G4", stage: "Group", date: "2006-06-19", homeTeam: "Togo",         awayTeam: "Switzerland", oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.50, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "G5", stage: "Group", date: "2006-06-23", homeTeam: "Togo",         awayTeam: "France",    oddsHome: 6.50, oddsDraw: 4.00, oddsAway: 1.45, result: "A", scoreHome: 0, scoreAway: 2 },
  { id: "G6", stage: "Group", date: "2006-06-23", homeTeam: "Switzerland",  awayTeam: "South Korea", oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "H", scoreHome: 2, scoreAway: 0 },

  // ── Group H ──────────────────────────────────────────────────────────────
  { id: "H1", stage: "Group", date: "2006-06-14", homeTeam: "Spain",        awayTeam: "Ukraine",   oddsHome: 1.45, oddsDraw: 3.80, oddsAway: 7.50, result: "H", scoreHome: 4, scoreAway: 0 },
  { id: "H2", stage: "Group", date: "2006-06-14", homeTeam: "Tunisia",      awayTeam: "Saudi Arabia", oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "H3", stage: "Group", date: "2006-06-19", homeTeam: "Saudi Arabia", awayTeam: "Ukraine",   oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.50, result: "A", scoreHome: 0, scoreAway: 4 },
  { id: "H4", stage: "Group", date: "2006-06-19", homeTeam: "Spain",        awayTeam: "Tunisia",   oddsHome: 1.45, oddsDraw: 3.80, oddsAway: 7.50, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "H5", stage: "Group", date: "2006-06-23", homeTeam: "Saudi Arabia", awayTeam: "Spain",     oddsHome: 5.50, oddsDraw: 3.80, oddsAway: 1.55, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "H6", stage: "Group", date: "2006-06-23", homeTeam: "Tunisia",      awayTeam: "Ukraine",   oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.50, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Round of 16 ──────────────────────────────────────────────────────────
  { id: "R1", stage: "R16", date: "2006-06-24", homeTeam: "Germany",       awayTeam: "Sweden",    oddsHome: 1.55, oddsDraw: 3.50, oddsAway: 5.80, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "R2", stage: "R16", date: "2006-06-24", homeTeam: "Argentina",     awayTeam: "Mexico",    oddsHome: 1.65, oddsDraw: 3.50, oddsAway: 5.20, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "R3", stage: "R16", date: "2006-06-25", homeTeam: "England",       awayTeam: "Ecuador",   oddsHome: 1.55, oddsDraw: 3.50, oddsAway: 5.80, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "R4", stage: "R16", date: "2006-06-25", homeTeam: "Portugal",      awayTeam: "Netherlands", oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "R5", stage: "R16", date: "2006-06-26", homeTeam: "Italy",         awayTeam: "Australia", oddsHome: 1.50, oddsDraw: 3.70, oddsAway: 6.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "R6", stage: "R16", date: "2006-06-26", homeTeam: "Switzerland",   awayTeam: "Ukraine",   oddsHome: 2.20, oddsDraw: 3.10, oddsAway: 3.10, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "R7", stage: "R16", date: "2006-06-27", homeTeam: "Brazil",        awayTeam: "Ghana",     oddsHome: 1.30, oddsDraw: 4.50, oddsAway: 9.50, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "R8", stage: "R16", date: "2006-06-27", homeTeam: "Spain",         awayTeam: "France",    oddsHome: 2.30, oddsDraw: 3.10, oddsAway: 3.00, result: "A", scoreHome: 1, scoreAway: 3 },

  // ── Quarter-Finals ───────────────────────────────────────────────────────
  { id: "Q1", stage: "QF", date: "2006-06-30", homeTeam: "Germany",       awayTeam: "Argentina", oddsHome: 2.50, oddsDraw: 3.00, oddsAway: 2.80, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "Q2", stage: "QF", date: "2006-06-30", homeTeam: "Italy",         awayTeam: "Ukraine",   oddsHome: 1.50, oddsDraw: 3.70, oddsAway: 6.00, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "Q3", stage: "QF", date: "2006-07-01", homeTeam: "England",       awayTeam: "Portugal",  oddsHome: 2.30, oddsDraw: 3.00, oddsAway: 3.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "Q4", stage: "QF", date: "2006-07-01", homeTeam: "Brazil",        awayTeam: "France",    oddsHome: 1.80, oddsDraw: 3.20, oddsAway: 4.20, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Semi-Finals ──────────────────────────────────────────────────────────
  { id: "S1", stage: "SF", date: "2006-07-04", homeTeam: "Germany",       awayTeam: "Italy",     oddsHome: 2.40, oddsDraw: 3.00, oddsAway: 2.90, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "S2", stage: "SF", date: "2006-07-05", homeTeam: "Portugal",      awayTeam: "France",    oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.50, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Third Place ──────────────────────────────────────────────────────────
  { id: "T1", stage: "3rd", date: "2006-07-08", homeTeam: "Germany",      awayTeam: "Portugal",  oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 3.80, result: "H", scoreHome: 3, scoreAway: 1 },

  // ── Final ────────────────────────────────────────────────────────────────
  { id: "F1", stage: "Final", date: "2006-07-09", homeTeam: "Italy",      awayTeam: "France",    oddsHome: 2.40, oddsDraw: 3.00, oddsAway: 2.90, result: "D", scoreHome: 1, scoreAway: 1 },
];
