import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import type { Group, Teacher } from "../types";
import { Archive, ArchiveRestore, Eye, KeyRound, Pencil } from "lucide-react";
import { formatDate } from "@/ustils";
import { Button } from "@/components/ui/button";

interface Props {
  onView?: (teacher: Teacher) => void;
  onEdit?: (teacher: Teacher) => void;
  onChangePassword?: (teacher: Teacher) => void;
  onArchive?: (teacher: Teacher) => void;
  onRestore?: (teacher: Teacher) => void;
}

export const useTable = ({
  onView,
  onEdit,
  onChangePassword,
  onArchive,
  onRestore,
}: Props) => {
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
        accessorKey: "taughtGroups",
        header: t("teachers.table.taught_groups"),
        cell: ({ getValue }) => {
          const groups = getValue<Group[]>();

          return (
            <div className="flex gap-1 flex-wrap max-w-150">
              {groups.map((item) => (
                <div
                  key={item.id}
                  className="py-1 px-2 border border-gray-300 dark:border-gray-700 text-gray-600 text-xs bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-sm"
                >
                  {item.name}
                </div>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Holat",
        cell: ({ getValue }) =>
          getValue<boolean>() ? (
            <span className="px-2 py-0.5 rounded-4xl text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              Faol
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-4xl text-xs bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
              Arxivlangan
            </span>
          ),
      },
      {
        accessorKey: "actions",
        header: t("teachers.table.actions"),
        cell: (info) => {
          const teacher = info.row.original as Teacher;

          return (
            <div className="flex gap-x-1.5">
              <Button
                onClick={() => onView?.(teacher)}
                variant="outline"
                className="border border-blue-300 rounded-md w-8 h-8 cursor-pointer hover:bg-blue-100"
              >
                <Eye className="text-blue-500" />
              </Button>
              <Button
                onClick={() => onEdit?.(teacher)}
                variant="outline"
                className="border border-emerald-500 rounded-md w-8 h-8 cursor-pointer hover:bg-emerald-100"
              >
                <Pencil className="text-emerald-600" />
              </Button>
              <Button
                onClick={() => onChangePassword?.(teacher)}
                variant="outline"
                className="border border-amber-300 rounded-md w-8 h-8 cursor-pointer hover:bg-amber-100"
              >
                <KeyRound className="text-amber-500" />
              </Button>
              {teacher.isActive ? (
                <Button
                  onClick={() => onArchive?.(teacher)}
                  variant="outline"
                  className="border border-red-300 rounded-md w-8 h-8 cursor-pointer hover:bg-red-100"
                >
                  <Archive className="text-red-500" />
                </Button>
              ) : (
                <Button
                  onClick={() => onRestore?.(teacher)}
                  variant="outline"
                  className="border border-gray-300 rounded-md w-8 h-8 cursor-pointer hover:bg-gray-100"
                >
                  <ArchiveRestore className="text-gray-500" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [t, currentPage, onView, onEdit, onChangePassword, onArchive, onRestore],
  );

  return { columns };
};
