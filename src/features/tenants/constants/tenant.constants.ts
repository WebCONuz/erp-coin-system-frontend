import type { IOption } from "@/components/controls";
import type { TenantOrgType } from "../types";

export const tenantQueryKeys = {
  allTenants: (params?: Record<string, any>) => ["all-tenants", params ?? {}],
  oneTenantById: (id: string) => ["one-tenant-by-id", id],
} as const;

export const TENANT_KEY = "active_tenant_id";

/**
 * creator/super_admin joylashgan tizim tenanti — backend uni o'chirish,
 * nofaol qilish va slug'ini o'zgartirishni taqiqlaydi (403).
 */
export const SYSTEM_TENANT_SLUG = "system";

export const isSystemTenant = (tenant?: { slug?: string } | null) =>
  tenant?.slug === SYSTEM_TENANT_SLUG;

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
