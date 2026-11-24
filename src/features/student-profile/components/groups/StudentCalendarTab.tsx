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
import { CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/loading";
import { useMySchedule } from "../../hooks";
import { StudentSessionChip } from "./StudentSessionChip";
import { getGroupAccent } from "./groupAccent";

const WEEK_HEADER = [
  { labelKey: "plans.weekdayShort.monday", className: "" },
  { labelKey: "plans.weekdayShort.tuesday", className: "" },
  { labelKey: "plans.weekdayShort.wednesday", className: "" },
  { labelKey: "plans.weekdayShort.thursday", className: "" },
  { labelKey: "plans.weekdayShort.friday", className: "" },
  { labelKey: "plans.weekdayShort.saturday", className: "text-muted-foreground/70" },
  { labelKey: "plans.weekdayShort.sunday", className: "text-muted-foreground/70" },
];

export const StudentCalendarTab = () => {
  const { t } = useTranslation();
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = getYear(viewDate);
  const month = getMonth(viewDate) + 1;

  const { data: calendarData, isLoading } = useMySchedule({ year, month });

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const subjectColors = useMemo(() => {
    const colors: Record<string, string> = {};

    Object.values(calendarData ?? {}).forEach((entries) => {
      entries.forEach((entry) => {
        const seed = entry.template.subject?.id ?? entry.group.id;
        if (!colors[seed]) {
          colors[seed] = getGroupAccent(seed).chip;
        }
      });
    });

    return colors;
  }, [calendarData]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewDate((d) => subMonths(d, 1))}
        >
          <ChevronLeft size={18} />
        </Button>
        <h3 className="w-40 text-center text-base font-semibold capitalize text-foreground">
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
        <div className="overflow-auto max-h-[65vh] sm:max-h-none sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-foreground/10 min-w-245 sm:min-w-0">
            {WEEK_HEADER.map((day) => (
              <div
                key={day.labelKey}
                className={`bg-muted/55 px-2 py-1.5 text-center text-xs font-semibold text-muted-foreground ${day.className}`}
              >
                {t(day.labelKey)}
              </div>
            ))}

            {days.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const entries = calendarData?.[dateKey] ?? [];
              const inMonth = isSameMonth(day, monthStart);
              // `holiday` kun bo'yicha (hamma elementda bir xil). Dam olish kunida
              // faqat `session` bor elementlar qoladi — tekshirilgan/qulflangan
              // yoki qo'lda yaratilgan dars (backend ularni o'chirmaydi).
              const holiday = entries.find((e) => e.holiday)?.holiday;
              const visibleEntries = holiday
                ? entries.filter((e) => !!e.session)
                : entries;

              return (
                <div
                  key={dateKey}
                  className={`min-h-24 space-y-1 bg-card p-1.5 ${
                    inMonth ? "" : "opacity-40"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isToday(day)
                        ? "flex h-5 w-5 items-center justify-center rounded-full bg-coin text-coin-ink"
                        : "text-muted-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {holiday && (
                    <div className="flex w-full items-center gap-1 truncate rounded px-1.5 py-0.5 text-[11px] font-medium text-destructive bg-destructive/10">
                      <CalendarOff size={11} className="shrink-0" />
                      <span className="truncate">
                        {t("plans.chip.holiday")}: {holiday.name}
                      </span>
                    </div>
                  )}
                  {visibleEntries.map((entry, idx) => {
                    const seed = entry.template.subject?.id ?? entry.group.id;
                    return (
                      <StudentSessionChip
                        key={`${entry.template.id}-${idx}`}
                        entry={entry}
                        colorClass={
                          subjectColors[seed] ?? getGroupAccent(seed).chip
                        }
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
