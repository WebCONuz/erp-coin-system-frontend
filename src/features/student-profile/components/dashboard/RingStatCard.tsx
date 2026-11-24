import { RadialProgress } from "@/components/shared/charts";

interface Props {
  label: string;
  sublabel: string;
  value: string;
  percent: number;
  /** Halqa rangi: davomat — success, uy vazifa — coin. */
  accent?: "forest" | "gold";
}

export const RingStatCard = ({
  label,
  sublabel,
  value,
  percent,
  accent = "forest",
}: Props) => {
  const stroke = accent === "gold" ? "var(--coin)" : "var(--success)";

  return (
    <div className="flex h-full items-center gap-4 rounded-2xl border bg-card p-4 sm:p-5">
      <RadialProgress
        percent={percent}
        size={56}
        strokeWidth={5}
        color={stroke}
        trackColor="var(--muted)"
      >
        <span className="text-xs font-semibold tabular-nums">
          {Math.round(percent)}%
        </span>
      </RadialProgress>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>
        <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
};
