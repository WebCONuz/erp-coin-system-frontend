import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/avatar";
import { formatDate } from "@/ustils";
import { TeacherGroupChips } from "../components/TeacherGroupChips";
import {
  TeacherRowActions,
  type TeacherRowHandlers,
} from "../components/TeacherRowActions";
import { teacherProfilePath } from "../constants";
import type { Group, Teacher } from "../types";

export const useTable = ({
  onEdit,
  onChangePassword,
  onArchive,
  onRestore,
}: TeacherRowHandlers) => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Teacher>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: t("teachers.table.full_name"),
        cell: ({ row }) => {
          const teacher = row.original;
          return (
            <div className="flex min-w-52 items-center gap-3">
              <UserAvatar name={teacher.fullName} url={teacher.avatarUrl} />
              <div className="min-w-0">
                <Link
                  to={teacherProfilePath(teacher.id)}
                  className="block truncate font-medium hover:text-primary hover:underline focus-visible:underline"
                >
                  {teacher.fullName}
                </Link>
                <p className="truncate text-xs text-muted-foreground">
                  @{teacher.username}
                  {teacher.email ? `, ${teacher.email}` : ""}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "phone",
        header: t("teachers.table.phone"),
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "taughtGroups",
        header: t("teachers.table.taught_groups"),
        cell: ({ getValue }) => (
          <TeacherGroupChips groups={getValue<Group[]>() ?? []} />
        ),
      },
      {
        accessorKey: "isActive",
        header: t("common.status"),
        cell: ({ getValue }) =>
          getValue<boolean>() ? (
            <Badge variant="success">{t("common.active")}</Badge>
          ) : (
            <Badge variant="secondary">{t("students.status.archived")}</Badge>
          ),
      },
      {
        accessorKey: "createdAt",
        header: t("teachers.table.created_at"),
        cell: ({ getValue }) => (
          <span className="tabular-nums text-muted-foreground">
            {getValue<string>()
              ? formatDate(getValue<string>(), "dd.MM.yyyy")
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "actions",
        header: () => (
          <span className="sr-only">{t("teachers.table.actions")}</span>
        ),
        cell: ({ row }) => (
          <TeacherRowActions
            teacher={row.original}
            onEdit={onEdit}
            onChangePassword={onChangePassword}
            onArchive={onArchive}
            onRestore={onRestore}
          />
        ),
      },
    ],
    [t, onEdit, onChangePassword, onArchive, onRestore],
  );

  return { columns };
};
