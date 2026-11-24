import {
  BookOpen,
  CalendarOff,
  Check,
  DoorOpen,
  GraduationCap,
  MessageSquareText,
  Pencil,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { subjectColor } from "@/lib/subject-color";
import type { CalendarDayEntry, CalendarHoliday } from "../types";

export type EntryStatus = "normal" | "rescheduled" | "cancelled" | "locked";

const getStatus = (entry: CalendarDayEntry): EntryStatus => {
  if (entry.exception?.isCancelled) return "cancelled";
  if (entry.exception) return "rescheduled";
  if (entry.session?.isLocked) return "locked";
  return "normal";
};

const STATUS_DOT: Record<Exclude<EntryStatus, "normal">, string> = {
  rescheduled: "var(--warning)",
  cancelled: "var(--destructive)",
  locked: "var(--success)",
};

const entryColor = (entry: CalendarDayEntry, status: EntryStatus) =>
  status === "normal"
    ? subjectColor(
        entry.session?.subject?.id ?? entry.template?.subject?.id ?? entry.template.id,
      )
    : STATUS_DOT[status];

/** Dam olish kuni — shu kunda dars yo'q. */
export const HolidayChip = ({ holiday }: { holiday: CalendarHoliday }) => {
  const { t } = useTranslation();
  return (
    <div
      className="flex w-full items-center gap-1 truncate rounded-md bg-destructive-soft px-1.5 py-0.5 text-[11px] font-medium text-destructive"
      title={`${t("plans.chip.holiday")}: ${holiday.name}`}
    >
      <CalendarOff className="size-3 shrink-0" aria-hidden />
      <span className="truncate">{holiday.name}</span>
    </div>
  );
};

interface Props {
  entry: CalendarDayEntry;
  /** Faqat `full` variantda — tahrirlash (istisno) modalini ochadi. */
  onClick?: () => void;
  hasAction?: boolean;
  /**
   * `compact` — kalendar katagi: faqat ko'rsatadi, bosilmaydi (bosish katak
   * tugmasiga o'tib, kunni tanlaydi); `full` — kun paneli: bosilsa tahrirlanadi.
   */
  variant?: "compact" | "full";
}

export const SessionChip = ({
  entry,
  onClick,
  hasAction = true,
  variant = "full",
}: Props) => {
  const { t } = useTranslation();
  const { template, exception, session } = entry;
  const status = getStatus(entry);
  const color = entryColor(entry, status);

  const subjectName = session?.subject?.name ?? template?.subject?.name;
  const start = exception?.startTime ?? template.startTime;
  const end = exception?.endTime ?? template.endTime;
  const timeChanged =
    !!exception?.startTime &&
    (exception.startTime !== template.startTime ||
      exception.endTime !== template.endTime);
  const roomName = exception?.room?.name ?? template?.room?.name ?? "—";
  const teacherName =
    exception?.teacher?.fullName ?? template?.teacher?.fullName;

  const statusLabel =
    status === "cancelled"
      ? t("plans.legend.cancelled")
      : status === "rescheduled"
        ? t("plans.legend.rescheduled")
        : status === "locked"
          ? t("sessions.locked")
          : undefined;

  if (variant === "compact") {
    return (
      <div
        aria-hidden
        className={cn(
          // `pointer-events-none` — bosish ostidagi katak tugmasiga o'tadi.
          "pointer-events-none relative flex w-full items-center gap-1 truncate rounded-md px-1 py-0.5 text-[11px] leading-4",
          status === "cancelled" && "text-muted-foreground line-through",
        )}
      >
        {status === "locked" ? (
          <Check className="size-3 shrink-0 text-success" aria-hidden />
        ) : (
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
            aria-hidden
          />
        )}
        <span className="shrink-0 font-medium tabular-nums">{start}</span>
        <span className="truncate text-muted-foreground">
          {subjectName ?? roomName}
        </span>
      </div>
    );
  }

  const note = exception?.note || (exception ? t("plans.chip.technicalReason") : null);

  return (
    <button
      type="button"
      onClick={hasAction ? onClick : undefined}
      disabled={!hasAction}
      style={{ borderLeftColor: color }}
      className={cn(
        "group w-full rounded-lg border border-l-[3px] bg-card p-3 text-left transition-colors enabled:hover:bg-muted/40 disabled:cursor-default focus-visible:outline-2 focus-visible:outline-ring",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium tabular-nums">
            {timeChanged && (
              <span className="mr-1.5 text-muted-foreground line-through">
                {template.startTime}–{template.endTime}
              </span>
            )}
            <span className={cn(status === "cancelled" && "line-through")}>
              {start}–{end}
            </span>
          </p>
          <p
            className={cn(
              "mt-0.5 flex items-center gap-1.5 truncate font-heading text-sm font-semibold",
              status === "cancelled" && "text-muted-foreground",
            )}
          >
            <BookOpen className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
            {subjectName ?? "—"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {statusLabel && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                status === "cancelled" && "bg-destructive-soft text-destructive",
                status === "rescheduled" && "bg-warning-soft text-warning",
                status === "locked" && "bg-success-soft text-success",
              )}
            >
              {statusLabel}
            </span>
          )}
          {hasAction && (
            <Pencil
              className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden
            />
          )}
        </div>
      </div>

      <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
        {teacherName && (
          <div className="flex min-w-0 items-center gap-1.5">
            <dt>
              <GraduationCap className="size-3.5" aria-hidden />
              <span className="sr-only">
                {exception?.teacher ? t("plans.chip.substitute") : t("common.teacher")}
              </span>
            </dt>
            <dd className="truncate">
              {exception?.teacher && (
                <span className="font-medium text-warning">
                  {t("plans.chip.substitute")}:{" "}
                </span>
              )}
              {teacherName}
            </dd>
          </div>
        )}
        <div className="flex min-w-0 items-center gap-1.5">
          <dt>
            <DoorOpen className="size-3.5" aria-hidden />
            <span className="sr-only">{t("common.room")}</span>
          </dt>
          <dd className="truncate">
            {exception?.room && (
              <span className="font-medium text-warning">
                {t("plans.chip.newRoom")}:{" "}
              </span>
            )}
            {roomName}
          </dd>
        </div>
        {note && (
          <div className="flex min-w-0 items-start gap-1.5">
            <dt>
              <MessageSquareText className="mt-px size-3.5" aria-hidden />
              <span className="sr-only">{t("plans.chip.reason")}</span>
            </dt>
            <dd className="line-clamp-2">{note}</dd>
          </div>
        )}
        {session?.topic && (
          <p className="line-clamp-2 border-t pt-1.5 text-foreground/80">
            {t("sessions.topicLabel")}: {session.topic}
          </p>
        )}
      </dl>
    </button>
  );
};
