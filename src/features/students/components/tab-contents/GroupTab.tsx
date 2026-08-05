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
  const { id } = useParams<{ id: string }>();
  const removeFromGroup = useRemoveStudentFromGroup(id ?? "");

  return (
    <TabsContent value="groups" className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Guruhlar ro'yxati ({student?.groups?.length ?? 0})
        </h3>
        {!isDeleted && (
          <Button
            size="sm"
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <UserPlus size={14} />
            Guruhga qo'shish
          </Button>
        )}
      </div>
      {!student?.groups?.length ? (
        <EmptyState
          icon={<Users size={20} />}
          title="Hech qanday guruhga a'zo emas"
          text={`${student?.fullName?.split(" ")?.[0]}ni faol guruhlardan biriga qo'shib, darslarga jalb qiling.`}
          actionLabel={!isDeleted ? "Guruhga qo'shish" : undefined}
        />
      ) : (
        <div className="space-y-2">
          {student.groups.map((g) => (
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
                    {g.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {g.course} · {g.teacher}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">
                  {formatDate(g.joinedAt, "dd.MM.yyyy")} dan
                </span>
                {!isDeleted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    disabled={removeFromGroup.isPending}
                    onClick={() => removeFromGroup.mutate({ groupId: g.id })}
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
