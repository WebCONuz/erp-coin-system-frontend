import { format, parseISO } from "date-fns";
import type { CoinEconomyTrendPoint } from "../../types";

interface Props {
  data: CoinEconomyTrendPoint[];
}

export const WeeklyTrendChart = ({ data }: Props) => {
  if (!data.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Hali ma'lumot yo'q
      </div>
    );
  }

  const max = Math.max(1, ...data.map((d) => Math.max(d.earned, d.deducted)));

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Ishlab
          topildi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Ayirildi
        </span>
      </div>

      <div className="flex h-32 items-end justify-between gap-2">
        {data.map((point) => (
          <div
            key={point.date}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="flex h-full w-full items-end justify-center gap-1">
              <div
                title={`Ishlab topildi: ${point.earned}`}
                className="w-2.5 rounded-t bg-emerald-500 transition-all sm:w-3"
                style={{
                  height: `${Math.max(2, (point.earned / max) * 100)}%`,
                }}
              />
              <div
                title={`Ayirildi: ${point.deducted}`}
                className="w-2.5 rounded-t bg-red-500 transition-all sm:w-3"
                style={{
                  height: `${Math.max(2, (point.deducted / max) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {formatDayLabel(point.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const formatDayLabel = (date: string) => {
  try {
    return format(parseISO(date), "dd.MM");
  } catch {
    return date;
  }
};
