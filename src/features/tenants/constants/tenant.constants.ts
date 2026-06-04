export const tenantQueryKeys = {
  allTenants: (params?: Record<string, any>) => ["all-tenants", params ?? {}],
  oneTenantById: (id: string) => ["one-tenant-by-id", id],
} as const;

export const TENANT_KEY = "active_tenant_id";
