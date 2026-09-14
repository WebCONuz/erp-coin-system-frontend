import {
  BookOpen,
  Check,
  Clock3,
  DoorOpen,
  GraduationCap,
  Pencil,
} from "lucide-react";
import type { CalendarDayEntry } from "../types";

interface Props {
  entry: CalendarDayEntry;
  onClick: () => void;
  hasAction?: boolean;
  colorClass: string;
}

export const SessionChip = ({
  entry,
  onClick,
  hasAction = true,
  colorClass,
}: Props) => {
  const { template, exception, session } = entry;
  const isLocked = session?.isLocked ?? false;
  const topic = session?.topic;
  const subjectName = session?.subject?.name ?? template?.subject?.name;
  const teacherName = template?.teacher?.fullName;

  if (exception?.isCancelled) {
    return (
      <button
        onClick={onClick}
        className="w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-red-700 bg-red-100 dark:bg-red-950/50 dark:text-red-400"
      >
        <span className="line-through">
          <b>Xona:</b> {template?.room?.name ?? "-"} -{" "}
          {`${exception.startTime ?? template.startTime} : ${exception?.endTime ?? template.endTime}`}
        </span>
        <br />
        Bekor qilindi
        {exception.note ? `: ${exception.note}` : ": Texnik sababga ko'ra"}
      </button>
    );
  }

  if (exception) {
    return (
      <button
        onClick={hasAction ? onClick : () => {}}
        className="flex w-full items-center justify-between gap-1 truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-amber-700 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400"
      >
        <span>
          <b>Xona:</b> {template?.room?.name ?? "-"} <br />
          <b>Yangi vaqti:</b> {exception.startTime} : {exception?.endTime}
          <br />
          <b>Sabab: </b>
          {exception.note ? `${exception.note}` : ": Texnik sababga ko'ra"}
        </span>
        <br />
        {topic ? ` ${topic}` : ""}
        <Pencil size={10} className="shrink-0" />
      </button>
    );
  }

  if (isLocked) {
    return (
      <button
        onClick={hasAction ? onClick : () => {}}
        className="flex w-full items-center gap-1 truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
      >
        <Check size={10} className="shrink-0" />
        Qulflangan
      </button>
    );
  }

  return (
    <button
      onClick={hasAction ? onClick : () => {}}
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
        <span className="inline-flex min-w-0 items-center gap-1">
          <DoorOpen size={11} className="shrink-0" />
          <span className="truncate">{template?.room?.name ?? "-"}</span>
        </span>
        <span className="inline-flex min-w-0 items-center gap-1">
          <Clock3 size={11} className="shrink-0" />
          <span className="truncate">
            {template.startTime} - {template.endTime}
          </span>
        </span>
      </div>

      {topic && <div className="truncate">{topic}</div>}
    </button>
  );
};
