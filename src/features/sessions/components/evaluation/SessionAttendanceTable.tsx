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

/** Tanlangan holat rangi (dark mode bilan). */
const STATUS_ACTIVE_CLASS: Record<AttendanceStatus, string> = {
  present:
    "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500",
  late: "bg-amber-500 text-white border-amber-500 dark:bg-amber-500 dark:border-amber-500",
  excused:
    "bg-sky-600 text-white border-sky-600 dark:bg-sky-500 dark:border-sky-500",
  absent:
    "bg-red-600 text-white border-red-600 dark:bg-red-500 dark:border-red-500",
};

const STATUS_IDLE_CLASS =
  "bg-transparent border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5";

interface StatusPickerProps {
  value: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
  disabled: boolean;
  label: string;
}

const StatusPicker = ({ value, onChange, disabled, label }: StatusPickerProps) => {
  const { t } = useTranslation();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex flex-nowrap gap-1"
    >
      {ATTENDANCE_STATUSES.map((status) => {
        const isActive = value === status;
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => onChange(status)}
            className={cn(
              "whitespace-nowrap rounded-md border px-2 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              isActive ? STATUS_ACTIVE_CLASS[status] : STATUS_IDLE_CLASS,
            )}
          >
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

  return (
    <div className="space-y-3 min-w-0">
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
              className={cn(
                "rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                STATUS_IDLE_CLASS,
              )}
            >
              {t(`sessions.attendance.status.${status}`)}
            </button>
          ))}
        </div>
      )}

      <div className={styles.table}>
        <table className="w-full text-sm">
          <thead className={styles.thead}>
            <tr>
              <th className={cn(styles.th, "text-left")}>
                {t("common.student")}
              </th>
              <th className={cn(styles.th, "text-left")}>
                {t("sessions.attendance.statusLabel")}
              </th>
              <th className={cn(styles.th, "text-center")}>
                <div className="flex items-center justify-center gap-2">
                  <Checkbox
                    isMinusIcon={someHomeworkDone && !allHomeworkDone}
                    checked={allHomeworkDone}
                    disabled={disabled}
                    onCheckedChange={() => setAllHomework(!allHomeworkDone)}
                  />
                  {t("sessions.attendance.homework")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const record = attendanceRecords[student.id] ?? {
                status: "absent" as const,
                homeworkDone: false,
              };
              const isInvalid = invalidStudentIds.includes(student.id);

              return (
                <tr
                  key={student.id}
                  className={cn(
                    styles.row,
                    isInvalid && "bg-red-50 dark:bg-red-950/20",
                  )}
                >
                  <td className={cn("px-4 py-2.5 min-w-40", styles.text)}>
                    <div>{student.fullName}</div>
                    {student.leftAt && (
                      <div className={cn("text-xs", styles.muted)}>
                        {t("sessions.attendance.leftGroupAt", {
                          date: formatDate(student.leftAt, "dd.MM.yyyy"),
                        })}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusPicker
                      value={record.status}
                      disabled={disabled}
                      label={student.fullName}
                      onChange={(status) =>
                        setAttendanceStatus(student.id, status)
                      }
                    />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <Checkbox
                      checked={record.homeworkDone}
                      disabled={disabled}
                      onCheckedChange={() => toggleHomework(student.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
