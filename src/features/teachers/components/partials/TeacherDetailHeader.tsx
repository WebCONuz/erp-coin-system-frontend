import {
  Archive,
  ArchiveRestore,
  AtSign,
  Calendar,
  KeyRound,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/avatar";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { useAuth } from "@/features/auth/hooks/useLogin";
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
  // Teng yoki yuqori darajadagi userni boshqarib bo'lmaydi (backend 403).
  const { canManage } = useAuth();
  const isManageable = canManage(teacher.role);

  return (
    <header
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:p-5",
        !teacher.isActive && "border-dashed",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <UserAvatar
          name={teacher.fullName}
          url={teacher.avatarUrl}
          className="size-14 rounded-2xl text-lg sm:size-16"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate font-heading text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {teacher.fullName}
            </h1>
            {teacher.isActive ? (
              <Badge variant="success">{t("common.active")}</Badge>
            ) : (
              <Badge variant="secondary">{t("students.status.archived")}</Badge>
            )}
          </div>
          <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <Meta icon={AtSign} label={t("username.label")}>
              {teacher.username}
            </Meta>
            <Meta icon={Phone} label={t("common.phone")}>
              <span className="tabular-nums">{teacher.phone}</span>
            </Meta>
            {teacher.email && (
              <Meta icon={Mail} label={t("common.email")}>
                {teacher.email}
              </Meta>
            )}
            <Meta icon={Calendar} label={t("teachers.table.created_at")}>
              {t("students.detail.memberSince", {
                date: formatDate(teacher.createdAt, "dd.MM.yyyy"),
              })}
            </Meta>
          </dl>
        </div>
      </div>

      {isManageable && (
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            className="h-9 flex-1 gap-2 sm:flex-none"
            onClick={onChangePassword}
          >
            <KeyRound className="size-4" aria-hidden />
            {t("teachers.header.password")}
          </Button>
          <Button className="h-9 flex-1 gap-2 sm:flex-none" onClick={onEdit}>
            <Pencil className="size-4" aria-hidden />
            {t("common.edit")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
                aria-label={t("students.filter.moreActions")}
              >
                <MoreHorizontal className="size-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {teacher.isActive ? (
                <DropdownMenuItem variant="destructive" onClick={onArchive}>
                  <Archive className="size-4" aria-hidden />
                  {t("students.detail.archive")}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={onRestore}>
                  <ArchiveRestore className="size-4" aria-hidden />
                  {t("teachers.header.restore")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

const Meta = ({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Phone;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex min-w-0 items-center gap-1.5">
    <dt>
      <Icon className="size-3.5" aria-hidden />
      <span className="sr-only">{label}</span>
    </dt>
    <dd className="truncate">{children}</dd>
  </div>
);
