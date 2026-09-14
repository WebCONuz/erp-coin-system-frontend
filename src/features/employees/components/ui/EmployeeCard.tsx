import {
  MoreVertical,
  Pencil,
  KeyRound,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getFileUrl } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Employee } from "../../types";

interface Props {
  data: Employee;
  onEdit: (employee: Employee) => void;
  onChangePassword: (employee: Employee) => void;
  onArchive: (employee: Employee) => void;
  onRestore: (employee: Employee) => void;
}

export const EmployeeCard = ({
  data,
  onEdit,
  onChangePassword,
  onArchive,
  onRestore,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div className="border bg-background rounded-xl p-4 relative">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded p-1 text-muted-foreground hover:bg-accent">
              <MoreVertical size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-42">
            <DropdownMenuItem onClick={() => onEdit(data)}>
              <Pencil className="text-blue-500" />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangePassword(data)}>
              <KeyRound className="text-amber-500" />
              {t("employees.changePasswordTitle")}
            </DropdownMenuItem>
            {data.isActive ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onArchive(data)}
              >
                <Archive />
                {t("employees.archive")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onRestore(data)}>
                <ArchiveRestore className="text-emerald-500" />
                {t("employees.restore")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-x-3 items-center mb-3">
        {data.avatarUrl ? (
          <img
            src={getFileUrl(data.avatarUrl)}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-sm text-white font-medium shrink-0">
            {data.fullName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h4 className="text-lg font-semibold leading-5 truncate">
            {data.fullName}
          </h4>
          <span className="text-sm text-gray-400 font-light leading-0">
            ({data.tenant.name})
          </span>
        </div>
      </div>

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>{data.phone}</p>
        <div className="flex items-center gap-x-1.5">
          <span className="px-2 py-0.5 rounded-4xl text-xs bg-background border">
            {data.role.displayName}
          </span>
          {!data.isActive && (
            <span className="px-2 py-0.5 rounded-4xl text-xs bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
              {t("employees.archived")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
