import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  getYear,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { uz } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/loading";
import { useMySchedule } from "../../hooks";
import { StudentSessionChip } from "./StudentSessionChip";
import { getGroupAccent } from "./groupAccent";

const WEEK_HEADER = [
  { label: "Du", className: "" },
  { label: "Se", className: "" },
  { label: "Ch", className: "" },
  { label: "Pa", className: "" },
  { label: "Ju", className: "" },
  { label: "Sh", className: "text-gold" },
  { label: "Ya", className: "text-bloom" },
];

export const StudentCalendarTab = () => {
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = getYear(viewDate);
  const month = getMonth(viewDate) + 1;

  const { data: calendarData, isLoading } = useMySchedule({ year, month });

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const groupColors = useMemo(() => {
    const colors: Record<string, string> = {};

    Object.values(calendarData ?? {}).forEach((entries) => {
      entries.forEach((entry) => {
        if (!colors[entry.group.id]) {
          colors[entry.group.id] = getGroupAccent(entry.group.id).chip;
        }
      });
    });

    return colors;
  }, [calendarData]);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewDate((d) => subMonths(d, 1))}
        >
          <ChevronLeft size={18} />
        </Button>
        <h3 className="w-40 text-center text-base font-semibold capitalize text-ink">
          {format(viewDate, "LLLL yyyy", { locale: uz })}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
        >
          <ChevronRight size={18} />
        </Button>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : (
        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10">
          {WEEK_HEADER.map((day) => (
            <div
              key={day.label}
              className={`bg-paper-soft px-2 py-1.5 text-center text-xs font-semibold text-ink-soft ${day.className}`}
            >
              {day.label}
            </div>
          ))}

          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const entries = calendarData?.[dateKey] ?? [];
            const inMonth = isSameMonth(day, monthStart);

            return (
              <div
                key={dateKey}
                className={`min-h-24 space-y-1 bg-white p-1.5 ${
                  inMonth ? "" : "opacity-40"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isToday(day)
                      ? "flex h-5 w-5 items-center justify-center rounded-full bg-gold text-forest-deep"
                      : "text-ink-soft"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {entries.map((entry, idx) => (
                  <StudentSessionChip
                    key={`${entry.template.id}-${idx}`}
                    entry={entry}
                    colorClass={
                      groupColors[entry.group.id] ??
                      getGroupAccent(entry.group.id).chip
                    }
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
