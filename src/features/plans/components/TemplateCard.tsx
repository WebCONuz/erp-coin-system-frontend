import { Clock3, DoorOpen, GraduationCap, Pencil, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ScheduleTemplate } from "../types";

interface Props {
  template: ScheduleTemplate;
  groupName: string;
  colorClass: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const TemplateCard = ({
  template,
  groupName,
  colorClass,
  onEdit,
  onDelete,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={onEdit}
      className={`group relative cursor-pointer rounded-lg border-l-4 p-2 shadow-sm transition-all hover:shadow-md ${colorClass}`}
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
      <p className="pr-10 text-sm font-semibold text-foreground">
        {template.subject ? template.subject.name : groupName}
      </p>

      {template.teacher && (
        <p className="text-xs text-muted-foreground flex items-center gap-x-1 mt-1">
          <GraduationCap size={12} /> <b>{t("common.teacher")}:</b>{" "}
          {template.teacher.fullName}
        </p>
      )}
      <p className="text-xs text-muted-foreground flex items-center gap-x-1">
        <DoorOpen size={12} /> <b>{t("common.room")}:</b> "{template.room.name}
        "
      </p>
      <p className="text-xs text-muted-foreground flex items-center gap-x-1">
        <Clock3 size={12} /> <b>{t("plans.card.timePrefix")}</b>
        {template.startTime} – {template.endTime}
      </p>
    </div>
  );
};
