import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, School, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { GroupCard } from "../ui";
import { useGroups } from "../../hooks";
import type { GroupItem } from "../../types";

interface Props {
  handleEdit: (group: GroupItem) => void;
  handleCreate: () => void;
}

const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

export const GroupGrid = ({ handleEdit, handleCreate }: Props) => {
  const { data: groups, isLoading, isError, refetch, isFetching } = useGroups();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const course = searchParams.get("course");
  const isFiltered =
    !!searchParams.get("search") ||
    !!searchParams.get("status") ||
    (!!course && course !== "all");

  if (isLoading) {
    return (
      <div aria-busy="true" className={GRID}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError && !groups) {
    return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
  }

  const list = groups?.data ?? [];

  if (!list.length) {
    return (
      <div className="rounded-2xl border bg-card">
        {isFiltered ? (
          <EmptyState
            icon={SearchX}
            title={t("groups.empty.filteredTitle")}
            description={t("groups.empty.filteredHint")}
          />
        ) : (
          <EmptyState
            icon={School}
            title={t("groups.no_data")}
            description={t("groups.empty.hint")}
            action={
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="size-4" aria-hidden />
                {t("groups.btn.create")}
              </Button>
            }
          />
        )}
      </div>
    );
  }

  return (
    <ul className={GRID}>
      {list.map((item) => (
        <li key={item.id}>
          <GroupCard data={item} handleEdit={handleEdit} />
        </li>
      ))}
    </ul>
  );
};
