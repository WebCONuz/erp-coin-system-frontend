import { useTranslation } from "react-i18next";
import { CustomTable, TablePagination } from "@/components/shared/table";
import { AuditLogsDataFilter } from "@/features/audit-logs/components";
import { useAuditLogs, useTable } from "@/features/audit-logs/hooks";
import { AUDIT_LOGS_PAGE_SIZE } from "@/features/audit-logs/constants";
import { usePagination } from "@/hooks";
import { isForbiddenError, translateApiError } from "@/ustils";

const AuditLogsPage = () => {
  const { t } = useTranslation();
  const { data: logs, isLoading, isError, error } = useAuditLogs();
  const { columns } = useTable();

  const pagination = usePagination({
    initialPageSize: AUDIT_LOGS_PAGE_SIZE,
    totalItems: logs?.meta.total || 0,
  });

  return (
    <>
      <AuditLogsDataFilter />

      {isError ? (
        <p className="rounded-lg border border-gray-200 dark:border-gray-900 p-8 text-center text-sm text-muted-foreground">
          {isForbiddenError(error)
            ? t("auditLogs.forbidden")
            : translateApiError(error, t)}
        </p>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-900">
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
    </>
  );
};

export default AuditLogsPage;
