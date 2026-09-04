export const TENANT_TYPES = [
  "learning_center",
  "school",
  "academic_lyceum",
  "college",
  "university",
] as const;

export type TenantOrgType = (typeof TENANT_TYPES)[number];

export type TenentType = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  type: TenantOrgType | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    users: number;
    groups: number;
  };
};

export type TenantResponse = {
  status: string;
  data: TenentType[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export interface CreateTenantDto {
  name: string;
  slug: string;
  plan?: string;
  type?: TenantOrgType;
}

export interface UpdateTenantDto {
  name?: string;
  slug?: string;
  plan?: string;
  type?: TenantOrgType;
}
