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
import type { HistogramBin } from "@/lib/analytics";
import { CHART } from "@/lib/chartColors";
import { CustomTooltip } from "./CustomTooltip";

interface Props {
  data: HistogramBin[];
  meanBrier: number;
}

/** Histogram of per-match Brier scores (0 = perfect, higher = worse). */
export function BrierHistogram({ data, meanBrier }: Props) {
  const chartData = data.map((d) => ({
    label: d.binLabel,
    count: d.count,
  }));
  // Mean brier (~0.0–0.7) mapped onto the categorical axis position for a ref line.
  const meanBucketIndex = Math.min(
    data.length - 1,
    Math.max(0, Math.floor(meanBrier * 10)),
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: CHART.grid }} dy={8} />
        <YAxis tickLine={false} axisLine={false} width={28} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART.grid }} />
        <ReferenceLine
          x={chartData[meanBucketIndex]?.label}
          stroke={CHART.verdict}
          strokeDasharray="4 4"
          label={{ value: "mean", fill: CHART.verdict, fontSize: 10, position: "top" }}
        />
        <Bar dataKey="count" name="Matches" radius={[2, 2, 0, 0]}>
          {chartData.map((d, i) => (
            <Cell key={i} fill={i === meanBucketIndex ? CHART.verdict : CHART.inkSoft} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
