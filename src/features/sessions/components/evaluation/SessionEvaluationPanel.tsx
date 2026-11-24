import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Clock, ShieldAlert, UsersRound, CloudOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/states";
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

  return (
    <section
      aria-labelledby="session-evaluation-title"
      className={cn(styles.panel, className)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="session-evaluation-title" className={styles.title}>
          {isScored
            ? t("sessions.results.title")
            : t("sessions.attendance.title")}
        </h2>
        {headerExtra}
      </div>

      {hasGroup && !hasStarted && (
        <p className="flex items-start gap-2 rounded-lg bg-warning-soft px-3 py-2.5 text-sm text-foreground">
          <Clock className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          {t("sessions.evaluation.notStartedHint")}
        </p>
      )}

      {!hasGroup ? (
        <EmptyState
          size="sm"
          icon={UsersRound}
          title={t("sessions.attendance.groupNotSet")}
        />
      ) : isLoading ? (
        <div aria-busy="true" className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-lg" />
          ))}
        </div>
      ) : isRosterError ? (
        // Ruxsat yo'qligi va bo'sh guruh foydalanuvchiga turlicha ko'rinishi kerak.
        <EmptyState
          size="sm"
          icon={isRosterForbidden ? ShieldAlert : CloudOff}
          title={
            isRosterForbidden
              ? t("sessions.attendance.groupForbidden")
              : t("sessions.attendance.groupLoadError")
          }
          className="text-destructive"
        />
      ) : !students.length ? (
        <EmptyState
          size="sm"
          icon={UsersRound}
          title={t("sessions.attendance.noStudents")}
        />
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
    </section>
  );
};
