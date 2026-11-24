import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, School, Trash2, Users } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/ustils";
import { EmptyState } from "../ui";
import { useRemoveStudentFromGroup } from "../../hooks";
import type { StudentDetailFull } from "../../types";

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
  const memberships = student?.groupMemberships ?? [];

  return (
    <TabsContent value="groups" className="mt-4 space-y-3">
      <h3 className="font-heading text-base font-semibold">
        {t("students.groupTab.title", { count: memberships.length })}
      </h3>

      {!memberships.length ? (
        <EmptyState
          icon={<Users size={20} />}
          title={t("students.groupTab.emptyTitle")}
          text={t("students.groupTab.emptyText", {
            name: student?.fullName?.split(" ")?.[0],
          })}
        />
      ) : (
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
          {memberships.map((g) => (
            <li key={g.id} className="flex items-center gap-2 pr-2">
              <Link
                // `?groupId=` — guruh sahifasidagi sessiyalar filtri shuni o'qiydi.
                to={`/admin/groups/${g?.group?.id}?groupId=${g?.group?.id}`}
                className="group flex min-w-0 flex-1 items-center gap-3 px-4 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <School className="size-4.5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:text-primary">
                    {g?.group?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[g?.group?.course?.title, g?.group?.teacher?.fullName]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {t("students.groupTab.joinedSince", {
                      date: formatDate(g.joinedAt, "dd.MM.yyyy"),
                    })}
                  </p>
                </div>
                <span className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block">
                  {t("students.groupTab.joinedSince", {
                    date: formatDate(g.joinedAt, "dd.MM.yyyy"),
                  })}
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
              {!isDeleted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
                  disabled={removeFromGroup.isPending}
                  onClick={() =>
                    removeFromGroup.mutate({ groupId: g?.group?.id })
                  }
                  aria-label={t("students.groupTab.removeFrom", {
                    group: g?.group?.name,
                  })}
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </TabsContent>
  );
};
