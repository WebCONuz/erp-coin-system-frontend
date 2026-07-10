import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/ustils";
import type { StudentDetail } from "../types";

interface Props {
  handleEdit: (student: StudentDetail) => void;
}

export const useStudentTable = ({ handleEdit }: Props) => {
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
        header: "F.I.Sh",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {row.original.fullName.charAt(0).toUpperCase()}
            </div>
            <span>{row.original.fullName}</span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Telefon",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {getValue<string | null>() ?? "Mavjud emas"}
          </span>
        ),
      },
      {
        accessorKey: "wallet",
        header: "Balans (coin)",
        cell: ({ row }) => (
          <span className="font-medium text-purple-600 dark:text-purple-400">
            {row.original.wallet?.balance ?? 0}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Qo'shilgan sana",
        cell: ({ getValue }) => formatDate(getValue<string>(), "dd.MM.yyyy"),
      },
      {
        accessorKey: "actions",
        header: "Amallar",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
              onClick={() => navigate(`/admin/students/${row.original.id}`)}
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [currentPage, handleEdit, navigate],
  );

  return { columns };
};
