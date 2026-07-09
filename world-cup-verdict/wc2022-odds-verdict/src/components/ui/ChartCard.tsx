import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface ChartCardProps {
  kicker: string;
  title: string;
  caption?: ReactNode;
  children: ReactNode;
  delay?: number;
}

/** Framed chart panel with kicker / title / caption — editorial plate style. */
export function ChartCard({ kicker, title, caption, children, delay = 0 }: ChartCardProps) {
  return (
    <Reveal delay={delay}>
      <figure className="flex h-full flex-col border border-ink/15 bg-parchment">
        <figcaption className="border-b border-ink/15 bg-parchment-alt px-6 py-4">
          <div className="kicker">{kicker}</div>
          <h4 className="mt-1 font-display text-lg font-medium text-ink">{title}</h4>
        </figcaption>
        <div className="flex-1 p-4 md:p-6">{children}</div>
        {caption && (
          <p className="border-t border-ink/12 px-6 py-3 text-xs leading-relaxed text-ink-muted">
            {caption}
          </p>
        )}
      </figure>
    </Reveal>
  );
}
