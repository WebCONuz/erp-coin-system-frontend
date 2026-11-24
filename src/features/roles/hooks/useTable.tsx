import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/ustils";
import { Badge } from "@/components/ui/badge";
import type { Role } from "../types";

export const useRoleTable = () => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      { accessorKey: "displayName", header: t("roles.table.displayName") },
      {
        accessorKey: "name",
        header: t("roles.table.code"),
        cell: ({ getValue }) => (
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            {getValue<string>()}
          </code>
        ),
      },
      {
        accessorKey: "level",
        header: t("roles.table.level"),
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<number>()}</span>
        ),
      },
      { accessorKey: "scope", header: t("roles.table.scope") },
      {
        accessorKey: "isActive",
        header: t("common.status"),
        cell: ({ getValue }) => {
          const value = getValue<boolean>();
          return (
            <Badge variant={value ? "success" : "secondary"}>
              {value ? t("roles.table.active") : t("roles.table.inactive")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: t("roles.table.createdAt"),
        cell: ({ getValue }) => formatDate(getValue<string>(), "dd.MM.yyyy"),
      },
    ],
    [t],
  );

  return {
    columns,
  };
};
