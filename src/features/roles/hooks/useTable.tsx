import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Pencil, Trash } from "lucide-react";
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
  const { user } = useAuth();
  const canDeleteRoles =
    user?.role.name === ROLES.SUPER_ADMIN || user?.role.name === ROLES.CREATOR;

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      { accessorKey: "displayName", header: "Rol nomi" },
      { accessorKey: "name", header: "Kod" },
      { accessorKey: "level", header: "Daraja" },
      { accessorKey: "scope", header: "Scope" },
      {
        accessorKey: "isActive",
        header: "Holati",
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
              {value ? "Faol" : "Faol emas"}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Yaratilgan vaqti",
        cell: ({ getValue }) => formatDate(getValue<string>(), "dd.MM.yyyy"),
      },
      {
        accessorKey: "actions",
        header: "Amallar",
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
    [handleEdit, handleDelete, canDeleteRoles],
  );

  return {
    columns,
  };
};
