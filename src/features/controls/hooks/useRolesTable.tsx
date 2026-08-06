import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import type { Role } from "../models";
import { useTranslation } from "react-i18next";
import { Pencil, Trash } from "lucide-react";

export const useRoleTable = () => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      { accessorKey: "name", header: "Rol nomi" },
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
              {value ? "Active" : "No-active"}
            </span>
          );
        },
      },
      { accessorKey: "createdAt", header: "Yaratilgan vaqti" },
      {
        accessorKey: "actions",
        header: "Amallar",
        cell: () => {
          return (
            <div className="flex gap-x-4">
              <Pencil size="17" className="text-green-600 cursor-pointer" />
              <Trash size="17" className="text-red-600 cursor-pointer" />
            </div>
          );
        },
      },
    ],
    [t],
  );

  return {
    columns,
  };
};
