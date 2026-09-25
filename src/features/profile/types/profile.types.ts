// ─── GET /api/users/me ───────────────────────────────────────────────────────
// Barcha rollar uchun (student, teacher, admin, super_admin, creator).
export interface MyProfile {
  id: string;
  username: string;
  phone: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  parentPhone: string | null;
  isActive: boolean;
  tenantId: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
    displayName: string;
    level: number;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    type: string | null;
  } | null;
  /** Faqat studentda bo'ladi, qolganlarda `null` */
  wallet: { balance: number } | null;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
// PATCH /api/users/me — faqat yuborilgan maydonlar yangilanadi.
// roleId, tenantId, password, isActive yuborilsa 400.
export interface UpdateMyProfileDto {
  username?: string;
  fullName?: string;
  phone?: string;
  parentPhone?: string;
  email?: string;
  avatarUrl?: string;
}

// PATCH /api/users/:id/change-password — o'z paroli uchun oldPassword shart.
export interface ChangeMyPasswordDto {
  oldPassword: string;
  newPassword: string;
}
