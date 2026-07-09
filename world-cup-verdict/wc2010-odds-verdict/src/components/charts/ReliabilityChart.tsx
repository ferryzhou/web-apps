import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CalibrationBin } from "@/lib/analytics";
import { CHART } from "@/lib/chartColors";
import { CustomTooltip } from "./CustomTooltip";

interface Props {
  data: CalibrationBin[];
}

/** Reliability diagram: mean predicted favourite prob vs observed favourite-win freq. */
export function ReliabilityChart({ data }: Props) {
  const chartData = data
    .map((d) => ({
      label: d.binLabel,
      predicted: +(d.meanPredicted * 100).toFixed(1),
      observed: +(d.observedFreq * 100).toFixed(1),
      count: d.count,
    }))
    .sort((a, b) => a.predicted - b.predicted);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid stroke={CHART.grid} />
        <XAxis
          dataKey="predicted"
          type="number"
          domain={[0, 100]}
          tickLine={false}
          axisLine={{ stroke: CHART.grid }}
          dy={8}
          tickFormatter={(v) => `${v}%`}
          label={{ value: "predicted favourite prob.", fill: CHART.inkMuted, fontSize: 10, position: "insideBottom", offset: -2 }}
        />
        <YAxis
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          width={36}
          tickFormatter={(v) => `${v}%`}
          label={{ value: "observed win freq.", fill: CHART.inkMuted, fontSize: 10, angle: -90, position: "insideLeft" }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: CHART.grid }} />
        {/* Perfect-calibration diagonal (y = x at each bin midpoint). */}
        <Line
          dataKey="predicted"
          name="Perfect calibration"
          stroke={CHART.inkMuted}
          strokeWidth={1}
          strokeDasharray="5 5"
          dot={false}
          isAnimationActive={false}
        />
        {/* Observed reliability curve. */}
        <Line
          dataKey="observed"
          name="Observed"
          stroke={CHART.gold}
          strokeWidth={2.5}
          dot={{ r: 5, fill: CHART.gold, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
