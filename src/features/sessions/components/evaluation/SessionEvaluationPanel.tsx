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
    isLoading,
    isGroupError,
    isGroupForbidden,
    students,
  } = evaluation;

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

      {!hasGroup ? (
        <p className={emptyText}>{t("sessions.attendance.groupNotSet")}</p>
      ) : isLoading ? (
        <PageLoading />
      ) : isGroupError ? (
        // Ruxsat yo'qligi va bo'sh guruh foydalanuvchiga turlicha ko'rinishi kerak.
        <p className={cn(emptyText, "text-red-600 dark:text-red-400")}>
          {isGroupForbidden
            ? t("sessions.attendance.groupForbidden")
            : t("sessions.attendance.groupLoadError")}
        </p>
      ) : !students.length ? (
        <p className={emptyText}>{t("sessions.attendance.noStudents")}</p>
      ) : isScored ? (
        <SessionResultsTable
          evaluation={evaluation}
          disabled={disabled}
          tone={tone}
        />
      ) : (
        <SessionAttendanceTable
          evaluation={evaluation}
          disabled={disabled}
          tone={tone}
        />
      )}
    </div>
  );
};
