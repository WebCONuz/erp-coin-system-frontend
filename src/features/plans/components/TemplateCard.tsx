import { Pencil, Trash } from "lucide-react";
import type { ScheduleTemplate } from "../types";

interface Props {
  template: ScheduleTemplate;
  groupName: string;
  roomName: string;
  colorClass: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const TemplateCard = ({
  template,
  groupName,
  roomName,
  colorClass,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div
      onClick={onEdit}
      className={`group relative cursor-pointer rounded-lg border-l-4 p-3 shadow-sm transition-all hover:shadow-md ${colorClass}`}
    >
      <div className="absolute top-2 right-2 flex gap-x-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-blue-500"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-red-500"
        >
          <Trash size={13} />
        </button>
      </div>
      <p className="pr-10 text-sm font-semibold text-foreground">{groupName}</p>
      <p className="text-xs text-muted-foreground mt-1">
        <b>Xona:</b> {roomName}
      </p>
      <p className="text-xs text-muted-foreground">
        <b>Vaqti:</b> {template.startTime} – {template.endTime}
      </p>
    </div>
  );
};
