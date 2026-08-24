// ─── List item (GET /api/users/staff) ────────────────────────────────────────
export interface Employee {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  tenantId: string;
  role: {
    id: string;
    name: string;
    displayName: string;
    level: number;
  };
  tenant: {
    id: string;
    name: string;
  };
}

export interface EmployeesResponse {
  data: Employee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Detail (GET /api/users/:id) ─────────────────────────────────────────────
export interface EmployeeDetail {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  role: {
    id: string;
    name: string;
    displayName: string;
  };
  wallet: {
    balance: number;
  };
  groupMemberships: unknown[];
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface CreateEmployeeDto {
  fullName: string;
  phone: string;
  password: string;
  roleId: string;
  email?: string;
  avatarUrl?: string;
  parentPhone?: string;
}

export interface UpdateEmployeeDto {
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  roleId?: string;
}

export interface ChangeEmployeePasswordDto {
  oldPassword?: string;
  newPassword: string;
}
