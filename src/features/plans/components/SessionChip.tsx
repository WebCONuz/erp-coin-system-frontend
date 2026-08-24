import { Check, Pencil } from "lucide-react";
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
  const { template, exception, sessions } = entry;
  const isLocked = sessions.some((s) => s.isLocked);
  const topic = sessions.find((s) => s.topic)?.topic;

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
      className={`w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium ${colorClass}`}
    >
      <b>Xona:</b> {template?.room?.name ?? "-"}
      <br />
      <b>Vaqti:</b> {`${template.startTime} : ${template.endTime}`}
      <br />
      {topic ? (
        <>
          <b>Vaqti:</b> <span>{topic}</span>
        </>
      ) : (
        ""
      )}
    </button>
  );
};
