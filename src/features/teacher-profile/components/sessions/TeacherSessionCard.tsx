import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, DoorOpen, Lock, LockOpen } from "lucide-react";
import { formatDate } from "@/ustils";
import { sessionTypeLabels } from "@/features/sessions/constants";
import type { SessionItem } from "@/features/sessions/types";

const TYPE_BADGE_CLASS: Record<string, string> = {
  lesson: "bg-forest/10 text-forest",
  exam: "bg-bloom/10 text-bloom",
  competition: "bg-gold/15 text-gold",
  extra: "bg-paper-soft text-ink-soft",
};

export const TeacherSessionCard = ({ data }: { data: SessionItem }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/teacher/sessions/${data.id}`)}
      className="text-left rounded-2xl border border-ink/10 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
            TYPE_BADGE_CLASS[data.sessionType] ?? TYPE_BADGE_CLASS.lesson
          }`}
        >
          {sessionTypeLabels[data.sessionType] ?? data.sessionType}
        </span>
        <span
          className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
            data.isLocked ? "bg-forest/10 text-forest" : "bg-gold/15 text-gold"
          }`}
        >
          {data.isLocked ? <Lock size={10} /> : <LockOpen size={10} />}
          {data.isLocked ? "Yo'qlama olindi" : "Kutilmoqda"}
        </span>
        {data.subject && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-bloom/10 text-bloom">
            {data.subject.name}
          </span>
        )}
      </div>

      <h4 className="text-base font-semibold text-ink truncate mb-1.5">
        {data.group.name}
      </h4>

      <div className="space-y-1 text-sm text-ink-soft">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={13} />
          {formatDate(data.sessionDate)}
          <Clock size={13} className="ml-1.5" />
          {data.startTime}–{data.endTime}
        </div>
        <div className="flex items-center gap-1.5">
          <DoorOpen size={13} />
          {data.room.name}
        </div>
      </div>

      {data.topic && (
        <p className="text-xs text-ink-soft mt-2 pt-2 border-t border-ink/8 line-clamp-2">
          Mavzu: {data.topic}
        </p>
      )}
    </button>
  );
};
