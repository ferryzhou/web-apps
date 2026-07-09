import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CumulativePoint } from "@/lib/analytics";
import { CHART } from "@/lib/chartColors";
import { CustomTooltip } from "./CustomTooltip";

interface Props {
  data: CumulativePoint[];
  finalAccuracy: number;
}

/** Running accuracy as matches accumulate, with a reference line at the final value. */
export function CumulativeChart({ data, finalAccuracy }: Props) {
  const chartData = data.map((d) => ({
    label: `#${d.index}`,
    idx: d.index,
    accuracy: +(d.accuracy * 100).toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
        <defs>
          <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART.gold} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CHART.gold} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis
          dataKey="idx"
          tickLine={false}
          axisLine={{ stroke: CHART.grid }}
          dy={8}
          tickFormatter={(v) => (v % 10 === 0 || v === 1 || v === data.length ? `#${v}` : "")}
        />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          width={36}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: CHART.grid }} />
        <ReferenceLine
          y={+(finalAccuracy * 100).toFixed(1)}
          stroke={CHART.verdict}
          strokeDasharray="4 4"
          label={{ value: "final", fill: CHART.verdict, fontSize: 10, position: "right" }}
        />
        <Area
          type="monotone"
          dataKey="accuracy"
          name="Running accuracy"
          stroke={CHART.gold}
          strokeWidth={2}
          fill="url(#accGrad)"
          dot={false}
          activeDot={{ r: 3, fill: CHART.gold }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
