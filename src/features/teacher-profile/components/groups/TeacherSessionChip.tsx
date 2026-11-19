import { BookOpen, Clock3, DoorOpen, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TeacherCalendarEntry } from "../../types";

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
  const { t } = useTranslation();
  const { template, exception, session } = entry;
  const subjectName = template.subject?.name;

  if (exception?.isCancelled) {
    return (
      <div
        title={`${t("calendarChip.cancelledTitle", { group: groupName })}${exception.note ? ` — ${exception.note}` : ""}`}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-bloom bg-bloom/10"
      >
        <span className="line-through">{subjectName ?? groupName}</span>
        <br />
        {t("plans.chip.cancelled")}
      </div>
    );
  }

  // Istisno vaqt/xona/o'qituvchini (o'rinbosar) almashtirishi mumkin; `null` — shablondagisi.
  const effectiveTeacher = exception?.teacher ?? template.teacher;
  const effectiveRoom = exception?.room ?? template.room;
  const teacherName = effectiveTeacher?.fullName;
  const isOwn =
    !!currentTeacherId && effectiveTeacher?.id === currentTeacherId;
  const isSubstitute = !!exception?.teacher;
  const startTime =
    exception?.startTime ?? session?.startTime ?? template.startTime;
  const endTime = exception?.endTime ?? session?.endTime ?? template.endTime;

  return (
    <div
      title={`${groupName}: ${session?.sessionType ? t(`sessions.type.${session.sessionType}`, { defaultValue: "" }) : ""}${session?.topic ? ` — ${session.topic}` : ""}`}
      className={`w-full space-y-0.5 rounded px-1.5 py-1 text-left text-[11px] font-medium ${
        exception
          ? "bg-gold/15 text-gold"
          : isOwn
            ? "bg-gold/25 text-forest-deep"
            : "bg-paper-soft text-ink-soft"
      }`}
    >
      {exception && (
        <div className="truncate font-semibold">
          {isSubstitute
            ? t("plans.chip.substitute")
            : t("calendarChip.changed")}
          {exception.note ? ` — ${exception.note}` : ""}
        </div>
      )}
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
        {effectiveRoom && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <DoorOpen size={11} className="shrink-0" />
            <span className="truncate">{effectiveRoom.name}</span>
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
