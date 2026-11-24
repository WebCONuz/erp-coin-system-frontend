import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/avatar";
import { CoinAmount } from "@/components/shared/coin";
import { formatDate } from "@/ustils";
import type { StudentDetail } from "../types";

interface Props {
  handleEdit: (student: StudentDetail) => void;
}

export const useStudentTable = ({ handleEdit }: Props) => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<StudentDetail>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: t("students.table.full_name"),
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex min-w-52 items-center gap-3">
              <UserAvatar name={s.fullName} url={s.avatarUrl} />
              <div className="min-w-0">
                <Link
                  to={`/admin/students/${s.id}`}
                  className="block truncate font-medium hover:text-primary hover:underline focus-visible:underline"
                >
                  {s.fullName}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  @{s.username}
                  {s.email ? `, ${s.email}` : ""}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: t("students.table.phone"),
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "wallet",
        header: t("students.table.balance"),
        cell: ({ row }) => (
          <CoinAmount
            value={row.original.wallet?.balance ?? 0}
            variant="pill"
            size="sm"
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: t("students.table.created_at"),
        cell: ({ getValue }) => (
          <span className="tabular-nums text-muted-foreground">
            {formatDate(getValue<string>(), "dd.MM.yyyy")}
          </span>
        ),
      },
      {
        accessorKey: "actions",
        header: () => <span className="sr-only">{t("students.table.actions")}</span>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
            >
              <Link
                to={`/admin/students/${row.original.id}`}
                aria-label={t("students.actions.view", {
                  name: row.original.fullName,
                })}
              >
                <Eye className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={() => handleEdit(row.original)}
              aria-label={t("students.actions.edit", {
                name: row.original.fullName,
              })}
            >
              <Pencil className="size-4" aria-hidden />
            </Button>
          </div>
        ),
      },
    ],
    [handleEdit, t],
  );

  return { columns };
};
