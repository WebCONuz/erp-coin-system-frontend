import { Link } from "react-router-dom";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { formatDate } from "@/ustils";
import type { TeacherDashboardPendingSession } from "../../types";

export const PendingAttendanceBanner = ({
  sessions,
}: {
  sessions: TeacherDashboardPendingSession[];
}) => {
  if (!sessions.length) return null;

  return (
    <div className="rounded-2xl border border-bloom/25 bg-bloom/8 p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-bloom/15 flex items-center justify-center shrink-0">
          <AlertTriangle size={16} className="text-bloom" />
        </div>
        <p className="text-sm text-ink">
          <b>{sessions.length}</b> ta darsingiz uchun yo'qlama kiritilmagan
        </p>
      </div>

      <div className="mt-3 space-y-1.5">
        {sessions.slice(0, 3).map((session) => (
          <Link
            key={session.id}
            to={`/teacher/sessions/${session.id}`}
            className="flex items-center justify-between gap-3 rounded-xl bg-white/60 hover:bg-white px-3 py-2 transition-colors"
          >
            <span className="text-sm text-ink truncate">
              <b>{session.subject?.name ?? session.group.name}</b> ·{" "}
              {formatDate(session.sessionDate, "dd.MM.yyyy")} ·{" "}
              {session.startTime}–{session.endTime}
            </span>
            <ChevronRight size={15} className="text-bloom shrink-0" />
          </Link>
        ))}
      </div>

      {sessions.length > 3 && (
        <Link
          to="/teacher/sessions?pending=true"
          className="inline-block mt-2 text-xs font-medium text-bloom hover:underline"
        >
          Barchasini ko'rish ({sessions.length})
        </Link>
      )}
    </div>
  );
};
