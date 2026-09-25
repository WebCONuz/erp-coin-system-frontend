export interface Group {
  id: string;
  name: string;
  maxStudents: number;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
}

// ─── List item (GET /api/users/teachers) ─────────────────────────────────────
export interface Teacher {
  id: string;
  username: string;
  phone: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
  taughtGroups: Group[];
}

export interface TeacherResponse {
  status: string;
  data: Teacher[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Detail (GET /api/users/teachers/:id) ────────────────────────────────────
export interface TeacherGroupDetail {
  id: string;
  name: string;
  maxStudents: number;
  course: {
    id: string;
    title: string;
    description?: string | null;
    isActive: boolean;
  };
  _count: {
    students: number;
  };
}

export interface TeacherDetail {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  tenantId: string;
  role: Role;
  taughtGroups: TeacherGroupDetail[];
}

// Shared shape between `Teacher` (list) and `TeacherDetail` used by the
// create/edit form, so it works with data from either endpoint.
export type TeacherEditable = Pick<
  Teacher,
  "id" | "username" | "fullName" | "phone" | "email" | "avatarUrl"
>;

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface CreateTeacherDto {
  username: string;
  fullName: string;
  phone: string;
  password: string;
  roleId: string;
  email?: string;
  avatarUrl?: string;
}

export interface UpdateTeacherDto {
  username?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}

export interface ChangeTeacherPasswordDto {
  oldPassword?: string;
  newPassword: string;
}
