import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GroupFillMeter } from "@/features/groups/components/ui";
import { subjectColor } from "@/lib/subject-color";
import { useIsAssignedGroup } from "../../hooks";
import type { TeacherGroupItem } from "../../types";
import { AssignedGroupBadge } from "./AssignedGroupBadge";

/** O'qituvchi guruhi kartasi — butun karta guruh sahifasiga havola. */
export const TeacherGroupCard = ({ data }: { data: TeacherGroupItem }) => {
  const { t } = useTranslation();
  const isAssignedGroup = useIsAssignedGroup();

  return (
    <Link
      to={`/teacher/groups/${data.id}`}
      style={{ borderLeftColor: subjectColor(data.id) }}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-l-4 bg-card p-4 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-heading text-lg font-semibold leading-snug group-hover:text-primary">
            {data.name}
          </h3>
          {!data.isActive && (
            <Badge variant="secondary">{t("common.inactive")}</Badge>
          )}
          {isAssignedGroup(data.teacher?.id) && <AssignedGroupBadge />}
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <BookOpen className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{data.course.title}</span>
        </p>
      </div>

      <GroupFillMeter
        count={data._count.students}
        max={data.maxStudents}
        className="mt-auto border-t pt-3"
      />
    </Link>
  );
};
