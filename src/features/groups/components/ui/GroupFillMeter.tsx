import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface Props {
  count: number;
  max: number;
  className?: string;
  /** `lg` — tafsilot sahifasi sarlavhasida. */
  size?: "sm" | "lg";
}

/** Guruh to'lganligi: son + chiziq. 80% dan oshsa ogohlantirish, to'lsa xavf rangi. */
export const GroupFillMeter = ({ count, max, className, size = "sm" }: Props) => {
  const { t } = useTranslation();
  const percent = max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0;
  const isFull = max > 0 && count >= max;
  const tone = isFull
    ? "bg-destructive"
    : percent >= 80
      ? "bg-warning"
      : "bg-success";
  const spots = Math.max(0, max - count);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span
          className={cn(
            "tabular-nums",
            size === "lg" ? "font-heading text-lg font-semibold" : "font-medium",
          )}
        >
          {count}
          <span className="text-muted-foreground">/{max}</span>
        </span>
        <span
          className={cn(
            "text-xs",
            isFull ? "font-medium text-destructive" : "text-muted-foreground",
          )}
        >
          {isFull
            ? t("groups.info.full_badge")
            : t("groups.info.spots_count", { count: spots })}
        </span>
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={count}
        aria-label={t("groups.info.filledPercent", { percent })}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full rounded-full transition-[width]", tone)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
