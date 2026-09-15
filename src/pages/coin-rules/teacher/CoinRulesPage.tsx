import { useState } from "react";
import { Coins, Plus } from "lucide-react";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";
import { useCoinRules } from "@/features/coin-rules/hooks";
import { useMyTaughtGroups } from "@/features/teacher-profile/hooks";
import {
  TeacherCoinRuleCard,
  CreateCoinRuleModal,
} from "@/features/teacher-profile/components/coin-rules";

const CoinRulesPage = () => {
  const { data: rules, isLoading } = useCoinRules();
  const { data: groups } = useMyTaughtGroups();
  const pagination = usePagination({
    totalItems: rules?.meta?.total || 0,
    initialPageSize: 20,
  });
  const [createOpen, setCreateOpen] = useState(false);

  const groupNameById = new Map((groups ?? []).map((g) => [g.id, g.name]));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Tanga qoidalari
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Coin qanday ishlab topilishi va ayirilishi qoidalari
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-forest text-paper px-4 py-2.5 text-sm font-medium hover:bg-forest-light transition-colors"
        >
          <Plus size={16} />
          Yangi qoida
        </button>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : !rules?.data ? (
        <NoData text="Ma'lumotlar yuklanmadi!" />
      ) : !rules.data.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-ink/10 bg-white">
          <Coins size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">Qoidalar mavjud emas</p>
          <p className="text-xs text-ink-soft mt-1 max-w-xs">
            Hozircha hech qanday tanga qoidasi yaratilmagan.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {rules.data.map((rule) => (
              <TeacherCoinRuleCard
                key={rule.id}
                data={rule}
                groupName={
                  rule.groupId ? groupNameById.get(rule.groupId) : undefined
                }
              />
            ))}
          </div>

          {rules.meta.totalPages > 1 && (
            <TablePagination
              totalItems={rules.meta.total}
              currentPage={pagination.currentPage}
              totalPages={rules.meta.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
            />
          )}
        </>
      )}

      <CreateCoinRuleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
};

export default CoinRulesPage;
