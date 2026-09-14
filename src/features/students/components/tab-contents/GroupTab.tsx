import { useTranslation } from "react-i18next";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../ui";
import { Trash2, UserPlus, Users } from "lucide-react";
import type { StudentDetailFull } from "../../types";
import { formatDate } from "@/ustils";
import { Button } from "@/components/ui/button";
import { useRemoveStudentFromGroup } from "../../hooks";
import { useParams } from "react-router-dom";

export const GroupTab = ({
  student,
  isDeleted,
}: {
  student?: StudentDetailFull;
  isDeleted: boolean;
}) => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const removeFromGroup = useRemoveStudentFromGroup(id ?? "");

  return (
    <TabsContent value="groups" className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t("students.groupTab.title", {
            count: student?.groupMemberships?.length ?? 0,
          })}
        </h3>
        {!isDeleted && (
          <Button
            size="sm"
            className="gap-2 bg-linear-to-br from-purple-500 to-purple-700 h-10 px-4 text-white"
          >
            <UserPlus size={14} />
            {t("students.detail.addToGroup")}
          </Button>
        )}
      </div>
      {!student?.groupMemberships?.length ? (
        <EmptyState
          icon={<Users size={20} />}
          title={t("students.groupTab.emptyTitle")}
          text={t("students.groupTab.emptyText", {
            name: student?.fullName?.split(" ")?.[0],
          })}
          actionLabel={!isDeleted ? t("students.detail.addToGroup") : undefined}
        />
      ) : (
        <div className="space-y-2">
          {student.groupMemberships.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <Users
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {g?.group?.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {g?.group?.course?.title} · {g?.group?.teacher?.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">
                  {t("students.groupTab.joinedSince", {
                    date: formatDate(g.joinedAt, "dd.MM.yyyy"),
                  })}
                </span>
                {!isDeleted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    disabled={removeFromGroup.isPending}
                    onClick={() =>
                      removeFromGroup.mutate({ groupId: g?.group?.id })
                    }
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};
