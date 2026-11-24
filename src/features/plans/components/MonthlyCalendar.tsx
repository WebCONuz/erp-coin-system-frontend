import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  isValid,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { uz, ru, uzCyrl } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { CalendarDays, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/states";
import { cn } from "@/lib/utils";
import { subjectColor } from "@/lib/subject-color";
import { formatLongDate } from "@/ustils";
import { useGroups } from "@/features/groups/hooks";
import { useScheduleCalendar } from "../hooks";
import type { CalendarDayEntry } from "../types";
import { HolidayChip, SessionChip } from "./SessionChip";
import { ExceptionModal } from "./ExceptionModal";
import { GenerateSessionsModal } from "./GenerateSessionsModal";
import { GroupPicker } from "./GroupPicker";

interface Props {
  hasAction?: boolean;
  groupId?: string;
  onGroupIdChange?: (groupId: string) => void;
  month?: string; // "yyyy-MM"
  onMonthChange?: (month: string) => void;
  /** Ko'rinish almashtirgichi (haftalik/oylik) — guruh tanlash yonida chiqadi. */
  viewSwitcher?: ReactNode;
}

const DATE_LOCALES = { ru, uz, uz_cr: uzCyrl } as const;
/** Katakda ko'rinadigan yozuvlar soni; qolgani "+N" — to'liq ro'yxat kun panelida. */
const MAX_CHIPS = 3;

/** Dam olish kunida faqat sessiyasi bor yozuvlar qoladi (backend ularni o'chirmaydi). */
const splitDay = (entries: CalendarDayEntry[]) => {
  const holiday = entries.find((e) => e.holiday)?.holiday ?? null;
  const visible = (holiday ? entries.filter((e) => !!e.session) : entries)
    .slice()
    .sort((a, b) =>
      (a.exception?.startTime ?? a.template.startTime).localeCompare(
        b.exception?.startTime ?? b.template.startTime,
      ),
    );
  return { holiday, visible };
};

export const MonthlyCalendar = ({
  hasAction = true,
  groupId: controlledGroupId,
  onGroupIdChange,
  month: controlledMonth,
  onMonthChange,
  viewSwitcher,
}: Props) => {
  const { t, i18n } = useTranslation();
  const dateLocale =
    DATE_LOCALES[i18n.language as keyof typeof DATE_LOCALES] ?? uz;
  const WEEK_HEADER = [
    t("plans.weekdayShort.monday"),
    t("plans.weekdayShort.tuesday"),
    t("plans.weekdayShort.wednesday"),
    t("plans.weekdayShort.thursday"),
    t("plans.weekdayShort.friday"),
    t("plans.weekdayShort.saturday"),
    t("plans.weekdayShort.sunday"),
  ];
  const { data: groups } = useGroups();
  const [internalGroupId, setInternalGroupId] = useState<string>("");
  const groupId = controlledGroupId ?? internalGroupId;
  const setGroupId = onGroupIdChange ?? setInternalGroupId;

  const [internalMonth, setInternalMonth] = useState<string>(() =>
    format(new Date(), "yyyy-MM"),
  );
  const monthValue = controlledMonth || internalMonth;
  const setMonthValue = onMonthChange ?? setInternalMonth;

  const viewDate = useMemo(() => {
    const parsed = parse(monthValue, "yyyy-MM", new Date());
    return isValid(parsed) ? parsed : new Date();
  }, [monthValue]);

  const goToMonth = (next: Date) => setMonthValue(format(next, "yyyy-MM"));

  const [generateOpen, setGenerateOpen] = useState(false);
  const [exceptionState, setExceptionState] = useState<{
    open: boolean;
    dateKey: string;
    entry: CalendarDayEntry | null;
  }>({ open: false, dateKey: "", entry: null });
  const [pickedDay, setPickedDay] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId && groups?.data.length) {
      setGroupId(groups.data[0].id);
    }
  }, [groupId, groups, setGroupId]);

  const year = getYear(viewDate);
  const month = getMonth(viewDate) + 1;

  const { data: calendarData, isLoading } = useScheduleCalendar({
    groupId,
    year,
    month,
  });

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  // Tanlangan kun: foydalanuvchi tanlagani (shu oyda bo'lsa), aks holda
  // bugun (shu oy bo'lsa) yoki oyning 1-kuni.
  const now = new Date();
  const selectedKey =
    pickedDay && isSameMonth(parseISO(pickedDay), monthStart)
      ? pickedDay
      : format(isSameMonth(now, monthStart) ? now : monthStart, "yyyy-MM-dd");

  const selectedGroupName =
    groups?.data.find((g) => g.id === groupId)?.name ?? "";

  const openException = (dateKey: string, entry: CalendarDayEntry) =>
    setExceptionState({ open: true, dateKey, entry });
  const closeException = () =>
    setExceptionState((s) => ({ ...s, open: false }));

  const selectedDay = splitDay(calendarData?.[selectedKey] ?? []);
  const monthTitle = format(viewDate, "LLLL yyyy", { locale: dateLocale });

  return (
    <section
      aria-label={t("plans.tabs.calendar")}
      className="rounded-2xl border bg-card p-4 sm:p-5"
    >
      {/* Boshqaruv qatori */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => goToMonth(subMonths(viewDate, 1))}
            aria-label={t("plans.prevMonth")}
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
          <h2
            aria-live="polite"
            className="min-w-36 text-center font-heading text-base font-semibold capitalize sm:text-lg"
          >
            {monthTitle}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => goToMonth(addMonths(viewDate, 1))}
            aria-label={t("plans.nextMonth")}
          >
            <ChevronRight className="size-4" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-1 h-8"
            onClick={() => {
              goToMonth(new Date());
              setPickedDay(format(new Date(), "yyyy-MM-dd"));
            }}
          >
            {t("plans.today")}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {viewSwitcher}
          <GroupPicker
            groups={groups?.data ?? []}
            value={groupId}
            onChange={setGroupId}
            label={selectedGroupName || t("plans.selectGroup")}
          />
          {hasAction && (
            <Button
              disabled={!groupId}
              onClick={() => setGenerateOpen(true)}
              className="h-9 shrink-0 gap-2"
            >
              <Zap className="size-4" aria-hidden />
              <span className="hidden sm:inline">
                {t("plans.generateSessions")}
              </span>
              <span className="sr-only sm:hidden">
                {t("plans.generateSessions")}
              </span>
            </Button>
          )}
        </div>
      </div>

      {!groupId ? (
        <EmptyState icon={CalendarDays} title={t("plans.selectGroupToView")} />
      ) : isLoading ? (
        <div
          aria-busy="true"
          className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]"
        >
          <Skeleton className="h-112 rounded-xl" />
          <Skeleton className="hidden h-[112 rounded-xl xl:block" />
        </div>
      ) : (
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Oy to'ri */}
          <div>
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border bg-border">
              {WEEK_HEADER.map((label, i) => (
                <div
                  key={label}
                  aria-hidden
                  className={cn(
                    "bg-muted/60 px-1 py-2 text-center text-xs font-medium",
                    i >= 5
                      ? "text-muted-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </div>
              ))}

              {days.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const { holiday, visible } = splitDay(
                  calendarData?.[dateKey] ?? [],
                );
                const inMonth = isSameMonth(day, monthStart);
                const isSelected = dateKey === selectedKey;
                const today = isToday(day);
                const extra = visible.length - MAX_CHIPS;

                return (
                  <div
                    key={dateKey}
                    className={cn(
                      "relative min-h-16 p-1 sm:min-h-20 md:min-h-28 md:p-1.5",
                      inMonth ? "bg-card" : "bg-muted/30",
                      holiday && inMonth && "bg-destructive-soft/40",
                      isSelected && "ring-2 ring-inset ring-primary",
                    )}
                  >
                    {/* Butun katak — kunni tanlash (yozuvlar ustida z-10) */}
                    <button
                      type="button"
                      onClick={() => setPickedDay(dateKey)}
                      aria-pressed={isSelected}
                      aria-label={`${formatLongDate(day, i18n.language)}${
                        visible.length ? `, ${visible.length}` : ""
                      }`}
                      className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                    />
                    <span
                      className={cn(
                        "pointer-events-none relative flex size-6 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                        today
                          ? "bg-primary text-primary-foreground"
                          : inMonth
                            ? "text-foreground"
                            : "text-muted-foreground/60",
                      )}
                    >
                      {format(day, "d")}
                    </span>

                    {/* Telefon/planshet: faqat nuqtalar */}
                    {(visible.length > 0 || holiday) && (
                      <div className="pointer-events-none relative mt-1 flex flex-wrap gap-0.5 md:hidden">
                        {holiday && (
                          <span className="size-1.5 rounded-full bg-destructive" />
                        )}
                        {visible.slice(0, 6).map((entry, idx) => (
                          <span
                            key={`${entry.template.id}-${idx}`}
                            className="size-1.5 rounded-full"
                            style={{
                              backgroundColor: entry.exception?.isCancelled
                                ? "var(--destructive)"
                                : entry.exception
                                  ? "var(--warning)"
                                  : subjectColor(
                                      entry.session?.subject?.id ??
                                        entry.template.subject?.id ??
                                        entry.template.id,
                                    ),
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Desktop: ixcham yozuvlar */}
                    <div
                      className={cn(
                        "mt-1 hidden space-y-0.5 md:block",
                        !inMonth && "opacity-60",
                      )}
                    >
                      {holiday && (
                        <div className="pointer-events-none relative">
                          <HolidayChip holiday={holiday} />
                        </div>
                      )}
                      {visible.slice(0, MAX_CHIPS).map((entry, idx) => (
                        <SessionChip
                          key={`${entry.template.id}-${idx}`}
                          entry={entry}
                          variant="compact"
                        />
                      ))}
                      {extra > 0 && (
                        <p className="pointer-events-none relative px-1 text-[11px] font-medium text-muted-foreground">
                          {t("plans.moreCount", { count: extra })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legenda */}
            <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <span className="flex gap-0.5" aria-hidden>
                  <span className="size-2 rounded-full bg-(--subject-1)" />
                  <span className="size-2 rounded-full bg-(--subject-2)" />
                  <span className="size-2 rounded-full bg-(--subject-3)" />
                </span>
                {t("plans.legend.subjectColor")}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-warning" aria-hidden />
                {t("plans.legend.rescheduled")}
              </li>
              <li className="flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full bg-destructive"
                  aria-hidden
                />
                {t("plans.legend.cancelled")}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-success" aria-hidden />
                {t("plans.legend.locked")}
              </li>
            </ul>
          </div>

          {/* Tanlangan kun paneli */}
          <aside
            aria-labelledby="calendar-day-title"
            className="rounded-xl border bg-muted/30 p-3 xl:sticky xl:top-0"
          >
            <h3
              id="calendar-day-title"
              aria-live="polite"
              className="mb-3 px-1 font-heading text-sm font-semibold"
            >
              {formatLongDate(parseISO(selectedKey), i18n.language)}
            </h3>
            <div className="space-y-2">
              {selectedDay.holiday && (
                <HolidayChip holiday={selectedDay.holiday} />
              )}
              {selectedDay.visible.length ? (
                selectedDay.visible.map((entry, idx) => (
                  <SessionChip
                    key={`${entry.template.id}-${idx}`}
                    entry={entry}
                    hasAction={hasAction}
                    onClick={() => openException(selectedKey, entry)}
                  />
                ))
              ) : (
                <EmptyState
                  size="sm"
                  icon={CalendarDays}
                  title={t("plans.dayEmpty")}
                />
              )}
            </div>
          </aside>
        </div>
      )}

      <ExceptionModal
        open={exceptionState.open}
        onClose={closeException}
        dateKey={exceptionState.dateKey}
        entry={exceptionState.entry}
      />

      <GenerateSessionsModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        groupId={groupId}
        groupName={selectedGroupName}
      />
    </section>
  );
};
