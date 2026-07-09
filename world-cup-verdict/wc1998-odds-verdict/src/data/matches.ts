// WC1998 dataset — FIFA World Cup France 1998.
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
  { id: "A1", stage: "Group", date: "1998-06-10", homeTeam: "Brazil",   awayTeam: "Scotland", oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 9.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "A2", stage: "Group", date: "1998-06-10", homeTeam: "Morocco",  awayTeam: "Norway",   oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.60, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "A3", stage: "Group", date: "1998-06-16", homeTeam: "Scotland", awayTeam: "Norway",   oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.50, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "A4", stage: "Group", date: "1998-06-16", homeTeam: "Brazil",   awayTeam: "Morocco",  oddsHome: 1.25, oddsDraw: 5.50, oddsAway: 11.0, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "A5", stage: "Group", date: "1998-06-23", homeTeam: "Scotland", awayTeam: "Morocco",  oddsHome: 2.80, oddsDraw: 3.10, oddsAway: 2.50, result: "A", scoreHome: 0, scoreAway: 3 },
  { id: "A6", stage: "Group", date: "1998-06-23", homeTeam: "Brazil",   awayTeam: "Norway",   oddsHome: 1.40, oddsDraw: 4.50, oddsAway: 8.00, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Group B ──────────────────────────────────────────────────────────────
  { id: "B1", stage: "Group", date: "1998-06-11", homeTeam: "Italy",    awayTeam: "Chile",    oddsHome: 1.40, oddsDraw: 4.20, oddsAway: 8.00, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "B2", stage: "Group", date: "1998-06-11", homeTeam: "Cameroon", awayTeam: "Austria",  oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.80, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "B3", stage: "Group", date: "1998-06-17", homeTeam: "Chile",    awayTeam: "Austria",  oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "B4", stage: "Group", date: "1998-06-17", homeTeam: "Italy",    awayTeam: "Cameroon", oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 9.00, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "B5", stage: "Group", date: "1998-06-23", homeTeam: "Italy",    awayTeam: "Austria",  oddsHome: 1.33, oddsDraw: 4.50, oddsAway: 9.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "B6", stage: "Group", date: "1998-06-23", homeTeam: "Chile",    awayTeam: "Cameroon", oddsHome: 1.95, oddsDraw: 3.30, oddsAway: 4.00, result: "D", scoreHome: 1, scoreAway: 1 },

  // ── Group C ──────────────────────────────────────────────────────────────
  { id: "C1", stage: "Group", date: "1998-06-12", homeTeam: "France",       awayTeam: "South Africa", oddsHome: 1.35, oddsDraw: 5.00, oddsAway: 9.00, result: "H", scoreHome: 3, scoreAway: 0 },
  { id: "C2", stage: "Group", date: "1998-06-12", homeTeam: "Saudi Arabia", awayTeam: "Denmark",     oddsHome: 3.50, oddsDraw: 3.20, oddsAway: 2.05, result: "A", scoreHome: 0, scoreAway: 1 },
  { id: "C3", stage: "Group", date: "1998-06-18", homeTeam: "France",       awayTeam: "Saudi Arabia", oddsHome: 1.22, oddsDraw: 5.50, oddsAway: 13.0, result: "H", scoreHome: 4, scoreAway: 0 },
  { id: "C4", stage: "Group", date: "1998-06-18", homeTeam: "Denmark",      awayTeam: "South Africa", oddsHome: 1.95, oddsDraw: 3.20, oddsAway: 4.00, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "C5", stage: "Group", date: "1998-06-24", homeTeam: "France",       awayTeam: "Denmark",     oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "C6", stage: "Group", date: "1998-06-24", homeTeam: "South Africa", awayTeam: "Saudi Arabia", oddsHome: 1.75, oddsDraw: 3.40, oddsAway: 5.00, result: "D", scoreHome: 2, scoreAway: 2 },

  // ── Group D ──────────────────────────────────────────────────────────────
  { id: "D1", stage: "Group", date: "1998-06-13", homeTeam: "Spain",    awayTeam: "Nigeria",   oddsHome: 1.40, oddsDraw: 4.20, oddsAway: 8.00, result: "A", scoreHome: 2, scoreAway: 3 },
  { id: "D2", stage: "Group", date: "1998-06-13", homeTeam: "Bulgaria", awayTeam: "Paraguay",  oddsHome: 2.10, oddsDraw: 3.20, oddsAway: 3.40, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "D3", stage: "Group", date: "1998-06-19", homeTeam: "Nigeria",  awayTeam: "Bulgaria",  oddsHome: 2.00, oddsDraw: 3.30, oddsAway: 3.80, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "D4", stage: "Group", date: "1998-06-19", homeTeam: "Spain",    awayTeam: "Paraguay",  oddsHome: 1.45, oddsDraw: 4.00, oddsAway: 7.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "D5", stage: "Group", date: "1998-06-24", homeTeam: "Paraguay", awayTeam: "Nigeria",   oddsHome: 2.40, oddsDraw: 3.10, oddsAway: 2.90, result: "H", scoreHome: 3, scoreAway: 1 },
  { id: "D6", stage: "Group", date: "1998-06-24", homeTeam: "Spain",    awayTeam: "Bulgaria",  oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.50, result: "H", scoreHome: 6, scoreAway: 1 },

  // ── Group E ──────────────────────────────────────────────────────────────
  { id: "E1", stage: "Group", date: "1998-06-14", homeTeam: "Netherlands", awayTeam: "Belgium",    oddsHome: 1.55, oddsDraw: 3.70, oddsAway: 6.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "E2", stage: "Group", date: "1998-06-14", homeTeam: "South Korea", awayTeam: "Mexico",     oddsHome: 2.70, oddsDraw: 3.10, oddsAway: 2.50, result: "A", scoreHome: 1, scoreAway: 3 },
  { id: "E3", stage: "Group", date: "1998-06-20", homeTeam: "Netherlands", awayTeam: "South Korea",oddsHome: 1.25, oddsDraw: 5.50, oddsAway: 11.0, result: "H", scoreHome: 5, scoreAway: 0 },
  { id: "E4", stage: "Group", date: "1998-06-20", homeTeam: "Belgium",     awayTeam: "Mexico",     oddsHome: 2.10, oddsDraw: 3.20, oddsAway: 3.40, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "E5", stage: "Group", date: "1998-06-25", homeTeam: "Netherlands", awayTeam: "Mexico",     oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.50, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "E6", stage: "Group", date: "1998-06-25", homeTeam: "Belgium",     awayTeam: "South Korea",oddsHome: 1.75, oddsDraw: 3.40, oddsAway: 5.00, result: "D", scoreHome: 1, scoreAway: 1 },

  // ── Group F ──────────────────────────────────────────────────────────────
  { id: "F1", stage: "Group", date: "1998-06-15", homeTeam: "Germany",   awayTeam: "USA",       oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 9.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "F2", stage: "Group", date: "1998-06-15", homeTeam: "Yugoslavia",awayTeam: "Iran",      oddsHome: 1.45, oddsDraw: 4.00, oddsAway: 7.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "F3", stage: "Group", date: "1998-06-21", homeTeam: "Germany",   awayTeam: "Yugoslavia",oddsHome: 2.00, oddsDraw: 3.30, oddsAway: 3.60, result: "D", scoreHome: 2, scoreAway: 2 },
  { id: "F4", stage: "Group", date: "1998-06-21", homeTeam: "USA",       awayTeam: "Iran",      oddsHome: 1.90, oddsDraw: 3.20, oddsAway: 4.20, result: "A", scoreHome: 1, scoreAway: 2 },
  { id: "F5", stage: "Group", date: "1998-06-25", homeTeam: "Germany",   awayTeam: "Iran",      oddsHome: 1.30, oddsDraw: 4.80, oddsAway: 10.0, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "F6", stage: "Group", date: "1998-06-25", homeTeam: "USA",       awayTeam: "Yugoslavia",oddsHome: 3.30, oddsDraw: 3.20, oddsAway: 2.10, result: "A", scoreHome: 0, scoreAway: 1 },

  // ── Group G ──────────────────────────────────────────────────────────────
  { id: "G1", stage: "Group", date: "1998-06-15", homeTeam: "England",  awayTeam: "Tunisia",  oddsHome: 1.45, oddsDraw: 4.00, oddsAway: 7.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "G2", stage: "Group", date: "1998-06-15", homeTeam: "Romania",  awayTeam: "Colombia", oddsHome: 2.20, oddsDraw: 3.20, oddsAway: 3.20, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "G3", stage: "Group", date: "1998-06-22", homeTeam: "Romania",  awayTeam: "England",  oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.70, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "G4", stage: "Group", date: "1998-06-22", homeTeam: "Colombia", awayTeam: "Tunisia",  oddsHome: 1.75, oddsDraw: 3.40, oddsAway: 5.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "G5", stage: "Group", date: "1998-06-26", homeTeam: "England",  awayTeam: "Colombia", oddsHome: 1.75, oddsDraw: 3.40, oddsAway: 5.00, result: "H", scoreHome: 2, scoreAway: 0 },
  { id: "G6", stage: "Group", date: "1998-06-26", homeTeam: "Romania",  awayTeam: "Tunisia",  oddsHome: 1.75, oddsDraw: 3.40, oddsAway: 5.00, result: "D", scoreHome: 1, scoreAway: 1 },

  // ── Group H ──────────────────────────────────────────────────────────────
  { id: "H1", stage: "Group", date: "1998-06-14", homeTeam: "Argentina", awayTeam: "Japan",  oddsHome: 1.35, oddsDraw: 4.50, oddsAway: 8.50, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "H2", stage: "Group", date: "1998-06-14", homeTeam: "Jamaica",   awayTeam: "Croatia",oddsHome: 3.30, oddsDraw: 3.20, oddsAway: 2.10, result: "A", scoreHome: 1, scoreAway: 3 },
  { id: "H3", stage: "Group", date: "1998-06-20", homeTeam: "Argentina", awayTeam: "Jamaica", oddsHome: 1.22, oddsDraw: 5.50, oddsAway: 13.0, result: "H", scoreHome: 5, scoreAway: 0 },
  { id: "H4", stage: "Group", date: "1998-06-20", homeTeam: "Croatia",   awayTeam: "Japan",   oddsHome: 1.75, oddsDraw: 3.40, oddsAway: 5.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "H5", stage: "Group", date: "1998-06-26", homeTeam: "Argentina", awayTeam: "Croatia", oddsHome: 1.85, oddsDraw: 3.30, oddsAway: 4.20, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "H6", stage: "Group", date: "1998-06-26", homeTeam: "Jamaica",   awayTeam: "Japan",   oddsHome: 2.50, oddsDraw: 3.10, oddsAway: 2.70, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Round of 16 ──────────────────────────────────────────────────────────
  { id: "R1", stage: "R16", date: "1998-06-27", homeTeam: "Italy",        awayTeam: "Norway",      oddsHome: 1.55, oddsDraw: 3.80, oddsAway: 6.00, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "R2", stage: "R16", date: "1998-06-27", homeTeam: "Brazil",       awayTeam: "Chile",       oddsHome: 1.30, oddsDraw: 4.80, oddsAway: 10.0, result: "H", scoreHome: 4, scoreAway: 1 },
  { id: "R3", stage: "R16", date: "1998-06-28", homeTeam: "Paraguay",     awayTeam: "France",      oddsHome: 5.00, oddsDraw: 3.30, oddsAway: 1.80, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "R4", stage: "R16", date: "1998-06-28", homeTeam: "Denmark",      awayTeam: "Nigeria",     oddsHome: 2.40, oddsDraw: 3.20, oddsAway: 3.00, result: "H", scoreHome: 4, scoreAway: 1 },
  { id: "R5", stage: "R16", date: "1998-06-29", homeTeam: "Germany",      awayTeam: "Mexico",      oddsHome: 1.60, oddsDraw: 3.70, oddsAway: 5.50, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "R6", stage: "R16", date: "1998-06-29", homeTeam: "Netherlands",  awayTeam: "Yugoslavia",  oddsHome: 1.75, oddsDraw: 3.40, oddsAway: 5.00, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "R7", stage: "R16", date: "1998-06-30", homeTeam: "Croatia",      awayTeam: "Romania",     oddsHome: 2.10, oddsDraw: 3.20, oddsAway: 3.40, result: "H", scoreHome: 1, scoreAway: 0 },
  { id: "R8", stage: "R16", date: "1998-06-30", homeTeam: "Argentina",    awayTeam: "England",     oddsHome: 2.60, oddsDraw: 3.00, oddsAway: 2.70, result: "D", scoreHome: 2, scoreAway: 2 },

  // ── Quarter-Finals ───────────────────────────────────────────────────────
  { id: "Q1", stage: "QF", date: "1998-07-03", homeTeam: "Brazil",       awayTeam: "Denmark",    oddsHome: 1.50, oddsDraw: 4.00, oddsAway: 6.50, result: "H", scoreHome: 3, scoreAway: 2 },
  { id: "Q2", stage: "QF", date: "1998-07-03", homeTeam: "France",       awayTeam: "Italy",      oddsHome: 2.40, oddsDraw: 3.00, oddsAway: 3.00, result: "D", scoreHome: 0, scoreAway: 0 },
  { id: "Q3", stage: "QF", date: "1998-07-04", homeTeam: "Netherlands",  awayTeam: "Argentina",  oddsHome: 2.10, oddsDraw: 3.10, oddsAway: 3.40, result: "H", scoreHome: 2, scoreAway: 1 },
  { id: "Q4", stage: "QF", date: "1998-07-04", homeTeam: "Germany",      awayTeam: "Croatia",    oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 4.20, result: "A", scoreHome: 0, scoreAway: 3 },

  // ── Semi-Finals ──────────────────────────────────────────────────────────
  { id: "S1", stage: "SF", date: "1998-07-07", homeTeam: "Brazil",       awayTeam: "Netherlands",oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.60, result: "D", scoreHome: 1, scoreAway: 1 },
  { id: "S2", stage: "SF", date: "1998-07-08", homeTeam: "France",       awayTeam: "Croatia",    oddsHome: 2.00, oddsDraw: 3.20, oddsAway: 3.60, result: "H", scoreHome: 2, scoreAway: 1 },

  // ── Third Place ──────────────────────────────────────────────────────────
  { id: "T1", stage: "3rd", date: "1998-07-11", homeTeam: "Netherlands", awayTeam: "Croatia", oddsHome: 1.90, oddsDraw: 3.30, oddsAway: 4.20, result: "A", scoreHome: 1, scoreAway: 2 },

  // ── Final ────────────────────────────────────────────────────────────────
  { id: "F1", stage: "Final", date: "1998-07-12", homeTeam: "France",    awayTeam: "Brazil",  oddsHome: 2.70, oddsDraw: 3.00, oddsAway: 2.50, result: "H", scoreHome: 3, scoreAway: 0 },
];
