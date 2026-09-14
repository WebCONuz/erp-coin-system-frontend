import { useTranslation } from "react-i18next";
import { StudentStatusBadge } from "../../constants";
import type { ConfirmAction, StudentDetailFull } from "../../types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Mail,
  Calendar,
  Pencil,
  Power,
  Trash2,
  MessageSquare,
  Archive,
  PhoneCall,
  MoreVertical,
} from "lucide-react";
import { formatDate } from "@/ustils";
import { Button } from "@/components/ui/button";

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
  const statusBadge = StudentStatusBadge(isActive, isDeleted, t);
  const avatarLetter = student?.fullName?.charAt(0)?.toUpperCase() ?? "A";

  return (
    <header
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-xl border bg-white dark:bg-zinc-900 ${isDeleted ? "border-red-200 dark:border-red-900/60" : "border-zinc-200 dark:border-zinc-800"}`}
    >
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white shadow-md">
          {avatarLetter}
        </div>
        {isActive && !isDeleted && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {student?.fullName}
          </h1>
          <Badge className={`border-0 ${statusBadge.cls}`}>
            {statusBadge.label}
          </Badge>
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border-0 capitalize">
            {student?.role?.displayName}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {student?.phone}
          </span>
          {student?.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={13} />
              {student?.email}
            </span>
          )}
          {student?.parentPhone && (
            <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400">
              <PhoneCall size={13} />
              {t("students.detail.parentPhonePrefix")} {student?.parentPhone}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {t("students.detail.memberSince", {
              date: formatDate(student?.createdAt, "dd.MM.yyyy"),
            })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {!isDeleted && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
            onClick={() => setIsMsgOpen(true)}
          >
            <MessageSquare size={14} />
            {t("students.detail.message")}
          </Button>
        )}
        {!isDeleted && (
          <Button
            size="sm"
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil size={14} />
            {t("common.edit")}
          </Button>
        )}
        {!isDeleted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-zinc-300 dark:border-zinc-700"
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setActiveTab("security")}>
                <Pencil size={14} />
                {t("students.detail.securitySettings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setConfirmAction(isActive ? "archive" : "restore")
                }
              >
                {isActive ? <Archive size={14} /> : <Power size={14} />}
                {isActive
                  ? t("students.detail.archive")
                  : t("students.detail.activate")}
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmAction("delete")}
              >
                <Trash2 size={14} />
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};
