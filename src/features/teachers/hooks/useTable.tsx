import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import type { Group, Teacher } from "../types";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/ustils";

interface Props {
  handleRowClick?: (teacher: Teacher) => void;
}

export const useTable = ({ handleRowClick }: Props) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const columns = useMemo<ColumnDef<Teacher>[]>(
    () => [
      {
        accessorKey: "id",
        header: "№",
        cell: ({ row }) => ((currentPage - 1) * 10 + row.index + 1).toString(),
      },
      {
        accessorKey: "fullName",
        header: t("teachers.table.full_name"),
      },
      {
        accessorKey: "phone",
        header: t("teachers.table.phone"),
      },
      {
        accessorKey: "email",
        header: t("teachers.table.email"),
        cell: ({ getValue }) => {
          return (
            <>
              {getValue<string>() ? String(getValue<string>()) : "Mavjud emas"}
            </>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: t("teachers.table.created_at"),
        cell: ({ getValue }) => {
          return (
            <>
              {getValue<string>()
                ? formatDate(getValue<string>(), "dd.MM.yyyy, hh:mm")
                : "-"}
            </>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: t("teachers.table.updated_at"),
        cell: ({ getValue }) => {
          return (
            <>
              {getValue<string>()
                ? formatDate(getValue<string>(), "dd.MM.yyyy, hh:mm")
                : "-"}
            </>
          );
        },
      },
      {
        accessorKey: "taughtGroups",
        header: t("teachers.table.taught_groups"),
        cell: ({ getValue }) => {
          const groups = getValue<Group[]>();

          return (
            <div className="flex gap-x-3 flex-wrap max-w-100">
              {groups.map((item) => (
                <div className="py-1 px-2 border border-gray-300 dark:border-gray-700 text-gray-600 text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-sm">
                  {item.name}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "actions",
        header: t("teachers.table.actions"),
        cell: (info) => {
          return (
            <div className="flex gap-1">
              <Button
                onClick={
                  handleRowClick &&
                  (() => handleRowClick(info.row.original as Teacher))
                }
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-green-600"
              >
                <Eye size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-500"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          );
        },
      },
    ],
    [t, handleRowClick, currentPage],
  );

  return { columns };
};
