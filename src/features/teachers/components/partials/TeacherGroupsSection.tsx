import { UsersRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TeacherGroupDetail } from "../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  groups: TeacherGroupDetail[];
}

export const TeacherGroupsSection = ({ groups }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!groups.length) {
    return (
      <div className="rounded-2xl bg-background p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">
          {t("admin.header.groups")}
        </h3>
        <p className="py-6 text-center text-sm text-muted-foreground">
          {t("teachers.groupsSection.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        {t("teachers.groupsSection.title", { count: groups.length })}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => navigate(`/admin/groups/${group.id}`)}
            className={`border rounded-xl p-3 ${group._count.students > 0 ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500/20" : "bg-amber-50 dark:bg-amber-950/50 border-amber-500/20"}`}
          >
            <p className="font-medium">{group.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {group.course.title}
            </p>
            <div
              className={`flex items-center gap-1.5 text-xs mt-2 font-medium ${group._count.students > 0 ? "text-emerald-500" : "text-amber-500"}`}
            >
              <UsersRound size={13} />
              {t("teachers.groupsSection.studentsCount", {
                count: group._count.students,
                max: group.maxStudents,
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
