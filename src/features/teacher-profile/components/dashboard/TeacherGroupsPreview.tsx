import { Link } from "react-router-dom";
import { ChevronRight, UsersRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/shared/panel";
import type { TeacherDashboardGroup } from "../../types";

/** O'qituvchi guruhlari — qisqa ko'rinish. */
export const TeacherGroupsPreview = ({
  groups,
}: {
  groups: TeacherDashboardGroup[];
}) => {
  const { t } = useTranslation();

  if (!groups.length) return null;

  return (
    <Panel
      title={t("teacherProfile.groups.title")}
      action={
        <Link
          to="/teacher/groups"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("common.all")}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      }
    >
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {groups.map((group) => (
          <li key={group.id}>
            <Link
              to={`/teacher/groups/${group.id}`}
              className="flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {group.name}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {group.course.title}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-sm tabular-nums text-muted-foreground">
                <UsersRound className="size-4" aria-hidden />
                {group._count.students}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
};
