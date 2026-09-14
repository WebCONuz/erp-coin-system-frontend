import type { IOption } from "@/components/controls";
import type { TenantOrgType } from "../types";

export const tenantQueryKeys = {
  allTenants: (params?: Record<string, any>) => ["all-tenants", params ?? {}],
  oneTenantById: (id: string) => ["one-tenant-by-id", id],
} as const;

export const TENANT_KEY = "active_tenant_id";

export const getTenantTypeLabels = (
  t: (key: string) => string,
): Record<TenantOrgType, string> => ({
  learning_center: t("tenants.type.learning_center"),
  school: t("tenants.type.school"),
  academic_lyceum: t("tenants.type.academic_lyceum"),
  college: t("tenants.type.college"),
  university: t("tenants.type.university"),
});

export const getTenantTypeOptions = (t: (key: string) => string): IOption[] =>
  Object.entries(getTenantTypeLabels(t)).map(([value, label]) => ({
    value,
    label,
  }));
