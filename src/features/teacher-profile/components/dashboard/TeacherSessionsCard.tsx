import { Link } from "react-router-dom";
import { parseISO } from "date-fns";
import { CalendarDays, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/states";
import { subjectColor } from "@/lib/subject-color";
import { formatLongDate, relativeDayLabel } from "@/ustils";
import type { TeacherDashboardSession } from "../../types";

function groupByDate(sessions: TeacherDashboardSession[]) {
  const map = new Map<string, TeacherDashboardSession[]>();
  for (const session of sessions) {
    const key = session.sessionDate.slice(0, 10);
    const list = map.get(key) ?? [];
    list.push(session);
    map.set(key, list);
  }
  return Array.from(map.entries());
}

interface Props {
  todaySessions: TeacherDashboardSession[];
  upcomingSessions: TeacherDashboardSession[];
}

/** Bugungi va yaqin darslar — kun bo'yicha guruhlangan. */
export const TeacherSessionsCard = ({
  todaySessions,
  upcomingSessions,
}: Props) => {
  const { t, i18n } = useTranslation();
  const days = groupByDate([...todaySessions, ...upcomingSessions]);

  return (
    <Panel title={t("teacherProfile.dashboard.upcomingTitle")} className="h-full">
      {!days.length ? (
        <EmptyState
          size="sm"
          icon={CalendarDays}
          title={t("teacherProfile.dashboard.noUpcoming")}
        />
      ) : (
        <div className="space-y-5">
          {days.map(([day, sessions]) => {
            const date = parseISO(day);
            const relative = relativeDayLabel(date, i18n.language);
            return (
              <section key={day}>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  {formatLongDate(date, i18n.language)}
                  {relative && (
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">
                      {relative}
                    </span>
                  )}
                </h3>
                <ul className="space-y-2">
                  {sessions.map((session) => (
                    <li key={session.id}>
                      <Link
                        to={`/teacher/sessions/${session.id}`}
                        style={{
                          borderLeftColor: subjectColor(
                            session.subject?.id ?? session.group.id,
                          ),
                        }}
                        className="flex items-center gap-3 rounded-xl border border-l-[3px] px-3 py-2.5 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className="w-12 shrink-0 text-sm font-semibold tabular-nums">
                          {session.startTime}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {session.subject?.name ?? session.group.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {[
                              session.subject ? session.group.name : null,
                              session.room?.name,
                              session.topic,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </span>
                        {session.isChecked ? (
                          <Badge variant="success" className="shrink-0">
                            <CheckCircle2 aria-hidden />
                            <span className="hidden sm:inline">
                              {t("sessions.attendanceTaken")}
                            </span>
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="shrink-0">
                            <Clock aria-hidden />
                            <span className="hidden sm:inline">
                              {t("sessions.pending")}
                            </span>
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </Panel>
  );
};
