import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  /** Use the darker "paper-alt" band for this section. */
  alt?: boolean;
}

/** Editorial section wrapper: kicker + hairline + display title + optional intro. */
export function Section({ id, kicker, title, intro, children, alt = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-20 md:py-28 ${alt ? "bg-parchment-alt" : "bg-parchment"}`}
    >
      <div className="container max-w-read">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="kicker shrink-0">{kicker}</span>
            <span className="h-px flex-1 bg-ink/15" />
          </div>
          <h2 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tightest text-ink md:text-5xl">
            {title}
          </h2>
          {intro && (
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-muted">
              {intro}
            </p>
          )}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
