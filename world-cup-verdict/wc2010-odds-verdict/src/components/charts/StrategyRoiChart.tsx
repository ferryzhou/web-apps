import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  LabelList,
  Tooltip,
} from "recharts";
import type { StrategyResult } from "@/lib/strategies";
import { CHART, CHART_FONT } from "@/lib/chartColors";
import { CustomTooltip } from "./CustomTooltip";

interface Props {
  results: StrategyResult[];
}

/** Horizontal bar chart of ROI per strategy, sorted best → worst. */
export function StrategyRoiChart({ results }: Props) {
  const data = [...results]
    .map((r) => ({
      name: r.strategy.name,
      roi: +(r.roi * 100).toFixed(1),
      id: r.strategy.id,
    }))
    .sort((a, b) => b.roi - a.roi);

  return (
    <ResponsiveContainer width="100%" height={Math.max(260, data.length * 44)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 56, bottom: 4, left: 8 }}
        barCategoryGap={6}
      >
        <XAxis
          type="number"
          tickFormatter={(v) => `${v}%`}
          stroke={CHART.inkMuted}
          tick={{ fill: CHART.inkMuted, fontSize: 11, fontFamily: CHART_FONT }}
          axisLine={{ stroke: CHART.grid }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={170}
          stroke={CHART.inkMuted}
          tick={{ fill: CHART.ink, fontSize: 11.5, fontFamily: CHART_FONT }}
          axisLine={{ stroke: CHART.grid }}
          tickLine={false}
        />
        <ReferenceLine x={0} stroke={CHART.ink} strokeWidth={1} />
        <Bar dataKey="roi" radius={0} maxBarSize={26}>
          {data.map((d) => (
            <Cell key={d.id} fill={d.roi >= 0 ? CHART.pitch : CHART.verdict} />
          ))}
          <LabelList
            dataKey="roi"
            position="right"
            formatter={(v: number) => `${v >= 0 ? "+" : ""}${v}%`}
            style={{
              fill: CHART.ink,
              fontSize: 11,
              fontFamily: CHART_FONT,
              fontWeight: 600,
            }}
          />
        </Bar>
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: CHART.grid }}
          formatter={(v: number) => [`${v >= 0 ? "+" : ""}${v}%`, "ROI"]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
