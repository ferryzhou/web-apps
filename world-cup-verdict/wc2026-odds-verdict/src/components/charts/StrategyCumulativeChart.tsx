import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { StrategyResult } from "@/lib/strategies";
import { CHART, CHART_FONT } from "@/lib/chartColors";

interface Props {
  results: StrategyResult[];
}

// Distinct line colours per strategy, tuned for the editorial palette.
const COLORS: Record<string, string> = {
  "always-fav": CHART.inkMuted,
  "knockout-only": CHART.pitch,
  "strong-fav": CHART.gold,
  "heavy-fav": "#8C6526",
  "skip-deadzone": CHART.pitchSoft,
  "knockout-strong": CHART.verdict,
  "value-draw": "#9A9081",
};

/** Multi-line cumulative profit (units) over bet index for every strategy. */
export function StrategyCumulativeChart({ results }: Props) {
  // Build a merged dataset keyed by bet index (1-based).
  const maxBets = Math.max(...results.map((r) => r.records.length));
  const data = Array.from({ length: maxBets }, (_, i) => {
    const row: Record<string, number> = { bet: i + 1 };
    for (const r of results) {
      const rec = r.records[i];
      if (rec) row[r.strategy.id] = +rec.cumulative.toFixed(2);
    }
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
        <CartesianGrid stroke={CHART.grid} strokeDasharray="2 3" vertical={false} />
        <XAxis
          dataKey="bet"
          stroke={CHART.inkMuted}
          tick={{ fill: CHART.inkMuted, fontSize: 11, fontFamily: CHART_FONT }}
          axisLine={{ stroke: CHART.grid }}
          tickLine={false}
          label={{
            value: "Bet number",
            position: "insideBottom",
            offset: -2,
            fill: CHART.inkMuted,
            fontSize: 11,
            fontFamily: CHART_FONT,
          }}
        />
        <YAxis
          stroke={CHART.inkMuted}
          tick={{ fill: CHART.inkMuted, fontSize: 11, fontFamily: CHART_FONT }}
          axisLine={{ stroke: CHART.grid }}
          tickLine={false}
          tickFormatter={(v) => `${v > 0 ? "+" : ""}${v}`}
          label={{
            value: "Cumulative profit (units)",
            angle: -90,
            position: "insideLeft",
            offset: 16,
            fill: CHART.inkMuted,
            fontSize: 11,
            fontFamily: CHART_FONT,
          }}
        />
        <ReferenceLine y={0} stroke={CHART.ink} strokeWidth={1} />
        <Legend
          wrapperStyle={{ fontSize: 11, fontFamily: CHART_FONT, paddingTop: 8 }}
          iconType="plainline"
          formatter={(value: string) => {
            const r = results.find((x) => x.strategy.id === value);
            return r ? r.strategy.name : value;
          }}
        />
        {results.map((r) => (
          <Line
            key={r.strategy.id}
            type="monotone"
            dataKey={r.strategy.id}
            stroke={COLORS[r.strategy.id] ?? CHART.ink}
            strokeWidth={r.strategy.id === "always-fav" ? 1.4 : 2.2}
            strokeDasharray={r.strategy.id === "always-fav" ? "4 3" : undefined}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
