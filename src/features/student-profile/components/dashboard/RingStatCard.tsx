interface Props {
  label: string;
  sublabel: string;
  value: string;
  percent: number;
  accent?: "forest" | "gold";
}

export const RingStatCard = ({
  label,
  sublabel,
  value,
  percent,
  accent = "forest",
}: Props) => {
  const R = 18;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const filled = CIRCUMFERENCE * (Math.min(Math.max(percent, 0), 100) / 100);
  const stroke = accent === "gold" ? "var(--color-gold)" : "var(--color-forest)";

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 flex items-center gap-4">
      <div className="relative w-14 h-14 shrink-0">
        <svg width="56" height="56" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke="var(--color-paper-soft)"
            strokeWidth="5"
          />
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke={stroke}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
            transform="rotate(-90 24 24)"
            style={{ transition: "stroke-dasharray 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-display font-semibold text-ink">
          {Math.round(percent)}%
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-soft mt-0.5">{sublabel}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: stroke }}>
          {value}
        </p>
      </div>
    </div>
  );
};
