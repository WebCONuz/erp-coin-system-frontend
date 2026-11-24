import { useTranslation } from "react-i18next";
import {
  Archive,
  AtSign,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Phone,
  Power,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/avatar";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { StudentStatusBadge } from "../../constants";
import type { ConfirmAction, StudentDetailFull } from "../../types";

interface Props {
  isActive: boolean;
  isDeleted: boolean;
  student?: StudentDetailFull;
  setIsMsgOpen: (open: boolean) => void;
  setIsEditOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setConfirmAction: (action: ConfirmAction) => void;
}

export const StudentDetailHeader = ({
  isActive,
  isDeleted,
  student,
  setIsMsgOpen,
  setIsEditOpen,
  setActiveTab,
  setConfirmAction,
}: Props) => {
  const { t } = useTranslation();
  const status = StudentStatusBadge(isActive, isDeleted, t);

  return (
    <header
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:p-5",
        isDeleted && "border-destructive/40",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <UserAvatar
          name={student?.fullName ?? ""}
          url={student?.avatarUrl}
          className="size-14 rounded-2xl text-lg sm:size-16"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate font-heading text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {student?.fullName}
            </h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {student?.username && (
              <Meta icon={AtSign} label={t("username.label")}>
                {student.username}
              </Meta>
            )}
            <Meta icon={Phone} label={t("common.phone")}>
              <span className="tabular-nums">{student?.phone}</span>
            </Meta>
            <Meta icon={Calendar} label={t("students.infoTab.registeredLabel")}>
              {t("students.detail.memberSince", {
                date: formatDate(student?.createdAt, "dd.MM.yyyy"),
              })}
            </Meta>
          </dl>
        </div>
      </div>

      {!isDeleted && (
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            className="h-9 flex-1 gap-2 sm:flex-none"
            onClick={() => setIsMsgOpen(true)}
          >
            <MessageSquare className="size-4" aria-hidden />
            {t("students.detail.message")}
          </Button>
          <Button
            className="h-9 flex-1 gap-2 sm:flex-none"
            onClick={() => setIsEditOpen(true)}
          >
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setActiveTab("security")}>
                <ShieldCheck className="size-4" aria-hidden />
                {t("students.detail.securitySettings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setConfirmAction(isActive ? "archive" : "restore")
                }
              >
                {isActive ? (
                  <Archive className="size-4" aria-hidden />
                ) : (
                  <Power className="size-4" aria-hidden />
                )}
                {isActive
                  ? t("students.detail.archive")
                  : t("students.detail.activate")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmAction("delete")}
              >
                <Trash2 className="size-4" aria-hidden />
                {t("common.delete")}
              </DropdownMenuItem>
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
  <div className="flex items-center gap-1.5">
    <dt>
      <Icon className="size-3.5" aria-hidden />
      <span className="sr-only">{label}</span>
    </dt>
    <dd>{children}</dd>
  </div>
);
