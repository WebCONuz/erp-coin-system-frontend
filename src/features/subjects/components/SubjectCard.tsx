import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { subjectColor } from "@/lib/subject-color";
import type { Subject } from "../types";

interface Props {
  data: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

/**
 * Fan kartasi. Chap chiziq rangi dars jadvalidagi rang bilan bir xil
 * (fan `id`si bo'yicha) — fan qaysi rangda ko'rinishini shu yerda ko'rish mumkin.
 */
export const SubjectCard = ({ data, onEdit, onDelete }: Props) => {
  const { t } = useTranslation();

  return (
    <article
      style={{ borderLeftColor: subjectColor(data.id) }}
      className="relative flex h-full flex-col gap-1.5 rounded-2xl border border-l-4 bg-card p-4"
    >
      <div className="absolute top-2.5 right-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`${t("common.actions")}: ${data.name}`}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(data)}>
              <Pencil className="size-4" aria-hidden />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(data)}
            >
              <Trash2 className="size-4" aria-hidden />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-2 pr-9">
        <h3 className="truncate font-heading text-base font-semibold">
          {data.name}
        </h3>
        {!data.isActive && (
          <Badge variant="secondary">{t("subjects.inactive")}</Badge>
        )}
      </div>

      {data.description ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {data.description}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground/60">
          {t("subjects.noDescription")}
        </p>
      )}
    </article>
  );
};
