import { useState } from "react";
import { useTranslation } from "react-i18next";
import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/shared/states";
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

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        description={
          isForbiddenError(error)
            ? t("auditLogs.forbidden")
            : translateApiError(error, t)
        }
      />
    );
  }

  if (!logs.length) {
    return (
      <div className="rounded-2xl border bg-card">
        <EmptyState icon={History} title={emptyText ?? t("auditLogs.empty")} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ol className="relative space-y-3 border-l pl-5">
        {logs.map((log) => (
          <li key={log.id} className="relative">
            <span
              aria-hidden
              className="absolute top-4 -left-[25px] size-2.5 rounded-full bg-primary ring-4 ring-background"
            />
            <div className="rounded-xl border bg-card p-3">
              <div className="flex flex-wrap items-center gap-2">
                <AuditActionBadge action={log.actionType} />
                <span className="text-sm font-medium">
                  {getAuditEntityLabel(t, log.entityType)}
                </span>
                <span className="ml-auto whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                  {formatDate(log.createdAt, "dd.MM.yyyy, HH:mm")}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
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
