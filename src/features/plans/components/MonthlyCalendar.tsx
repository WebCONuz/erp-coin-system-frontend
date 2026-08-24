import { useEffect, useMemo, useState } from "react";
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
import { ChevronDown, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageLoading } from "@/components/loading";
import { useGroups } from "@/features/groups/hooks";
import { useScheduleCalendar } from "../hooks";
import { TEMPLATE_CHIP_COLORS } from "../constants";
import type { CalendarDayEntry } from "../types";
import { SessionChip } from "./SessionChip";
import { ExceptionModal } from "./ExceptionModal";
import { GenerateSessionsModal } from "./GenerateSessionsModal";

const WEEK_HEADER = [
  { label: "Du", className: "" },
  { label: "Se", className: "" },
  { label: "Ch", className: "" },
  { label: "Pa", className: "" },
  { label: "Ju", className: "" },
  { label: "Sh", className: "text-amber-500" },
  { label: "Ya", className: "text-red-500" },
];

interface Props {
  hasAction?: boolean;
  groupId?: string;
  onGroupIdChange?: (groupId: string) => void;
}

export const MonthlyCalendar = ({
  hasAction = true,
  groupId: controlledGroupId,
  onGroupIdChange,
}: Props) => {
  const { data: groups } = useGroups();
  const [internalGroupId, setInternalGroupId] = useState<string>("");
  const groupId = controlledGroupId ?? internalGroupId;
  const setGroupId = onGroupIdChange ?? setInternalGroupId;
  const [viewDate, setViewDate] = useState(new Date());
  const [generateOpen, setGenerateOpen] = useState(false);
  const [exceptionState, setExceptionState] = useState<{
    open: boolean;
    dateKey: string;
    entry: CalendarDayEntry | null;
  }>({ open: false, dateKey: "", entry: null });

  useEffect(() => {
    if (!groupId && groups?.data.length) {
      setGroupId(groups.data[0].id);
    }
  }, [groupId, groups]);

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

  const selectedGroupName =
    groups?.data.find((g) => g.id === groupId)?.name ?? "";

  const templateColors = useMemo(() => {
    const colors: Record<string, string> = {};
    let nextIndex = 0;

    Object.keys(calendarData ?? {})
      .sort()
      .forEach((dateKey) => {
        calendarData![dateKey].forEach((entry) => {
          if (!colors[entry.template.id]) {
            colors[entry.template.id] =
              TEMPLATE_CHIP_COLORS[nextIndex % TEMPLATE_CHIP_COLORS.length];
            nextIndex += 1;
          }
        });
      });

    return colors;
  }, [calendarData]);

  const openException = (dateKey: string, entry: CalendarDayEntry) =>
    setExceptionState({ open: true, dateKey, entry });
  const closeException = () =>
    setExceptionState((s) => ({ ...s, open: false }));

  return (
    <div className="rounded-2xl bg-background p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewDate((d) => subMonths(d, 1))}
          >
            <ChevronLeft size={18} />
          </Button>
          <h3 className="w-40 text-center text-lg font-semibold capitalize">
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

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-48 justify-between font-normal"
              >
                <span className="truncate">
                  {selectedGroupName || "Guruh tanlang"}
                </span>
                <ChevronDown size={16} className="shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup
                value={groupId}
                onValueChange={setGroupId}
              >
                {groups?.data.map((group) => (
                  <DropdownMenuRadioItem key={group.id} value={group.id}>
                    {group.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasAction && (
            <Button
              disabled={!groupId}
              onClick={() => setGenerateOpen(true)}
              className="gap-2 bg-linear-to-br from-purple-500 to-purple-700 text-white"
            >
              <Zap size={16} />
              Sessiyalar yaratish
            </Button>
          )}
        </div>
      </div>

      {!groupId ? (
        <p className="py-10 text-center text-muted-foreground">
          Kalendarni ko'rish uchun guruh tanlang
        </p>
      ) : isLoading ? (
        <PageLoading />
      ) : (
        <>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {WEEK_HEADER.map((day) => (
              <div
                key={day.label}
                className={`bg-muted px-2 py-1.5 text-center text-xs font-semibold ${day.className}`}
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
                  className={`min-h-24 space-y-1 bg-background p-1.5 ${
                    inMonth ? "" : "opacity-40"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isToday(day)
                        ? "flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {entries.map((entry, idx) => (
                    <SessionChip
                      key={`${entry.template.id}-${idx}`}
                      entry={entry}
                      onClick={() => openException(dateKey, entry)}
                      hasAction={hasAction}
                      colorClass={
                        templateColors[entry.template.id] ??
                        TEMPLATE_CHIP_COLORS[0]
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Oddiy
              sessiya
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Vaqt
              o'zgargan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Bekor
              qilingan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />{" "}
              Qulflangan (yo'qlama kiritilgan)
            </span>
          </div>
        </>
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
    </div>
  );
};
