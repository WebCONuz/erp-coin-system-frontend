import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/features/students/components/ui";
import { formatDate } from "@/ustils";
import type { DashboardSession } from "../../types";

const SESSION_TYPE_LABELS: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  trial: "Sinov",
};

interface Props {
  title: string;
  sessions: DashboardSession[];
  emptyText: string;
  showDate?: boolean;
}

export const SessionListCard = ({
  title,
  sessions,
  emptyText,
  showDate,
}: Props) => (
  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
      {title}
    </h3>

    {!sessions.length ? (
      <EmptyState
        icon={<CalendarDays size={18} />}
        title={emptyText}
        text=""
      />
    ) : (
      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-zinc-100 dark:border-zinc-800 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">
                <b>{session.group.name}</b>
                {session.topic ? ` · ${session.topic}` : ""}
              </p>
              <p className="text-xs text-zinc-400">
                {showDate ? `${formatDate(session.sessionDate)} · ` : ""}
                {session.startTime}–{session.endTime}
                {session.room ? ` · ${session.room.name}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
              {SESSION_TYPE_LABELS[session.sessionType] ?? session.sessionType}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);
