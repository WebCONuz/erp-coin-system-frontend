import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  DoorOpen,
  Timer,
} from "lucide-react";
import { formatDate } from "@/ustils";
import { getSessionTypeLabels } from "@/features/sessions/constants";
import type { SessionItem } from "@/features/sessions/types";
import { cn } from "@/lib/utils";
import { isSessionPastDue } from "@/features/sessions/utils";

const TYPE_BADGE_CLASS: Record<string, string> = {
  lesson: "bg-forest/10 text-forest",
  exam: "bg-bloom/10 text-bloom",
  competition: "bg-gold/15 text-gold",
  extra: "bg-paper-soft text-ink-soft",
};

export const TeacherSessionCard = ({ data }: { data: SessionItem }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sessionTypeLabels = getSessionTypeLabels(t);

  const isPastDue = isSessionPastDue(data);
  const isUnchecked = isPastDue && !data.isChecked;
  const isCheckedPast = isPastDue && data.isChecked;

  return (
    <button
      type="button"
      onClick={() => navigate(`/teacher/sessions/${data.id}`)}
      className={cn(
        "border rounded-xl p-3 relative cursor-pointer hover:shadow-sm transition-shadow",
        isUnchecked &&
          "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20",
        isCheckedPast &&
          "border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/40",
        !isUnchecked && !isCheckedPast && "bg-white dark:bg-card",
      )}
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
            data.isChecked ? "bg-forest/10 text-forest" : "bg-gold/15 text-gold"
          }`}
        >
          {data.isChecked ? <CheckCircle2 size={10} /> : <Timer size={10} />}
          {data.isChecked
            ? t("sessions.attendanceTaken")
            : t("sessions.pending")}
        </span>
        {data.subject && (
          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-bloom/10 text-bloom">
            {data.subject.name}
          </span>
        )}
      </div>

      <h4 className="text-base font-semibold text-ink text-start truncate mb-1.5">
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
        <p className="text-xs text-start text-ink-soft mt-2 pt-2 border-t border-ink/8 line-clamp-2">
          {t("sessions.topicLabel")}: {data.topic}
        </p>
      )}
    </button>
  );
};
