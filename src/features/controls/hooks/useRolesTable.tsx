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
                  ? "border-primary text-primary bg-primary/20"
                  : "border-gray-600 text-gray-600 bg-background"
              } border py-1 px-2 rounded-xl text-sm`}
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
    [t]
  );

  return {
    columns,
  };
};
