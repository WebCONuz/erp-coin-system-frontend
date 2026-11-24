import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PackageOpen } from "lucide-react";
import { CustomTable, TablePagination } from "@/components/shared/table";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PurchaseCard,
  PurchaseStatusModal,
  PurchasesDataFilter,
} from "@/features/purchases/components";
import { usePurchases, useTable } from "@/features/purchases/hooks";
import type {
  Purchase,
  PurchaseActionStatus,
} from "@/features/purchases/types";
import { usePagination } from "@/hooks";

const PurchasesPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const {
    data: purchases,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = usePurchases();

  const [action, setAction] = useState<{
    purchase: Purchase;
    status: PurchaseActionStatus;
  } | null>(null);

  const handleAction = useCallback(
    (purchase: Purchase, status: PurchaseActionStatus) =>
      setAction({ purchase, status }),
    [],
  );

  const { columns } = useTable({ onAction: handleAction });

  const pagination = usePagination({
    totalItems: purchases?.total || 0,
  });

  const isFiltered = searchParams.has("status") || searchParams.has("rewardId");
  const list = purchases?.data ?? [];

  const renderContent = () => {
    if (isError && !purchases) {
      return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
    }

    if (!isLoading && !list.length) {
      return (
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={PackageOpen}
            title={
              isFiltered
                ? t("purchases.empty.filteredTitle")
                : t("purchases.empty.title")
            }
            description={
              isFiltered
                ? t("purchases.empty.filteredHint")
                : t("purchases.empty.hint")
            }
          />
        </div>
      );
    }

    return (
      <>
        {/* Desktop/planshet: jadval */}
        <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
          <CustomTable
            data={list}
            columns={columns}
            className="border-0"
            loading={isLoading}
          />
        </div>

        {/* Mobil: kartalar */}
        <div className="space-y-3 md:hidden">
          {isLoading ? (
            <div aria-busy="true" className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {list.map((purchase) => (
                <li key={purchase.id}>
                  <PurchaseCard purchase={purchase} onAction={handleAction} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {!!purchases?.total && (
          <TablePagination
            totalItems={purchases.total}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <PurchasesDataFilter rewardTitle={purchases?.data[0]?.reward.title} />

      {renderContent()}

      <PurchaseStatusModal
        purchase={action?.purchase ?? null}
        status={action?.status ?? null}
        onClose={() => setAction(null)}
      />
    </div>
  );
};

export default PurchasesPage;
