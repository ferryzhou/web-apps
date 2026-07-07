interface PillProps {
  tone: "correct" | "incorrect" | "neutral";
  children: React.ReactNode;
}

const TONES: Record<PillProps["tone"], string> = {
  correct: "bg-pitch/12 text-pitch-deep border-pitch/30",
  incorrect: "bg-verdict/12 text-verdict-deep border-verdict/30",
  neutral: "bg-ink/8 text-ink-soft border-ink/20",
};

export function Pill({ tone, children }: PillProps) {
  return (
    <span
      className={`tnum inline-flex items-center border px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
