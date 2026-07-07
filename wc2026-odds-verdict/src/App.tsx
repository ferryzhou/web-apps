import { useMemo } from "react";
import { matches } from "@/data/matches";
import { analyzeStudy } from "@/lib/analytics";
import { Nav } from "@/components/Nav";
import { Overview } from "@/sections/Overview";
import { Methodology } from "@/sections/Methodology";
import { ResultsDashboard } from "@/sections/ResultsDashboard";
import { CalibrationLab } from "@/sections/CalibrationLab";
import { MatchLedger } from "@/sections/MatchLedger";
import { Footer } from "@/components/Footer";

export default function App() {
  const results = useMemo(() => analyzeStudy(matches), []);

  return (
    <div className="min-h-screen bg-parchment text-ink">
      <Nav />
      <main>
        <Overview results={results} />
        <Methodology />
        <ResultsDashboard results={results} />
        <CalibrationLab results={results} />
        <MatchLedger results={results} />
      </main>
      <Footer />
    </div>
  );
}
