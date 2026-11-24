import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { ATTENDANCE_STATUSES } from "../../constants";
import type { SessionEvaluation } from "../../hooks";
import type { AttendanceStatus } from "../../types";
import { EVALUATION_TONES, type EvaluationTone } from "./tones";

interface Props {
  evaluation: SessionEvaluation;
  disabled: boolean;
  tone: EvaluationTone;
}

/**
 * Holat rangi faqat matn va nuqtada — tanlangan segment oq "thumb" bo'ladi.
 * Shunda sahifa ochilganda standart "Sababsiz" qatorlar qizil devorga
 * aylanmaydi, lekin farq aniq ko'rinadi.
 */
const STATUS_TEXT: Record<AttendanceStatus, string> = {
  present: "text-success",
  late: "text-warning",
  excused: "text-info",
  absent: "text-destructive",
};

const STATUS_DOT: Record<AttendanceStatus, string> = {
  present: "bg-success",
  late: "bg-warning",
  excused: "bg-info",
  absent: "bg-destructive",
};

/** Desktop'da ustunlar; mobilda qator ustma-ust (ism → holat → uy vazifasi). */
const ROW_GRID =
  "md:grid md:grid-cols-[minmax(9rem,1fr)_auto_7rem] md:items-center md:gap-4";

interface StatusPickerProps {
  value: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
  disabled: boolean;
  label: string;
}

/** Segmentli radio guruh: Tab bilan kiriladi, strelkalar bilan almashtiriladi. */
const StatusPicker = ({ value, onChange, disabled, label }: StatusPickerProps) => {
  const { t } = useTranslation();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!delta) return;
    e.preventDefault();
    const next =
      (index + delta + ATTENDANCE_STATUSES.length) % ATTENDANCE_STATUSES.length;
    onChange(ATTENDANCE_STATUSES[next]);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid w-full grid-cols-4 gap-0.5 rounded-lg bg-muted p-0.5 md:inline-grid md:w-auto"
    >
      {ATTENDANCE_STATUSES.map((status, index) => {
        const isActive = value === status;
        return (
          <button
            key={status}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(status)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              "flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed md:h-8",
              isActive
                ? cn("bg-card shadow-sm", STATUS_TEXT[status])
                : "text-muted-foreground enabled:hover:bg-card/60 enabled:hover:text-foreground",
              disabled && !isActive && "opacity-60",
            )}
          >
            {isActive && (
              <span
                className={cn("size-1.5 rounded-full", STATUS_DOT[status])}
                aria-hidden
              />
            )}
            {t(`sessions.attendance.status.${status}`)}
          </button>
        );
      })}
    </div>
  );
};

export const SessionAttendanceTable = ({
  evaluation,
  disabled,
  tone,
}: Props) => {
  const { t } = useTranslation();
  const styles = EVALUATION_TONES[tone];
  const {
    students,
    attendanceRecords,
    invalidStudentIds,
    setAttendanceStatus,
    toggleHomework,
    setAllAttendanceStatus,
    setAllHomework,
  } = evaluation;

  const recordValues = Object.values(attendanceRecords);
  const allHomeworkDone =
    recordValues.length > 0 && recordValues.every((r) => r.homeworkDone);
  const someHomeworkDone = recordValues.some((r) => r.homeworkDone);

  const counts = recordValues.reduce(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
    {} as Partial<Record<AttendanceStatus, number>>,
  );

  const homeworkAll = (
    <Checkbox
      isMinusIcon={someHomeworkDone && !allHomeworkDone}
      checked={allHomeworkDone}
      disabled={disabled}
      onCheckedChange={() => setAllHomework(!allHomeworkDone)}
      aria-label={t("sessions.attendance.homework")}
    />
  );

  return (
    <div className="min-w-0 space-y-3">
      {!disabled && (
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("text-sm", styles.muted)}>
            {t("sessions.attendance.markAll")}
          </span>
          {ATTENDANCE_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setAllAttendanceStatus(status)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span
                className={cn("size-1.5 rounded-full", STATUS_DOT[status])}
                aria-hidden
              />
              {t(`sessions.attendance.status.${status}`)}
              <span className="tabular-nums text-muted-foreground">
                {counts[status] ?? 0}
              </span>
            </button>
          ))}
          {/* Mobilda jadval sarlavhasi yo'q — "hammaga uy vazifasi" shu yerda */}
          <label className="flex h-8 items-center gap-2 rounded-full border bg-card px-3 text-xs font-medium md:hidden">
            {homeworkAll}
            {t("sessions.attendance.homework")}
          </label>
        </div>
      )}

      <div className={styles.table}>
        <div
          className={cn(
            "hidden px-4 py-2.5 text-sm font-medium md:grid",
            ROW_GRID,
            styles.thead,
          )}
        >
          <span>{t("common.student")}</span>
          <span>{t("sessions.attendance.statusLabel")}</span>
          <span className="flex items-center justify-center gap-2">
            {homeworkAll}
            {t("sessions.attendance.homework")}
          </span>
        </div>

        <ul>
          {students.map((student, idx) => {
            const record = attendanceRecords[student.id] ?? {
              status: "absent" as const,
              homeworkDone: false,
            };
            const isInvalid = invalidStudentIds.includes(student.id);
            const homeworkId = `homework-${student.id}`;

            return (
              <li
                key={student.id}
                aria-invalid={isInvalid || undefined}
                className={cn(
                  "space-y-2.5 px-4 py-3 md:space-y-0",
                  ROW_GRID,
                  idx > 0 ? styles.row : "md:border-t",
                  isInvalid && "bg-destructive-soft/60",
                )}
              >
                <div className={cn("min-w-0", styles.text)}>
                  <p className="truncate text-sm font-medium">
                    {student.fullName}
                  </p>
                  {student.leftAt && (
                    <p className={cn("text-xs", styles.muted)}>
                      {t("sessions.attendance.leftGroupAt", {
                        date: formatDate(student.leftAt, "dd.MM.yyyy"),
                      })}
                    </p>
                  )}
                </div>

                <StatusPicker
                  value={record.status}
                  disabled={disabled}
                  label={student.fullName}
                  onChange={(status) => setAttendanceStatus(student.id, status)}
                />

                <label
                  htmlFor={homeworkId}
                  className="flex cursor-pointer items-center gap-2 text-sm md:justify-center"
                >
                  <Checkbox
                    id={homeworkId}
                    checked={record.homeworkDone}
                    disabled={disabled}
                    onCheckedChange={() => toggleHomework(student.id)}
                  />
                  <span className={cn("md:sr-only", styles.muted)}>
                    {t("sessions.attendance.homework")}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
