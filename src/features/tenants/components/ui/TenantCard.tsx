import { MoreHorizontal, Pencil, Power, School, Users } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/ustils/format-date";
import { translateApiError } from "@/ustils";
import { useToggleTenantActive } from "../../hooks";
import { getTenantTypeLabels, isSystemTenant } from "../../constants";
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
      onError: (error: unknown) => toast.error(translateApiError(error, t)),
    });
  };

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <h3 className="truncate font-heading text-lg font-semibold leading-snug">
            {data.name}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={data.type ? "soft" : "secondary"}>
              {data.type ? tenantTypeLabels[data.type] : t("tenants.typeNotSet")}
            </Badge>
            {!data.isActive && (
              <Badge variant="danger">{t("tenants.inactive")}</Badge>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`${t("common.actions")}: ${data.name}`}
              className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <MoreHorizontal className="size-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => onEdit(data)}>
              <Pencil className="size-4" aria-hidden />
              {t("common.edit")}
            </DropdownMenuItem>
            {/* Tizim tenantini nofaol qilib bo'lmaydi. */}
            {!isSystemTenant(data) && (
              <DropdownMenuItem
                variant={data.isActive ? "destructive" : undefined}
                onClick={handleToggleActive}
              >
                <Power className="size-4" aria-hidden />
                {data.isActive ? t("tenants.deactivate") : t("tenants.activate")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <dl className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border">
        <div className="bg-card px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" aria-hidden />
            {t("tenants.usersCount")}
          </dt>
          <dd className="mt-0.5 font-heading text-lg font-semibold tabular-nums">
            {data?._count?.users || 0}
          </dd>
        </div>
        <div className="bg-card px-3 py-2.5">
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <School className="size-3.5" aria-hidden />
            {t("admin.header.groups")}
          </dt>
          <dd className="mt-0.5 font-heading text-lg font-semibold tabular-nums">
            {data?._count?.groups || 0}
          </dd>
        </div>
      </dl>

      <p className="text-xs text-muted-foreground">
        {t("groups.info.created_at")}{" "}
        <span className="tabular-nums">{formatDate(data?.createdAt)}</span>
      </p>
    </article>
  );
};
