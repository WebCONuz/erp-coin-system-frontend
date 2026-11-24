import { parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/states";
import { subjectColor } from "@/lib/subject-color";
import { formatLongDate, relativeDayLabel } from "@/ustils";
import type { DashboardSession } from "../../types";

function groupByDate(sessions: DashboardSession[]) {
  const map = new Map<string, DashboardSession[]>();
  for (const session of sessions) {
    const key = session.sessionDate.slice(0, 10);
    const list = map.get(key) ?? [];
    list.push(session);
    map.set(key, list);
  }
  return Array.from(map.entries());
}

interface Props {
  todaySessions: DashboardSession[];
  upcomingSessions: DashboardSession[];
}

/** Bugungi va ertangi darslar — kun bo'yicha, fan rangi chap chiziqda. */
export const UpcomingLessonsCard = ({
  todaySessions,
  upcomingSessions,
}: Props) => {
  const { t, i18n } = useTranslation();
  const days = groupByDate([...todaySessions, ...upcomingSessions]);

  return (
    <Panel title={t("studentProfile.dashboard.upcomingTitle")} className="h-full">
      {!days.length ? (
        <EmptyState
          size="sm"
          icon={CalendarDays}
          title={t("studentProfile.dashboard.noUpcoming")}
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
                    <li
                      key={session.id}
                      style={{
                        borderLeftColor: subjectColor(
                          session.subject?.id ?? session.group.id,
                        ),
                      }}
                      className="flex items-center gap-3 rounded-xl border border-l-[3px] px-3 py-2.5"
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
                      {session.sessionType !== "lesson" && (
                        <Badge variant="info" className="shrink-0">
                          {t(`sessions.type.${session.sessionType}`, {
                            defaultValue: session.sessionType,
                          })}
                        </Badge>
                      )}
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
