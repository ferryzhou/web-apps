import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search, X } from "lucide-react";
import type { MatchAnalysis, StudyResults } from "@/lib/analytics";
import { resultLabel } from "@/lib/analytics";
import type { Stage } from "@/data/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/utils";

interface Props {
  results: StudyResults;
}

type SortKey = "date" | "favProb" | "brier" | "logLoss";
type SortDir = "asc" | "desc";
type CorrectnessFilter = "All" | "Correct" | "Upset";

const STAGES: (Stage | "All")[] = ["All", "Group", "R32", "R16", "SF", "3rd", "Final"];

export function MatchLedger({ results }: Props) {
  const { analyses } = results;

  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | "All">("All");
  const [correctness, setCorrectness] = useState<CorrectnessFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = analyses.filter((a) => {
      const teams = `${a.match.homeTeam} ${a.match.awayTeam}`.toLowerCase();
      if (q && !teams.includes(q)) return false;
      if (stage !== "All" && a.match.stage !== stage) return false;
      if (correctness === "Correct" && !a.correct) return false;
      if (correctness === "Upset" && a.correct) return false;
      return true;
    });
    rows = rows.slice().sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp = a.match.date.localeCompare(b.match.date) || a.match.id.localeCompare(b.match.id);
          break;
        case "favProb":
          cmp = a.favoriteProb - b.favoriteProb;
          break;
        case "brier":
          cmp = a.brier - b.brier;
          break;
        case "logLoss":
          cmp = a.logLoss - b.logLoss;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [analyses, query, stage, correctness, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "asc" : "desc");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setStage("All");
    setCorrectness("All");
  };
  const hasFilters = query !== "" || stage !== "All" || correctness !== "All";

  return (
    <Section
      id="ledger"
      alt
      kicker="Match ledger"
      title={
        <>
          Every call, on the <span className="italic text-gold-deep">record</span>.
        </>
      }
      intro="The full evidence. Filter by team or stage, sort by any metric, and inspect the per-match forecast that produced every aggregate above. Green = the favourite won; crimson = an upset."
    >
      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-3 border border-ink/15 bg-parchment p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams…"
              className="w-full border border-ink/20 bg-parchment-alt py-2 pl-9 pr-3 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none"
            />
          </div>

          <SegGroup<Stage | "All">
            value={stage}
            onChange={(v) => setStage(v)}
            options={STAGES.map((s) => ({ value: s, label: s === "All" ? "All stages" : stageLabelShort(s) }))}
          />

          <SegGroup<CorrectnessFilter>
            value={correctness}
            onChange={(v) => setCorrectness(v)}
            options={[
              { value: "All", label: "All" },
              { value: "Correct", label: "Correct" },
              { value: "Upset", label: "Upsets" },
            ]}
          />

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 border border-ink/20 px-2.5 py-2 text-xs uppercase tracking-kicker text-ink-muted transition-colors hover:border-ink/40 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}

          <div className="ml-auto tnum text-xs uppercase tracking-kicker text-ink-muted">
            {filtered.length} / {analyses.length} matches
          </div>
        </div>
      </Reveal>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <div className="mt-4 overflow-x-auto border border-ink/15 bg-parchment scroll-thin">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/15 bg-parchment-alt">
                <Th>#</Th>
                <Th>Stage</Th>
                <Th>Date</Th>
                <Th>Match</Th>
                <Th className="text-right">Odds (H/D/A)</Th>
                <SortableTh label="Fav. prob" sortKey="favProb" current={sortKey} dir={sortDir} onClick={toggleSort} align="right" />
                <Th>Pred.</Th>
                <Th>Result</Th>
                <Th className="text-right">Score</Th>
                <SortableTh label="Brier" sortKey="brier" current={sortKey} dir={sortDir} onClick={toggleSort} align="right" />
                <SortableTh label="Log loss" sortKey="logLoss" current={sortKey} dir={sortDir} onClick={toggleSort} align="right" />
                <Th className="text-center">Verdict</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <Row key={a.match.id} a={a} zebra={i % 2 === 1} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-sm text-ink-muted">
                    No matches match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}

function stageLabelShort(s: Stage): string {
  return s === "Group" ? "Groups" : s;
}

function Row({ a, zebra }: { a: MatchAnalysis; zebra: boolean }) {
  const predLabel = a.predicted === "H" ? "Home" : a.predicted === "D" ? "Draw" : "Away";
  const resultLetter = a.match.result;
  return (
    <tr className={cn("border-b border-ink/8 transition-colors hover:bg-parchment-alt", zebra && "bg-parchment-alt/50")}>
      <Td className="tnum text-ink-muted">{a.match.id}</Td>
      <Td className="text-ink-muted">{a.match.stage}</Td>
      <Td className="tnum text-ink-muted">{a.match.date.slice(5)}</Td>
      <Td>
        <span className="font-medium text-ink">{a.match.homeTeam}</span>
        <span className="mx-1.5 text-ink-faint">v</span>
        <span className="font-medium text-ink">{a.match.awayTeam}</span>
      </Td>
      <Td className="tnum text-right text-ink-soft">
        {a.match.oddsHome.toFixed(2)} / {a.match.oddsDraw.toFixed(2)} / {a.match.oddsAway.toFixed(2)}
      </Td>
      <Td className="tnum text-right font-semibold text-gold-deep">{(a.favoriteProb * 100).toFixed(0)}%</Td>
      <Td className="text-ink-soft">{predLabel}</Td>
      <Td className="text-ink">{resultLabel(resultLetter as "H" | "D" | "A")}</Td>
      <Td className="tnum text-right text-ink-soft">{a.match.scoreHome}–{a.match.scoreAway}</Td>
      <Td className="tnum text-right text-ink-soft">{a.brier.toFixed(3)}</Td>
      <Td className="tnum text-right text-ink-soft">{a.logLoss.toFixed(3)}</Td>
      <Td className="text-center">
        <Pill tone={a.correct ? "correct" : "incorrect"}>{a.correct ? "Hit" : "Miss"}</Pill>
      </Td>
    </tr>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("kicker px-3 py-3 text-[0.62rem] font-semibold", className)}>
      {children}
    </th>
  );
}

function SortableTh({
  label,
  sortKey,
  current,
  dir,
  onClick,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === current;
  return (
    <th className={cn("kicker px-3 py-3 text-[0.62rem] font-semibold", align === "right" ? "text-right" : "text-left")}>
      <button
        onClick={() => onClick(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-ink",
          active ? "text-ink" : "text-ink-muted",
          align === "right" && "flex-row-reverse",
        )}
      >
        {label}
        {active ? (
          dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-50" />
        )}
      </button>
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-3 py-2.5 text-sm", className)}>{children}</td>;
}

function SegGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex border border-ink/20">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "px-3 py-2 text-xs uppercase tracking-kicker transition-colors",
            value === o.value
              ? "bg-ink text-parchment"
              : "bg-parchment text-ink-muted hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
