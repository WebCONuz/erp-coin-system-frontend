import { useState } from "react";
import { useTranslation } from "react-i18next";
import { History } from "lucide-react";
import { PageLoading } from "@/components/loading";
import { TablePagination } from "@/components/shared/table";
import { formatDate, isForbiddenError, translateApiError } from "@/ustils";
import { useAuditLogs } from "../hooks/useHook";
import { getAuditEntityLabel } from "../constants";
import { AuditActionBadge } from "./AuditActionBadge";
import { AuditChangesPreview } from "./AuditChangesPreview";

const PAGE_SIZE = 10;

interface Props {
  /** O'quvchi, xarid va h.k. ID'si — `GET /audit-logs?entityId=` */
  entityId: string;
  emptyText?: string;
}

/** Bitta entitet bo'yicha amallar tarixi (vaqt chizig'i ko'rinishida). */
export const EntityAuditHistory = ({ entityId, emptyText }: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useAuditLogs(
    { entityId, page: String(page), limit: String(PAGE_SIZE) },
    { enabled: !!entityId },
  );
  const logs = data?.data ?? [];

  if (isLoading) return <PageLoading />;

  if (isError) {
    return (
      <p className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {isForbiddenError(error)
          ? t("auditLogs.forbidden")
          : translateApiError(error, t)}
      </p>
    );
  }

  if (!logs.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 py-10 text-center">
        <History size={22} className="mb-2 text-zinc-400 dark:text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {emptyText ?? t("auditLogs.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ol className="relative space-y-3 border-l border-zinc-200 dark:border-zinc-800 pl-5">
        {logs.map((log) => (
          <li key={log.id} className="relative">
            <span className="absolute -left-[25px] top-4 h-2.5 w-2.5 rounded-full border-2 border-white bg-purple-500 dark:border-zinc-950" />
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <AuditActionBadge action={log.actionType} />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {getAuditEntityLabel(t, log.entityType)}
                </span>
                <span className="ml-auto text-xs text-zinc-400 whitespace-nowrap">
                  {formatDate(log.createdAt, "dd.MM.yyyy, HH:mm")}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {t("auditLogs.performedBy", {
                  name: log.createdByUser?.fullName ?? "—",
                })}
              </p>
              <div className="mt-2">
                <AuditChangesPreview log={log} />
              </div>
            </div>
          </li>
        ))}
      </ol>

      {data && data.meta.totalPages > 1 && (
        <TablePagination
          totalItems={data.meta.total}
          currentPage={page}
          totalPages={data.meta.totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
