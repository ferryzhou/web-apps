import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { StageBreakdown } from "@/lib/analytics";
import { CHART } from "@/lib/chartColors";
import { CustomTooltip } from "./CustomTooltip";

interface Props {
  data: StageBreakdown[];
  overallAccuracy: number;
}

const SHORT: Record<string, string> = {
  "Group Stage": "Group",
  "Round of 32": "R32",
  "Round of 16": "R16",
  "Quarter-Final": "QF",
  "Semi-Final": "SF",
  "3rd Place": "3rd",
  Final: "Final",
};

export function StageAccuracyChart({ data, overallAccuracy }: Props) {
  const chartData = data.map((d) => ({
    label: SHORT[d.label] ?? d.label,
    accuracy: +(d.accuracy * 100).toFixed(1),
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: CHART.grid }} dy={8} />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          width={36}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART.grid }} />
        <ReferenceLine
          y={+(overallAccuracy * 100).toFixed(1)}
          stroke={CHART.verdict}
          strokeDasharray="4 4"
          label={{ value: "avg", fill: CHART.verdict, fontSize: 10, position: "right" }}
        />
        <Bar dataKey="accuracy" name="Accuracy" fill={CHART.gold} radius={[2, 2, 0, 0]}>
          {chartData.map((d, i) => (
            <Cell key={i} fill={d.accuracy >= overallAccuracy * 100 ? CHART.pitch : CHART.gold} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
