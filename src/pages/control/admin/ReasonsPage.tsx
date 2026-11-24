import { translateApiError } from "@/ustils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  CoinRuleDataFilter,
  CoinRuleCard,
  CoinRuleFormModal,
} from "@/features/coin-rules/components";
import {
  useActiveGroups,
  useCoinRules,
  useDeleteCoinRule,
} from "@/features/coin-rules/hooks";
import type { CoinRule } from "@/features/coin-rules/types";
import { useSearchParams } from "react-router-dom";
import { Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardGrid } from "@/components/shared/card-grid";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";

const ReasonsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { data: coinRules, isLoading, isError, refetch, isFetching } =
    useCoinRules();
  const direction = searchParams.get("direction");
  const isFiltered =
    !!searchParams.get("search") || (!!direction && direction !== "all");
  const { data: groupsData } = useActiveGroups();
  const pagination = usePagination({ totalItems: coinRules?.meta?.total || 0 });

  const deleteCoinRule = useDeleteCoinRule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CoinRule | null>(null);

  const groupNameById = useMemo(() => {
    const map = new Map<string, string>();
    (groupsData?.data ?? []).forEach((group) => map.set(group.id, group.name));
    return map;
  }, [groupsData]);

  const handleCreate = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rule: CoinRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingRule(null);
  };

  const handleDelete = (rule: CoinRule) => {
    if (!window.confirm(t("reasons.deleteConfirm", { name: rule.name })))
      return;

    deleteCoinRule.mutate(rule.id, {
      onError: (error: unknown) =>
        toast.error(translateApiError(error, t)),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <CoinRuleDataFilter onAdd={handleCreate} />

      <CardGrid
        items={coinRules?.data}
        getKey={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        isFiltered={isFiltered}
        emptyIcon={Scale}
        emptyTitle={t("reasons.noData")}
        emptyHint={t("reasons.emptyHint")}
        emptyAction={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="size-4" aria-hidden />
            {t("reasons.addReason")}
          </Button>
        }
        renderItem={(item) => (
          <CoinRuleCard
            data={item}
            groupName={
              item.groupId ? groupNameById.get(item.groupId) : undefined
            }
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      />

      {!!coinRules?.meta.total && (
        <TablePagination
          totalItems={coinRules.meta.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}

      <CoinRuleFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingRule ? "edit" : "create"}
        coinRule={editingRule ?? undefined}
      />
    </div>
  );
};

export default ReasonsPage;
