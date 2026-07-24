// Standalone analytics verifier for any WC odds-verdict app.
// Usage: node verify-tournament.mjs <app-dir>
// Reads <app-dir>/src/data/matches.ts, strips TS syntax, computes all metrics
// the narrative files depend on, and prints them.
import fs from "fs";
import path from "path";

const dir = process.argv[2];
if (!dir) { console.error("usage: node verify-tournament.mjs <app-dir>"); process.exit(1); }
const src = fs.readFileSync(path.join(dir, "src/data/matches.ts"), "utf8");

// Strip TS-only syntax to get runnable JS.
const js = src
  .replace(/import type[^\n]*\n/g, "")
  .replace(/export const matches:\s*Match\[\]\s*=/, "export const matches =")
  .replace(/:\s*Match\b/g, "");

const tmp = path.join(dir, "_matches.mjs");
fs.writeFileSync(tmp, js);
const { matches } = await import("file://" + path.resolve(tmp));
fs.unlinkSync(tmp);

// ── Analytics (reimplemented from src/lib/analytics.ts) ──────────────────────
const STAGE_ORDER = ["Group", "R32", "R16", "QF", "SF", "3rd", "Final"];
const CONFIDENCE = [
  { label: "33–40%", lo: 0.333, hi: 0.4 },
  { label: "40–50%", lo: 0.4, hi: 0.5 },
  { label: "50–60%", lo: 0.5, hi: 0.6 },
  { label: "60–70%", lo: 0.6, hi: 0.7 },
  { label: "70–80%", lo: 0.7, hi: 0.8 },
  { label: "80%+", lo: 0.8, hi: 1.001 },
];

function analyze(m) {
  const iH = 1 / m.oddsHome, iD = 1 / m.oddsDraw, iA = 1 / m.oddsAway;
  const over = iH + iD + iA;
  const pH = iH / over, pD = iD / over, pA = iA / over;
  const probs = { H: pH, D: pD, A: pA };
  const predicted = ["H","D","A"].reduce((b, r) => probs[r] > probs[b] ? r : b);
  const favoriteProb = Math.max(pH, pD, pA);
  const correct = predicted === m.result;
  return { m, probs, predicted, favoriteProb, correct };
}

const A = matches.slice().sort((a,b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)).map(analyze);
const n = A.length;
const correct = A.filter(a => a.correct).length;
const accuracy = correct / n;
const draws = A.filter(a => a.m.result === "D").length;
const upsets = A.filter(a => !a.correct && a.m.result !== "D").length;

console.log("\n════════ " + path.basename(dir) + " ════════");
console.log(`matches: ${n}`);
console.log(`accuracy: ${correct}/${n} = ${(accuracy*100).toFixed(1)}%`);
console.log(`draws: ${draws}  upsets (fav lost, non-draw): ${upsets}  correct(fav won): ${correct}`);

// By stage
console.log("\n── By stage ──");
for (const s of STAGE_ORDER) {
  const sub = A.filter(a => a.m.stage === s);
  if (!sub.length) continue;
  const c = sub.filter(a => a.correct).length;
  console.log(`  ${s.padEnd(7)} ${c}/${sub.length} = ${(c/sub.length*100).toFixed(0)}%`);
}

// By confidence bucket (favorite prob)
console.log("\n── By confidence bucket (favorite prob) ──");
for (const b of CONFIDENCE) {
  const sub = A.filter(a => a.favoriteProb >= b.lo && a.favoriteProb < b.hi);
  if (!sub.length) { console.log(`  ${b.label}: (none)`); continue; }
  const c = sub.filter(a => a.correct).length;
  console.log(`  ${b.label.padEnd(8)} ${c}/${sub.length} = ${(c/sub.length*100).toFixed(0)}%  (mean fav ${((sub.reduce((s,a)=>s+a.favoriteProb,0)/sub.length)*100).toFixed(0)}%)`);
}

// Favorite bias
const predMean = A.reduce((s,a)=>s+a.favoriteProb,0)/n;
const bias = accuracy - predMean;
console.log(`\nfavoriteBias: predicted ${(predMean*100).toFixed(1)}%  observed ${(accuracy*100).toFixed(1)}%  bias ${(bias>=0?"+":"")}${(bias*100).toFixed(1)}%`);

// ── Strategies (reimplemented from src/lib/strategies.ts) ───────────────────
const isKO = a => a.m.stage !== "Group";
const oddsFor = (m, r) => r === "H" ? m.oddsHome : r === "D" ? m.oddsDraw : m.oddsAway;
const fav = a => ({ outcome: a.predicted, odds: oddsFor(a.m, a.predicted) });

const STRATS = [
  ["always-fav", a => fav(a)],
  ["knockout-only", a => isKO(a) ? fav(a) : null],
  ["strong-fav", a => a.favoriteProb >= 0.5 ? fav(a) : null],
  ["heavy-fav", a => a.favoriteProb >= 0.6 ? fav(a) : null],
  ["skip-deadzone", a => (a.favoriteProb >= 0.4 && a.favoriteProb < 0.5) ? null : fav(a)],
  ["knockout-strong", a => (isKO(a) && a.favoriteProb >= 0.5) ? fav(a) : null],
  ["value-draw", a => (a.favoriteProb >= 0.4 && a.favoriteProb < 0.5) ? ({ outcome:"D", odds: a.m.oddsDraw }) : null],
];

console.log("\n── Strategies (bets / hit / ROI) ──");
for (const [id, decide] of STRATS) {
  let staked = 0, returned = 0, hit = 0, bets = 0;
  for (const a of A) {
    const bet = decide(a);
    if (!bet) continue;
    bets++; staked += 1;
    if (bet.outcome === a.m.result) { hit++; returned += bet.odds; }
  }
  const profit = returned - staked;
  const roi = staked ? profit / staked : 0;
  console.log(`  ${id.padEnd(17)} bets=${String(bets).padStart(2)} hit=${String(hit).padStart(2)} ROI=${(roi*100>=0?"+":"")}${(roi*100).toFixed(1)}%`);
}
