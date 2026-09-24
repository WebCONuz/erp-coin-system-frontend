import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/ustils";
import type { Role } from "../types";

export const useRoleTable = () => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      { accessorKey: "displayName", header: t("roles.table.displayName") },
      { accessorKey: "name", header: t("roles.table.code") },
      { accessorKey: "level", header: t("roles.table.level") },
      { accessorKey: "scope", header: t("roles.table.scope") },
      {
        accessorKey: "isActive",
        header: t("common.status"),
        cell: ({ getValue }) => {
          const value = getValue<boolean>();
          return (
            <span
              className={`${
                value
                  ? "bg-linear-to-br from-emerald-600 to-emerald-800"
                  : "bg-linear-to-br from-red-600 to-red-800"
              } py-1 px-3 rounded-xl text-sm text-white`}
            >
              {value ? t("roles.table.active") : t("roles.table.inactive")}
            </span>
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
