import { useCallback, useState } from "react";
import { CustomTable, TablePagination } from "@/components/shared/table";
import {
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
  const { data: purchases, isLoading } = usePurchases();

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

  return (
    <>
      <PurchasesDataFilter />

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-900">
        <CustomTable
          data={purchases?.data ?? []}
          columns={columns}
          bodyClass="px-4 py-4"
          className="border-0"
          loading={isLoading}
        />
      </div>

      {!!purchases?.total && purchases.total > 0 && (
        <TablePagination
          totalItems={purchases.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}

      <PurchaseStatusModal
        purchase={action?.purchase ?? null}
        status={action?.status ?? null}
        onClose={() => setAction(null)}
      />
    </>
  );
};

export default PurchasesPage;
