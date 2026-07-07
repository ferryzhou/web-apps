import { useEffect, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

const LINKS: { id: string; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "methodology", label: "Methodology" },
  { id: "results", label: "Results" },
  { id: "calibration", label: "Calibration" },
  { id: "ledger", label: "Match Ledger" },
];

export function Nav() {
  const active = useActiveSection(LINKS.map((l) => l.id));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-parchment/90 backdrop-blur-sm border-b border-ink/12" : "bg-transparent"
      }`}
    >
      <div className="container max-w-read flex h-16 items-center justify-between">
        <a href="#overview" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-tightest text-ink">
            The Verdict
          </span>
          <span className="hidden text-[0.62rem] uppercase tracking-kicker text-ink-muted sm:inline">
            WC2026
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`px-3 py-1.5 text-sm transition-colors ${
                active === l.id
                  ? "text-ink"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <span className="relative">
                {l.label}
                {active === l.id && (
                  <span className="absolute -bottom-1 left-0 h-px w-full bg-gold" />
                )}
              </span>
            </a>
          ))}
        </nav>

        <button
          className="border border-ink/20 px-3 py-1.5 text-xs uppercase tracking-kicker text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/12 bg-parchment md:hidden">
          <div className="container max-w-read flex flex-col py-2">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`border-b border-ink/8 py-2.5 text-sm last:border-b-0 ${
                  active === l.id ? "text-ink" : "text-ink-muted"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
