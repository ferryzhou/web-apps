import type { ReactNode } from "react";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

interface StatCardProps {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** One-line plain-English interpretation. */
  hint: string;
  /** Accent: "gold" | "pitch" | "verdict" | "ink" */
  accent?: "gold" | "pitch" | "verdict" | "ink";
  delay?: number;
}

const ACCENT_BAR: Record<NonNullable<StatCardProps["accent"]>, string> = {
  gold: "bg-gold",
  pitch: "bg-pitch",
  verdict: "bg-verdict",
  ink: "bg-ink",
};

const ACCENT_TEXT: Record<NonNullable<StatCardProps["accent"]>, string> = {
  gold: "text-gold",
  pitch: "text-pitch",
  verdict: "text-verdict",
  ink: "text-ink",
};

/** Headline metric card with animated count-up + hairline border + accent bar. */
export function StatCard({
  label,
  value,
  decimals = 0,
  prefix,
  suffix,
  hint,
  accent = "gold",
  delay = 0,
}: StatCardProps) {
  return (
    <Reveal delay={delay}>
      <div className="group relative h-full border border-ink/15 bg-parchment p-6 transition-colors duration-300 hover:border-ink/35">
        <span className={`absolute left-0 top-0 h-full w-[3px] ${ACCENT_BAR[accent]}`} />
        <div className="kicker">{label}</div>
        <div className={`mt-4 font-display text-5xl font-semibold leading-none tracking-tightest ${ACCENT_TEXT[accent]}`}>
          <CountUp value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        </div>
        <p className="mt-4 text-sm leading-snug text-ink-muted">{hint}</p>
      </div>
    </Reveal>
  );
}

export type { StatCardProps };
export function StatCardShell({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <Reveal delay={delay}><div className="h-full border border-ink/15 bg-parchment p-6">{children}</div></Reveal>;
}
