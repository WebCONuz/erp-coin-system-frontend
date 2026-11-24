import { DoorOpen, GraduationCap, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { subjectColor } from "@/lib/subject-color";
import type { ScheduleTemplate } from "../types";

interface Props {
  template: ScheduleTemplate;
  groupName: string;
  onEdit: () => void;
  onDelete: () => void;
  /** Sudrab olib borilayotgan nusxa (DragOverlay). */
  isOverlay?: boolean;
}

/**
 * Haftalik shablon kartasi. Rang — fan bo'yicha barqaror (chap chiziq),
 * fon neytral. Yorliqlar ("O'qituvchi:", "Xona:") o'rniga belgilar.
 */
export const TemplateCard = ({
  template,
  groupName,
  onEdit,
  onDelete,
  isOverlay,
}: Props) => {
  const { t } = useTranslation();
  const title = template.subject ? template.subject.name : groupName;
  const color = subjectColor(template.subject?.id ?? template.groupId);

  return (
    <div
      onClick={onEdit}
      style={{ borderLeftColor: color }}
      className={cn(
        "group relative cursor-pointer rounded-lg border border-l-[3px] bg-card p-2.5 transition-colors hover:bg-muted/40",
        isOverlay && "shadow-lg ring-2 ring-primary/30",
      )}
    >
      <div className="absolute top-1.5 right-1.5 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`${t("common.edit")}: ${title} ${template.startTime}`}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Pencil className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`${t("common.delete")}: ${title} ${template.startTime}`}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive-soft hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Trash2 className="size-3.5" aria-hidden />
        </button>
      </div>

      <p className="text-xs font-medium tabular-nums text-muted-foreground">
        {template.startTime} – {template.endTime}
      </p>
      <p className="mt-0.5 truncate pr-14 text-sm font-semibold">{title}</p>

      <dl className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
        {template.teacher && (
          <div className="flex min-w-0 items-center gap-1.5">
            <dt>
              <GraduationCap className="size-3.5" aria-hidden />
              <span className="sr-only">{t("common.teacher")}</span>
            </dt>
            <dd className="truncate">{template.teacher.fullName}</dd>
          </div>
        )}
        <div className="flex min-w-0 items-center gap-1.5">
          <dt>
            <DoorOpen className="size-3.5" aria-hidden />
            <span className="sr-only">{t("common.room")}</span>
          </dt>
          <dd className="truncate">{template.room.name}</dd>
        </div>
      </dl>
    </div>
  );
};
