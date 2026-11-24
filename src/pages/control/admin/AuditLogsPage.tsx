import { useTranslation } from "react-i18next";
import { CustomTable, TablePagination } from "@/components/shared/table";
import { AuditLogsDataFilter } from "@/features/audit-logs/components";
import { useAuditLogs, useTable } from "@/features/audit-logs/hooks";
import { AUDIT_LOGS_PAGE_SIZE } from "@/features/audit-logs/constants";
import { usePagination } from "@/hooks";
import { ErrorState } from "@/components/shared/states";
import { isForbiddenError, translateApiError } from "@/ustils";

const AuditLogsPage = () => {
  const { t } = useTranslation();
  const {
    data: logs,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useAuditLogs();
  const { columns } = useTable();

  const pagination = usePagination({
    initialPageSize: AUDIT_LOGS_PAGE_SIZE,
    totalItems: logs?.meta.total || 0,
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <AuditLogsDataFilter
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {isError ? (
        <ErrorState
          description={
            isForbiddenError(error)
              ? t("auditLogs.forbidden")
              : translateApiError(error, t)
          }
          onRetry={isForbiddenError(error) ? undefined : () => refetch()}
          isRetrying={isFetching}
        />
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border bg-card">
          <CustomTable
            data={logs?.data ?? []}
            columns={columns}
            bodyClass="px-4 py-3 align-top"
            className="border-0"
            loading={isLoading}
          />
        </div>
      )}

      {!!logs?.meta.total && (
        <TablePagination
          totalItems={logs.meta.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}
    </div>
  );
};

export default AuditLogsPage;
