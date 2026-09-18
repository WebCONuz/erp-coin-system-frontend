import { BookOpen, Clock3, DoorOpen, GraduationCap } from "lucide-react";
import type { TeacherCalendarEntry } from "../../types";

const SESSION_TYPE_LABELS: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  trial: "Sinov",
  competition: "Musobaqa",
};

interface Props {
  entry: TeacherCalendarEntry;
  groupName: string;
  currentTeacherId?: string;
}

export const TeacherSessionChip = ({
  entry,
  groupName,
  currentTeacherId,
}: Props) => {
  const { template, exception, session } = entry;
  const subjectName = template.subject?.name;
  const teacherName = template.teacher?.fullName;
  const isOwn = !!currentTeacherId && template.teacher?.id === currentTeacherId;

  if (exception?.isCancelled) {
    return (
      <div
        title={`${groupName}: bekor qilindi${exception.note ? ` — ${exception.note}` : ""}`}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-bloom bg-bloom/10"
      >
        <span className="line-through">{subjectName ?? groupName}</span>
        <br />
        Bekor qilindi
      </div>
    );
  }

  if (exception) {
    return (
      <div
        title={`${groupName}: vaqti o'zgardi — ${exception.startTime}:${exception.endTime}${exception.note ? ` (${exception.note})` : ""}`}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-gold bg-gold/15"
      >
        {subjectName ?? groupName}
        <br />
        {exception.startTime}–{exception.endTime}
      </div>
    );
  }

  const startTime = session?.startTime ?? template.startTime;
  const endTime = session?.endTime ?? template.endTime;

  return (
    <div
      title={`${groupName}: ${SESSION_TYPE_LABELS[session?.sessionType ?? ""] ?? ""}${session?.topic ? ` — ${session.topic}` : ""}`}
      className={`w-full space-y-0.5 rounded px-1.5 py-1 text-left text-[11px] font-medium ${
        isOwn ? "bg-gold/25 text-forest-deep" : "bg-paper-soft text-ink-soft"
      }`}
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
          </span>
        </span>
      </div>
    </div>
  );
};
