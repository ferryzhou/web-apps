import { useMemo } from "react";
import { matches } from "@/data/matches";
import { analyzeStudy } from "@/lib/analytics";
import { backtestAll } from "@/lib/strategies";
import { Nav } from "@/components/Nav";
import { Overview } from "@/sections/Overview";
import { Methodology } from "@/sections/Methodology";
import { ResultsDashboard } from "@/sections/ResultsDashboard";
import { CalibrationLab } from "@/sections/CalibrationLab";
import { Strategies } from "@/sections/Strategies";
import { MatchLedger } from "@/sections/MatchLedger";
import { Footer } from "@/components/Footer";

export default function App() {
  const results = useMemo(() => analyzeStudy(matches), []);
  const strategyResults = useMemo(() => backtestAll(results.analyses), [results]);

  return (
    <div className="min-h-screen bg-parchment text-ink">
      <Nav />
      <main>
        <Overview results={results} />
        <Methodology />
        <ResultsDashboard results={results} />
        <CalibrationLab results={results} />
        <Strategies results={strategyResults} />
        <MatchLedger results={results} />
      </main>
      <Footer />
    </div>
  );
}
