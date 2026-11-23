import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { formatDate } from "@/ustils";
import { AuditActionBadge } from "../components/AuditActionBadge";
import { AuditChangesPreview } from "../components/AuditChangesPreview";
import { AUDIT_LOGS_PAGE_SIZE, getAuditEntityLabel } from "../constants";
import type { AuditLog } from "../types";

export const useTable = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const columns = useMemo<ColumnDef<AuditLog>[]>(
    () => [
      {
        accessorKey: "id",
        header: "№",
        cell: ({ row }) =>
          ((currentPage - 1) * AUDIT_LOGS_PAGE_SIZE + row.index + 1).toString(),
      },
      {
        accessorKey: "createdAt",
        header: t("auditLogs.table.date"),
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap">
            {formatDate(getValue<string>(), "dd.MM.yyyy, HH:mm")}
          </span>
        ),
      },
      {
        accessorKey: "createdByUser",
        header: t("auditLogs.table.user"),
        cell: ({ row }) => {
          const user = row.original.createdByUser;
          if (!user) return <span className="text-muted-foreground">—</span>;
          return (
            <div className="min-w-36">
              <p className="font-medium">{user.fullName}</p>
              <p className="text-xs text-muted-foreground">{user.phone}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "actionType",
        header: t("auditLogs.table.action"),
        cell: ({ row }) => <AuditActionBadge action={row.original.actionType} />,
      },
      {
        accessorKey: "entityType",
        header: t("auditLogs.table.entity"),
        cell: ({ row }) => (
          <div className="min-w-32">
            <p className="font-medium">
              {getAuditEntityLabel(t, row.original.entityType)}
            </p>
            <p
              className="font-mono text-[11px] text-muted-foreground"
              title={row.original.entityId}
            >
              {row.original.entityId.slice(0, 8)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "changes",
        header: t("auditLogs.table.changes"),
        cell: ({ row }) => <AuditChangesPreview log={row.original} />,
      },
      {
        accessorKey: "ipAddress",
        header: t("auditLogs.table.device"),
        cell: ({ row }) => (
          <div className="max-w-48 text-xs text-muted-foreground">
            <p className="text-foreground">{row.original.ipAddress || "—"}</p>
            {row.original.userAgent && (
              <p className="truncate" title={row.original.userAgent}>
                {row.original.userAgent}
              </p>
            )}
          </div>
        ),
      },
    ],
    [t, currentPage],
  );

  return { columns };
};
