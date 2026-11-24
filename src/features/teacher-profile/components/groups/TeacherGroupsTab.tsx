import { useTranslation } from "react-i18next";
import { UsersRound } from "lucide-react";
import { CardGrid } from "@/components/shared/card-grid";
import { useMyTaughtGroups } from "../../hooks";
import { TeacherGroupCard } from "./TeacherGroupCard";

export const TeacherGroupsTab = () => {
  const { t } = useTranslation();
  const { data: groups, isLoading, isError, refetch, isFetching } =
    useMyTaughtGroups();

  return (
    <CardGrid
      items={groups}
      getKey={(group) => group.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      isRetrying={isFetching}
      skeletonClassName="h-40"
      emptyIcon={UsersRound}
      emptyTitle={t("teacherProfile.groups.emptyTitle")}
      emptyHint={t("teacherProfile.groups.emptyDescription")}
      renderItem={(group) => <TeacherGroupCard data={group} />}
    />
  );
};
