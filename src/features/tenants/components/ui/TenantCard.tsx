import { MoreVertical, Pencil, Power } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/ustils/format-date";
import { useToggleTenantActive } from "../../hooks";
import { getTenantTypeLabels } from "../../constants";
import type { TenentType } from "../../types";

interface Props {
  data: TenentType;
  onEdit: (tenant: TenentType) => void;
}

export const TenantCard = ({ data, onEdit }: Props) => {
  const { t } = useTranslation();
  const toggleActive = useToggleTenantActive();
  const tenantTypeLabels = getTenantTypeLabels(t);

  const handleToggleActive = () => {
    const confirmMessage = data.isActive
      ? t("tenants.deactivateConfirm", { name: data.name })
      : t("tenants.activateConfirm", { name: data.name });
    if (!window.confirm(confirmMessage)) return;

    toggleActive.mutate(data.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm flex items-start justify-between relative">
      <div>
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          {data?.name}
          {!data.isActive && (
            <span className="inline-block px-2 py-0.5 rounded-4xl text-xs font-medium bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
              {t("tenants.inactive")}
            </span>
          )}
        </h3>
        <span
          className={`inline-block mt-1 px-2 py-0.5 rounded-4xl text-xs font-medium ${
            data.type
              ? "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          {data.type ? tenantTypeLabels[data.type] : t("tenants.typeNotSet")}
        </span>
        <p className="text-sm text-muted-foreground mt-1">
          {t("groups.info.created_at")} {formatDate(data?.createdAt)}
        </p>
        <div className="flex gap-x-4 mt-4 items-center">
          <div className="flex items-center gap-x-2">
            <span>{t("admin.header.students")}:</span>
            <div className="text-green-600 font-medium rounded-md">
              {t("tenants.countUnit", { count: data?._count?.users || 0 })}
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <span>{t("admin.header.groups")}:</span>
            <div className="text-primary font-medium rounded-md">
              {t("tenants.countUnit", { count: data?._count?.groups || 0 })}
            </div>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded p-1 text-muted-foreground hover:bg-accent shrink-0">
            <MoreVertical size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(data)}>
            <Pencil className="text-blue-500" />
            {t("common.edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant={data.isActive ? "destructive" : undefined}
            onClick={handleToggleActive}
          >
            <Power className={data.isActive ? "" : "text-green-500"} />
            {data.isActive ? t("tenants.deactivate") : t("tenants.activate")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
