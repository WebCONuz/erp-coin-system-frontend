import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Pencil, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/ustils";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { ROLES } from "@/assets/constants";
import type { Role } from "../types";

interface Props {
  handleEdit: (role: Role) => void;
  handleDelete: (role: Role) => void;
}

export const useRoleTable = ({ handleEdit, handleDelete }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canDeleteRoles =
    user?.role.name === ROLES.SUPER_ADMIN || user?.role.name === ROLES.CREATOR;

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
      {
        accessorKey: "actions",
        header: t("common.actions"),
        cell: ({ row }) => (
          <div className="flex gap-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil size={16} />
            </Button>
            {canDeleteRoles && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500"
                disabled={!row.original.canDelete}
                onClick={() => handleDelete(row.original)}
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete, canDeleteRoles, t],
  );

  return {
    columns,
  };
};
