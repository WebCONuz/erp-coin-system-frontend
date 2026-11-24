import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Archive,
  ArchiveRestore,
  Eye,
  KeyRound,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useLogin";
import type { Teacher } from "../types";
import { teacherProfilePath } from "../constants";

export interface TeacherRowHandlers {
  onEdit?: (teacher: Teacher) => void;
  onChangePassword?: (teacher: Teacher) => void;
  onArchive?: (teacher: Teacher) => void;
  onRestore?: (teacher: Teacher) => void;
}

/**
 * Qator amallari: "Ko'rish" doim ko'rinadi, boshqarish amallari "⋯" menyusida.
 * Boshqarish faqat o'zidan past darajadagi user uchun (backend 403).
 */
export const TeacherRowActions = ({
  teacher,
  onEdit,
  onChangePassword,
  onArchive,
  onRestore,
}: TeacherRowHandlers & { teacher: Teacher }) => {
  const { t } = useTranslation();
  const { canManage } = useAuth();
  const isManageable = canManage(teacher.role);

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="size-9 text-muted-foreground hover:text-foreground"
      >
        <Link
          to={teacherProfilePath(teacher.id)}
          aria-label={t("teachers.actions.view", { name: teacher.fullName })}
        >
          <Eye className="size-4" aria-hidden />
        </Link>
      </Button>

      {isManageable && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 text-muted-foreground hover:text-foreground"
              aria-label={t("teachers.actions.more", { name: teacher.fullName })}
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => onEdit?.(teacher)}>
              <Pencil className="size-4" aria-hidden />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangePassword?.(teacher)}>
              <KeyRound className="size-4" aria-hidden />
              {t("teachers.header.password")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {teacher.isActive ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onArchive?.(teacher)}
              >
                <Archive className="size-4" aria-hidden />
                {t("students.detail.archive")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onRestore?.(teacher)}>
                <ArchiveRestore className="size-4" aria-hidden />
                {t("teachers.header.restore")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
