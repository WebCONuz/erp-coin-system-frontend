import { Link } from "react-router-dom";
import { School } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/shared/panel";
import { EmptyState } from "@/components/shared/states";
import { GroupFillMeter } from "@/features/groups/components/ui";
import type { TeacherGroupDetail } from "../../types";

interface Props {
  groups: TeacherGroupDetail[];
}

/** O'qituvchi guruhlari — har biri guruh sahifasiga havola. */
export const TeacherGroupsSection = ({ groups }: Props) => {
  const { t } = useTranslation();

  return (
    <Panel
      title={
        groups.length
          ? t("teachers.groupsSection.title", { count: groups.length })
          : t("admin.header.groups")
      }
    >
      {!groups.length ? (
        <EmptyState
          size="sm"
          icon={School}
          title={t("teachers.groupsSection.empty")}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {groups.map((group) => (
            <li key={group.id}>
              <Link
                // `?groupId=` — guruh sahifasidagi sessiyalar filtri shuni o'qiydi.
                to={`/admin/groups/${group.id}?groupId=${group.id}`}
                className="group flex h-full flex-col gap-3 rounded-xl border p-3.5 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium group-hover:text-primary">
                    {group.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {group.course.title}
                  </p>
                </div>
                <GroupFillMeter
                  count={group._count.students}
                  max={group.maxStudents}
                  className="mt-auto"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};
