import { CalendarDays } from "lucide-react";
import type { DashboardSession } from "../../types";

const SESSION_TYPE_LABELS: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  trial: "Sinov",
};

const UZ_MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

const AVATAR_STYLES = [
  "bg-forest text-paper",
  "bg-gold/20 text-gold",
  "bg-bloom/15 text-bloom",
];

function avatarStyle(seed: string) {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_STYLES[sum % AVATAR_STYLES.length];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function dateLabel(sessionDate: string) {
  const d = new Date(sessionDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatted = `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}`.toUpperCase();

  if (d.toDateString() === today.toDateString()) return `BUGUN · ${formatted}`;
  if (d.toDateString() === tomorrow.toDateString())
    return `ERTAGA · ${formatted}`;
  return formatted;
}

function groupByDate(sessions: DashboardSession[]) {
  const map = new Map<string, DashboardSession[]>();
  for (const session of sessions) {
    const list = map.get(session.sessionDate) ?? [];
    list.push(session);
    map.set(session.sessionDate, list);
  }
  return Array.from(map.entries()).map(([sessionDate, sessions]) => ({
    sessionDate,
    label: dateLabel(sessionDate),
    sessions,
  }));
}

interface Props {
  todaySessions: DashboardSession[];
  upcomingSessions: DashboardSession[];
}

export const UpcomingLessonsCard = ({
  todaySessions,
  upcomingSessions,
}: Props) => {
  const groups = groupByDate([...todaySessions, ...upcomingSessions]);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold text-ink">
          Bugun va ertaga darslaringiz
        </h3>
      </div>

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
                  <div
                    key={session.id}
                    className="flex items-center gap-3 rounded-xl border border-ink/8 px-3 py-2.5"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${avatarStyle(session.group.id)}`}
                    >
                      {initials(session.group.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink truncate">
                        <b>{session.group.name}</b>
                        {session.topic ? ` · ${session.topic}` : ""}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {session.startTime}–{session.endTime}
                        {session.room ? ` · ${session.room.name}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-paper-soft text-ink-soft border border-ink/10">
                      {SESSION_TYPE_LABELS[session.sessionType] ??
                        session.sessionType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
