import { Archive, ArchiveRestore, Building2, KeyRound, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CardMenu } from "@/components/shared/card-menu";
import { UserAvatar } from "@/components/shared/avatar";
import { useAuth } from "@/features/auth/hooks/useLogin";
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
  // Teng yoki yuqori darajadagi user (boshqa admin, o'zi) — backend 403 qaytaradi.
  const { canManage } = useAuth();
  const isManageable = canManage(data.role);

  return (
    <article className="relative flex h-full flex-col gap-3 rounded-2xl border bg-card p-4">
      {isManageable && (
        <div className="absolute top-2.5 right-2.5">
          <CardMenu title={data.fullName} onEdit={() => onEdit(data)}>
            <DropdownMenuItem onClick={() => onChangePassword(data)}>
              <KeyRound className="size-4" aria-hidden />
              {t("employees.changePasswordTitle")}
            </DropdownMenuItem>
            {data.isActive ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onArchive(data)}
              >
                <Archive className="size-4" aria-hidden />
                {t("employees.archive")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onRestore(data)}>
                <ArchiveRestore className="size-4" aria-hidden />
                {t("employees.restore")}
              </DropdownMenuItem>
            )}
          </CardMenu>
        </div>
      )}

      <div className="flex min-w-0 items-center gap-3 pr-9">
        <UserAvatar name={data.fullName} url={data.avatarUrl} className="size-10" />
        <div className="min-w-0">
          <h3 className="truncate font-heading text-base font-semibold leading-snug">
            {data.fullName}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="soft">{data.role.displayName}</Badge>
            {!data.isActive && (
              <Badge variant="secondary">{t("employees.archived")}</Badge>
            )}
          </div>
        </div>
      </div>

      <dl className="mt-auto space-y-1 border-t pt-3 text-sm text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <dt>
            <Phone className="size-4" aria-hidden />
            <span className="sr-only">{t("common.phone")}</span>
          </dt>
          <dd className="truncate tabular-nums">{data.phone}</dd>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <dt>
            <Building2 className="size-4" aria-hidden />
            <span className="sr-only">{t("admin.header.tenants")}</span>
          </dt>
          <dd className="truncate">{data.tenant.name}</dd>
        </div>
      </dl>
    </article>
  );
};
