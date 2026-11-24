import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, GraduationCap, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/ustils";
import type { GroupItem } from "../../types";
import { GroupFillMeter } from "./GroupFillMeter";

interface Props {
  data: GroupItem;
  handleEdit: (group: GroupItem) => void;
}

/**
 * Guruh kartasi: butun karta — tafsilotga havola, tahrirlash alohida tugma.
 * (Avvalgi o'chirish ikonkasi hech narsa qilmasdi — backendda endpoint yo'q.)
 */
export const GroupCard = ({ data, handleEdit }: Props) => {
  const { t } = useTranslation();

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border bg-card transition-colors hover:border-primary/40">
      <Link
        // `?groupId=` — tafsilot sahifasidagi sessiyalar filtri shuni o'qiydi.
        to={`/admin/groups/${data.id}?groupId=${data.id}`}
        className="flex flex-1 flex-col gap-4 rounded-2xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <div className="min-w-0 pr-9">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-heading text-lg font-semibold leading-snug group-hover:text-primary">
              {data.name}
            </h3>
            {!data.isActive && (
              <Badge variant="secondary">{t("groups.card.inactive")}</Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("groups.info.created_at")}{" "}
            <span className="tabular-nums">
              {formatDate(data.createdAt, "dd.MM.yyyy")}
            </span>
          </p>
        </div>

        <dl className="space-y-1.5 text-sm">
          <div className="flex min-w-0 items-center gap-2">
            <dt>
              <BookOpen className="size-4 text-muted-foreground" aria-hidden />
              <span className="sr-only">{t("groups.info.course")}</span>
            </dt>
            <dd className="truncate">{data.course?.title ?? "—"}</dd>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <dt>
              <GraduationCap
                className="size-4 text-muted-foreground"
                aria-hidden
              />
              <span className="sr-only">{t("common.teacher")}</span>
            </dt>
            <dd className="truncate">{data.teacher?.fullName ?? "—"}</dd>
          </div>
        </dl>

        <GroupFillMeter
          count={data._count?.students ?? 0}
          max={data.maxStudents}
          className="mt-auto border-t pt-3"
        />
      </Link>

      <button
        type="button"
        onClick={() => handleEdit(data)}
        aria-label={t("groups.form.edit_title") + ": " + data.name}
        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Pencil className="size-4" aria-hidden />
      </button>
    </article>
  );
};
