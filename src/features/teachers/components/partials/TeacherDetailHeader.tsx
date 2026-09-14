import {
  Archive,
  ArchiveRestore,
  Calendar,
  KeyRound,
  Mail,
  Pencil,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/ustils";
import { getFileUrl } from "@/lib/utils";
import type { TeacherDetail } from "../../types";

interface Props {
  teacher: TeacherDetail;
  onEdit: () => void;
  onChangePassword: () => void;
  onArchive: () => void;
  onRestore: () => void;
}

export const TeacherDetailHeader = ({
  teacher,
  onEdit,
  onChangePassword,
  onArchive,
  onRestore,
}: Props) => {
  const { t } = useTranslation();
  const avatarLetter = teacher.fullName.charAt(0).toUpperCase();

  return (
    <header
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-xl border bg-white dark:bg-zinc-900 ${
        !teacher.isActive
          ? "border-red-200 dark:border-red-900/60"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="relative shrink-0">
        {teacher.avatarUrl ? (
          <img
            src={getFileUrl(teacher.avatarUrl)}
            alt="avatar"
            className="w-16 h-16 rounded-xl object-cover shadow-md"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {avatarLetter}
          </div>
        )}
        {teacher.isActive && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {teacher.fullName}
          </h1>
          <Badge
            className={`border-0 ${
              teacher.isActive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
            }`}
          >
            {teacher.isActive
              ? t("common.active")
              : t("students.status.archived")}
          </Badge>
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border-0">
            {teacher.role.displayName}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {teacher.phone}
          </span>
          {teacher.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={13} />
              {teacher.email}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {t("students.detail.memberSince", {
              date: formatDate(teacher.createdAt, "dd.MM.yyyy"),
            })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" className="gap-2" onClick={onChangePassword}>
          <KeyRound size={14} />
          {t("teachers.header.password")}
        </Button>
        <Button
          size="sm"
          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          onClick={onEdit}
        >
          <Pencil size={14} />
          {t("common.edit")}
        </Button>
        {teacher.isActive ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-red-600 hover:bg-red-50 border-red-200 dark:border-red-900 dark:hover:bg-red-950/50"
            onClick={onArchive}
          >
            <Archive size={14} />
            {t("students.detail.archive")}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-emerald-600 hover:bg-emerald-50 border-emerald-200 dark:border-emerald-900 dark:hover:bg-emerald-950/50"
            onClick={onRestore}
          >
            <ArchiveRestore size={14} />
            {t("teachers.header.restore")}
          </Button>
        )}
      </div>
    </header>
  );
};
