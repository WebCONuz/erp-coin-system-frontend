import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/ustils";
import type { StudentDetail } from "../types";

interface Props {
  handleEdit: (student: StudentDetail) => void;
}

export const useStudentTable = ({ handleEdit }: Props) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = Number(searchParams.get("page")) || 1;

  const columns = useMemo<ColumnDef<StudentDetail>[]>(
    () => [
      {
        accessorKey: "id",
        header: "№",
        cell: ({ row }) => ((currentPage - 1) * 10 + row.index + 1).toString(),
      },
      {
        accessorKey: "fullName",
        header: t("students.table.full_name"),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {row.original.fullName.charAt(0).toUpperCase()}
            </div>
            <span>{row.original.fullName}</span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: t("students.table.phone"),
      },
      {
        accessorKey: "email",
        header: t("students.table.email"),
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {getValue<string | null>() ?? t("students.table.email_empty")}
          </span>
        ),
      },
      {
        accessorKey: "wallet",
        header: t("students.table.balance"),
        cell: ({ row }) => (
          <span className="font-medium text-purple-600 dark:text-purple-400">
            {row.original.wallet?.balance ?? 0}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: t("students.table.created_at"),
        cell: ({ getValue }) => formatDate(getValue<string>(), "dd.MM.yyyy"),
      },
      {
        accessorKey: "actions",
        header: t("students.table.actions"),
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
              onClick={() => navigate(`/admin/students/${row.original.id}`)}
            >
              <Eye size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil size={18} />
            </Button>
          </div>
        ),
      },
    ],
    [currentPage, handleEdit, navigate, t],
  );

  return { columns };
};
