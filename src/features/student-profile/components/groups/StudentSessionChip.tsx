import { BookOpen, Clock3, DoorOpen, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MyCalendarEntry } from "../../types";

interface Props {
  entry: MyCalendarEntry;
  colorClass: string;
}

export const StudentSessionChip = ({ entry, colorClass }: Props) => {
  const { t } = useTranslation();
  const { template, exception, session, group } = entry;
  const subjectName = session?.subject?.name ?? template.subject?.name;
  const teacherName = template.teacher?.fullName;

  if (exception?.isCancelled) {
    return (
      <div
        title={`${t("calendarChip.cancelledTitle", { group: group.name })}${exception.note ? ` — ${exception.note}` : ""}`}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-bloom bg-bloom/10"
      >
        <span className="line-through">{subjectName ?? group.name}</span>
        <br />
        {t("plans.chip.cancelled")}
      </div>
    );
  }

  if (exception) {
    return (
      <div
        title={`${t("calendarChip.rescheduledTitle", { group: group.name, start: exception.startTime, end: exception.endTime })}${exception.note ? ` (${exception.note})` : ""}`}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-gold bg-gold/15"
      >
        {subjectName ?? group.name}
        <br />
        {exception.startTime}:{exception.endTime}
      </div>
    );
  }

  const startTime = session?.startTime ?? template.startTime;
  const endTime = session?.endTime ?? template.endTime;

  return (
    <div
      title={`${group.name}: ${session?.sessionType ? t(`sessions.type.${session.sessionType}`, { defaultValue: "" }) : ""}${session?.topic ? ` — ${session.topic}` : ""}`}
      className={`w-full space-y-0.5 rounded px-1.5 py-1 text-left text-[11px] font-medium ${colorClass}`}
    >
      {(subjectName || teacherName) && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          {subjectName && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <BookOpen size={11} className="shrink-0" />
              <span className="truncate">{subjectName}</span>
            </span>
          )}
          {teacherName && (
            <span className="inline-flex min-w-0 items-center gap-1">
              <GraduationCap size={11} className="shrink-0" />
              <span className="truncate">{teacherName}</span>
            </span>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {template.room && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <DoorOpen size={11} className="shrink-0" />
            <span className="truncate">{template.room.name}</span>
          </span>
        )}
        <span className="inline-flex min-w-0 items-center gap-1">
          <Clock3 size={11} className="shrink-0" />
          <span className="truncate">
            {startTime} - {endTime}
            {session?.isLocked ? ` · ${t("calendarChip.locked")}` : ""}
          </span>
        </span>
      </div>
    </div>
  );
};
