import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PageLoading } from "@/components/loading";
import { cn } from "@/lib/utils";
import type { SessionEvaluation } from "../../hooks";
import { SessionAttendanceTable } from "./SessionAttendanceTable";
import { SessionResultsTable } from "./SessionResultsTable";
import { EVALUATION_TONES, type EvaluationTone } from "./tones";

interface Props {
  evaluation: SessionEvaluation;
  disabled: boolean;
  tone?: EvaluationTone;
  headerExtra?: ReactNode;
  className?: string;
}

/** Sessiya `evaluationMode` iga qarab yo'qlama yoki natijalar jadvalini ko'rsatadi. */
export const SessionEvaluationPanel = ({
  evaluation,
  disabled,
  tone = "admin",
  headerExtra,
  className,
}: Props) => {
  const { t } = useTranslation();
  const styles = EVALUATION_TONES[tone];
  const {
    isScored,
    hasGroup,
    hasStarted,
    isLoading,
    isRosterError,
    isRosterForbidden,
    students,
  } = evaluation;
  // Dars boshlanmagan bo'lsa yo'qlama qo'yib bo'lmaydi (backend SESSION_NOT_STARTED).
  const isDisabled = disabled || !hasStarted;

  const emptyText = cn("py-6 text-center text-sm", styles.muted);

  return (
    <div className={cn(styles.panel, className)}>
      <div className="flex items-center flex-wrap gap-2">
        <h3 className={styles.title}>
          {isScored
            ? t("sessions.results.title")
            : t("sessions.attendance.title")}
        </h3>
        {headerExtra}
      </div>

      {hasGroup && !hasStarted && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
          {t("sessions.evaluation.notStartedHint")}
        </p>
      )}

      {!hasGroup ? (
        <p className={emptyText}>{t("sessions.attendance.groupNotSet")}</p>
      ) : isLoading ? (
        <PageLoading />
      ) : isRosterError ? (
        // Ruxsat yo'qligi va bo'sh guruh foydalanuvchiga turlicha ko'rinishi kerak.
        <p className={cn(emptyText, "text-red-600 dark:text-red-400")}>
          {isRosterForbidden
            ? t("sessions.attendance.groupForbidden")
            : t("sessions.attendance.groupLoadError")}
        </p>
      ) : !students.length ? (
        <p className={emptyText}>{t("sessions.attendance.noStudents")}</p>
      ) : isScored ? (
        <SessionResultsTable
          evaluation={evaluation}
          disabled={isDisabled}
          tone={tone}
        />
      ) : (
        <SessionAttendanceTable
          evaluation={evaluation}
          disabled={isDisabled}
          tone={tone}
        />
      )}
    </div>
  );
};
