import { ROLE_LEVELS, ROLES } from "@/assets/constants";

export type RoleLike = { name?: string; level?: number } | null | undefined;

/** `role.level` bo'lsa o'shani, bo'lmasa `ROLE_LEVELS[role.name]` ni qaytaradi. */
export const getRoleLevel = (role: RoleLike): number => {
  if (!role) return 0;
  if (typeof role.level === "number") return role.level;
  return (role.name && ROLE_LEVELS[role.name]) || 0;
};

/**
 * Backend qoidasi: user faqat o'zidan **past** darajadagi userni boshqaradi
 * (tahrirlash, arxivlash, tiklash, parol). O'zini ham `PATCH /users/:id`
 * orqali tahrirlay olmaydi — daraja teng bo'lgani uchun bu yerda `false`.
 */
export const canManageRole = (actor: RoleLike, target: RoleLike): boolean =>
  getRoleLevel(target) < getRoleLevel(actor);

/**
 * Audit log — yuqori nazorat vositasi: faqat `super_admin` va `creator`
 * (`role.level >= 90`). Admin, teacher, student uchun backend `403` qaytaradi.
 */
export const canViewAuditLogs = (role: RoleLike): boolean =>
  getRoleLevel(role) >= ROLE_LEVELS[ROLES.SUPER_ADMIN];
