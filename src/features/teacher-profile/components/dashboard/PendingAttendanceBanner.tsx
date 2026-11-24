import { Link } from "react-router-dom";
import { ChevronRight, ClipboardCheck } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { formatDate } from "@/ustils";
import type { TeacherDashboardPendingSession } from "../../types";

/** Yo'qlama kiritilmagan darslar — o'qituvchining birinchi ishi. */
export const PendingAttendanceBanner = ({
  sessions,
}: {
  sessions: TeacherDashboardPendingSession[];
}) => {
  const { t } = useTranslation();

  if (!sessions.length) return null;

  return (
    <section
      aria-labelledby="teacher-pending-title"
      className="rounded-2xl border border-warning/30 bg-card p-4 sm:p-5"
    >
      <h2
        id="teacher-pending-title"
        className="mb-3 flex items-center gap-2 font-heading text-base font-semibold"
      >
        <span className="size-2 rounded-full bg-warning" aria-hidden />
        <span>
          <Trans
            i18nKey="teacherProfile.dashboard.pendingAttendance"
            values={{ count: sessions.length }}
            components={{ b: <b className="font-semibold" /> }}
          />
        </span>
      </h2>

      <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {sessions.slice(0, 3).map((session) => (
          <li key={session.id}>
            <Link
              to={`/teacher/sessions/${session.id}`}
              className="group flex min-h-14 items-center gap-3 rounded-xl bg-warning-soft px-3.5 py-2.5 transition-colors hover:bg-warning/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-warning">
                <ClipboardCheck className="size-4.5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {session.subject?.name ?? session.group.name}
                </span>
                <span className="block truncate text-xs tabular-nums text-muted-foreground">
                  {formatDate(session.sessionDate, "dd.MM.yyyy")},{" "}
                  {session.startTime}–{session.endTime}
                  {session.subject ? `, ${session.group.name}` : ""}
                </span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-warning transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>

      {sessions.length > 3 && (
        <Link
          to="/teacher/sessions?pending=true"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("teacherProfile.dashboard.viewAll", { count: sessions.length })}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </section>
  );
};
