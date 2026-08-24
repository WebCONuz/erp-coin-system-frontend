// ─── List item (GET /api/roles) ──────────────────────────────────────────────
export interface Role {
  id: string;
  name: string;
  displayName: string;
  level: number;
  scope: string;
  canDelete: boolean;
  canManageAdmins: boolean;
  canManageUsers: boolean;
  isSystem: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tenantId: string;
  _count: {
    users: number;
  };
}

export interface RolesResponse {
  data: Role[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateRoleDto {
  name: string;
  displayName: string;
  level: number;
  scope: string;
  canDelete?: boolean;
}

export interface UpdateRoleDto {
  name?: string;
  displayName?: string;
  level?: number;
  scope?: string;
  canDelete?: boolean;
}
