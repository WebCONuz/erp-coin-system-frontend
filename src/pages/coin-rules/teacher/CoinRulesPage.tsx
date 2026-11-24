import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardGrid } from "@/components/shared/card-grid";
import { ListToolbar } from "@/components/shared/toolbar";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";
import { useCoinRules } from "@/features/coin-rules/hooks";
import { useMyTaughtGroups } from "@/features/teacher-profile/hooks";
import {
  TeacherCoinRuleCard,
  CreateCoinRuleModal,
} from "@/features/teacher-profile/components/coin-rules";

const CoinRulesPage = () => {
  const { t } = useTranslation();
  const { data: rules, isLoading, isError, refetch, isFetching } =
    useCoinRules();
  const { data: groups } = useMyTaughtGroups();
  const pagination = usePagination({
    totalItems: rules?.meta?.total || 0,
    initialPageSize: 20,
  });
  const [createOpen, setCreateOpen] = useState(false);

  const groupNameById = new Map((groups ?? []).map((g) => [g.id, g.name]));

  return (
    <div className="space-y-4 sm:space-y-5">
      <ListToolbar
        title={t("teacherProfile.coinRules.title")}
        description={t("teacherProfile.coinRules.subtitle")}
        addLabel={t("teacherProfile.coinRules.newRule")}
        onAdd={() => setCreateOpen(true)}
      />

      <CardGrid
        items={rules?.data}
        getKey={(rule) => rule.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        emptyIcon={Scale}
        emptyTitle={t("teacherProfile.coinRules.emptyTitle")}
        emptyHint={t("teacherProfile.coinRules.emptyText")}
        emptyAction={
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="size-4" aria-hidden />
            {t("teacherProfile.coinRules.newRule")}
          </Button>
        }
        renderItem={(rule) => (
          <TeacherCoinRuleCard
            data={rule}
            groupName={
              rule.groupId ? groupNameById.get(rule.groupId) : undefined
            }
          />
        )}
      />

      {!!rules && rules.meta.totalPages > 1 && (
        <TablePagination
          totalItems={rules.meta.total}
          currentPage={pagination.currentPage}
          totalPages={rules.meta.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}

      <CreateCoinRuleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
};

export default CoinRulesPage;
