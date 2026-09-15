import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Timer } from "lucide-react";
import { relativeUzDayLabel } from "@/ustils";
import type { TeacherDashboardSession } from "../../types";

const SESSION_TYPE_LABELS: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  trial: "Sinov",
};

function groupByDate(sessions: TeacherDashboardSession[]) {
  const map = new Map<string, TeacherDashboardSession[]>();
  for (const session of sessions) {
    const list = map.get(session.sessionDate) ?? [];
    list.push(session);
    map.set(session.sessionDate, list);
  }
  return Array.from(map.entries()).map(([sessionDate, sessions]) => ({
    sessionDate,
    label: relativeUzDayLabel(sessionDate),
    sessions,
  }));
}

interface Props {
  todaySessions: TeacherDashboardSession[];
  upcomingSessions: TeacherDashboardSession[];
}

export const TeacherSessionsCard = ({
  todaySessions,
  upcomingSessions,
}: Props) => {
  const groups = groupByDate([...todaySessions, ...upcomingSessions]);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <h3 className="font-display text-sm font-semibold text-ink mb-4">
        Bugun va yaqin darslaringiz
      </h3>

      {!groups.length ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CalendarDays size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm text-ink-soft">Rejalashtirilgan dars yo'q</p>
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.sessionDate}>
              <p className="text-[11px] font-semibold tracking-wide text-ink-soft mb-2">
                {group.label}
              </p>
              <div className="space-y-2">
                {group.sessions.map((session) => (
                  <Link
                    key={session.id}
                    to={`/teacher/sessions/${session.id}`}
                    className="flex items-center gap-3 rounded-xl border border-ink/8 px-3 py-2.5 hover:border-gold/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink truncate">
                        <b>
                          {session.subject?.name ?? session.group.name}
                        </b>
                        {session.subject ? ` · ${session.group.name}` : ""}
                        {session.topic ? ` · ${session.topic}` : ""}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {session.startTime}–{session.endTime}
                        {session.room ? ` · ${session.room.name}` : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${
                        session.isChecked
                          ? "bg-forest/10 text-forest"
                          : "bg-gold/15 text-gold"
                      }`}
                    >
                      {session.isChecked ? (
                        <CheckCircle2 size={10} />
                      ) : (
                        <Timer size={10} />
                      )}
                      {session.isChecked ? "Yo'qlama olindi" : "Kutilmoqda"}
                    </span>
                    <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-paper-soft text-ink-soft border border-ink/10">
                      {SESSION_TYPE_LABELS[session.sessionType] ??
                        session.sessionType}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
