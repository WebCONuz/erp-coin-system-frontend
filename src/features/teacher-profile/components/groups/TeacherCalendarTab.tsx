import { useState } from "react";
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
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { OptionSelect } from "@/components/ui/option-select";
import { PageLoading } from "@/components/loading";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useMyTaughtGroups, useTeacherCalendar } from "../../hooks";
import { TeacherSessionChip } from "./TeacherSessionChip";

const WEEK_HEADER = [
  { labelKey: "plans.weekdayShort.monday", className: "" },
  { labelKey: "plans.weekdayShort.tuesday", className: "" },
  { labelKey: "plans.weekdayShort.wednesday", className: "" },
  { labelKey: "plans.weekdayShort.thursday", className: "" },
  { labelKey: "plans.weekdayShort.friday", className: "" },
  { labelKey: "plans.weekdayShort.saturday", className: "text-gold" },
  { labelKey: "plans.weekdayShort.sunday", className: "text-bloom" },
];

export const TeacherCalendarTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: groups } = useMyTaughtGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [viewDate, setViewDate] = useState(() => new Date());

  const groupId = selectedGroupId || groups?.[0]?.id || "";
  const groupName = groups?.find((g) => g.id === groupId)?.name ?? "";

  const year = getYear(viewDate);
  const month = getMonth(viewDate) + 1;

  const { data: calendarData, isLoading } = useTeacherCalendar({
    groupId,
    year,
    month,
  });

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  if (!groups?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl border border-ink/10 bg-white">
        <p className="text-sm text-ink-soft">
          {t("teacherProfile.groups.calendarNoGroups")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <OptionSelect
          value={groupId}
          onValueChange={setSelectedGroupId}
          options={groups.map((g) => ({ value: g.id, label: g.name }))}
          placeholder={t("sessions.form.groupPlaceholder")}
          className="w-full sm:w-56"
        />

        <div className="flex items-center justify-center gap-2">
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
      </div>

      {isLoading ? (
        <PageLoading />
      ) : (
        <div className="overflow-auto max-h-[65vh] sm:max-h-none sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 min-w-245 sm:min-w-0">
            {WEEK_HEADER.map((day) => (
              <div
                key={day.labelKey}
                className={`bg-paper-soft px-2 py-1.5 text-center text-xs font-semibold text-ink-soft ${day.className}`}
              >
                {t(day.labelKey)}
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
                    <TeacherSessionChip
                      key={`${entry.template.id}-${idx}`}
                      entry={entry}
                      groupName={groupName}
                      currentTeacherId={user?.id}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
