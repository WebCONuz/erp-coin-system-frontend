// ─── List item (GET /api/roles) ──────────────────────────────────────────────
// Har bir tenantda faqat 3 ta rol bo'ladi: admin (60), teacher (40), student (20).
// Mantiq uchun `name` ga, UI uchun `displayName` ga tayaning.
export type RoleTypes =
  | "student"
  | "teacher"
  | "admin"
  | "super_admin"
  | "creator";

export interface Role {
  id: string;
  name: RoleTypes;
  displayName: string;
  level: number;
  scope: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
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
