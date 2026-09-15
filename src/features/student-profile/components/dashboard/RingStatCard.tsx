import { RadialProgress } from "@/components/shared/charts";

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
  const stroke = accent === "gold" ? "var(--color-gold)" : "var(--color-forest)";

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 flex items-center gap-4">
      <RadialProgress
        percent={percent}
        size={56}
        strokeWidth={5}
        color={stroke}
        trackColor="var(--color-paper-soft)"
      >
        <span className="text-xs font-display font-semibold text-ink">
          {Math.round(percent)}%
        </span>
      </RadialProgress>
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
