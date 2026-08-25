import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";

const ReasonsPage = () => {
  const { data: coinRules, isLoading } = useCoinRules();
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
    if (!window.confirm(`"${rule.name}" sababini o'chirishni tasdiqlaysizmi?`))
      return;

    deleteCoinRule.mutate(rule.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  return (
    <div className="space-y-4">
      <CoinRuleDataFilter onAdd={handleCreate} />

      {isLoading ? (
        <PageLoading />
      ) : coinRules?.data ? (
        <>
          {coinRules.data.length === 0 ? (
            <NoDataBox
              title="Hali sabablar mavjud emas!"
              btnText="Sabab qo'shish"
              btnFn={handleCreate}
              hasAction={false}
            />
          ) : (
            <div className="grid grid-cols-4 gap-5">
              {coinRules.data.map((item) => (
                <CoinRuleCard
                  data={item}
                  key={item.id}
                  groupName={item.groupId ? groupNameById.get(item.groupId) : undefined}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {coinRules.meta.total > 0 && (
            <TablePagination
              totalItems={coinRules.meta.total}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
            />
          )}
        </>
      ) : (
        <NoData text="Ma'lumotlar yuklanmadi!" />
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
