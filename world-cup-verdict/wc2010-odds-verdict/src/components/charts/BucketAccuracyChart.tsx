import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BucketBreakdown } from "@/lib/analytics";
import { CHART } from "@/lib/chartColors";
import { CustomTooltip } from "./CustomTooltip";

interface Props {
  data: BucketBreakdown[];
}

/** Observed favourite-win rate vs mean predicted favourite probability, per bucket. */
export function BucketAccuracyChart({ data }: Props) {
  const chartData = data.map((d) => ({
    label: d.label,
    observed: +(d.accuracy * 100).toFixed(1),
    predicted: +(d.meanFavoriteProb * 100).toFixed(1),
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }} barGap={2}>
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
        <Legend
          wrapperStyle={{ fontFamily: CHART_INK, fontSize: 11, paddingTop: 8 }}
          iconType="square"
          iconSize={9}
        />
        <ReferenceLine y={50} stroke={CHART.inkMuted} strokeDasharray="2 4" />
        <Bar dataKey="predicted" name="Predicted (fav. prob)" fill={CHART.gold} radius={[2, 2, 0, 0]} />
        <Bar dataKey="observed" name="Observed (fav. won)" fill={CHART.pitch} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const CHART_INK = '"JetBrains Mono", monospace';
