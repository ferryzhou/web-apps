import type { TooltipProps } from "recharts";
import { CHART } from "@/lib/chartColors";

interface Row {
  label: string;
  value: string;
  color: string;
}

/** Editorial dark tooltip: gold label, parchment rows, mono numerals. */
export function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const rows: Row[] = payload.map((p) => ({
    label: String(p.name ?? ""),
    value: typeof p.value === "number" ? p.value.toFixed(p.value >= 100 ? 0 : 2) : String(p.value),
    color: String(p.color ?? CHART.gold),
  }));
  return (
    <div className="border border-gold/40 bg-ink px-3 py-2 shadow-lg">
      {label !== undefined && label !== "" && (
        <div className="mb-1 font-mono text-[0.7rem] uppercase tracking-wider text-gold-soft">
          {label}
        </div>
      )}
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2 font-mono text-[0.72rem] text-parchment">
          <span className="inline-block h-2 w-2" style={{ background: r.color }} />
          <span className="text-parchment/70">{r.label}:</span>
          <span className="font-semibold text-parchment">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
