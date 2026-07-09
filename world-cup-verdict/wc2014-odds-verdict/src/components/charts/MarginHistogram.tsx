import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MatchAnalysis } from "@/lib/analytics";
import { CHART } from "@/lib/chartColors";
import { CustomTooltip } from "./CustomTooltip";

interface Props {
  analyses: MatchAnalysis[];
  meanMargin: number;
}

/** Distribution of bookmaker overround (margin %) across all matches. */
export function MarginHistogram({ analyses, meanMargin }: Props) {
  const bins = [
    { lo: 0.03, hi: 0.035, label: "3.0–3.5%" },
    { lo: 0.035, hi: 0.04, label: "3.5–4.0%" },
    { lo: 0.04, hi: 0.045, label: "4.0–4.5%" },
    { lo: 0.045, hi: 0.05, label: "4.5–5.0%" },
    { lo: 0.05, hi: 0.055, label: "5.0–5.5%" },
    { lo: 0.055, hi: 0.06, label: "5.5–6.0%" },
    { lo: 0.06, hi: 1, label: "6.0%+" },
  ];

  const chartData = bins.map((b) => ({
    label: b.label,
    count: analyses.filter((a) => a.margin >= b.lo && a.margin < b.hi).length,
    mid: (b.lo + b.hi) / 2,
  }));

  const meanMid = chartData.reduce((best, d) =>
    Math.abs(d.mid - meanMargin) < Math.abs(best.mid - meanMargin) ? d : best,
  chartData[0]).label;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: CHART.grid }} dy={8} interval={0} angle={-18} textAnchor="end" height={50} />
        <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART.grid }} />
        <Bar dataKey="count" name="Matches" radius={[2, 2, 0, 0]}>
          {chartData.map((d) => (
            <Cell key={d.label} fill={d.label === meanMid ? CHART.gold : CHART.pitchSoft} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
