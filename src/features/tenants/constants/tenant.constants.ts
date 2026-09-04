import type { IOption } from "@/components/controls";
import type { TenantOrgType } from "../types";

export const tenantQueryKeys = {
  allTenants: (params?: Record<string, any>) => ["all-tenants", params ?? {}],
  oneTenantById: (id: string) => ["one-tenant-by-id", id],
} as const;

export const TENANT_KEY = "active_tenant_id";

export const TENANT_TYPE_LABELS: Record<TenantOrgType, string> = {
  learning_center: "O'quv markaz",
  school: "Maktab",
  academic_lyceum: "Akademik litsey",
  college: "Kollej",
  university: "Universitet",
};

export const TENANT_TYPE_OPTIONS: IOption[] = Object.entries(
  TENANT_TYPE_LABELS,
).map(([value, label]) => ({ value, label }));
