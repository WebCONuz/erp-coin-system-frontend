export const ROLES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  CREATOR: "creator",
  STUDENT: "student",
  TEACHER: "teacher",
};

/**
 * Rol darajalari (`role.level`). Backend `/auth/me` va ko'p javoblarda
 * `role.level` ni qaytaradi — bu jadval faqat `level` kelmagan javoblar
 * (masalan `GET /users/teachers`) uchun zaxira.
 */
export const ROLE_LEVELS: Record<string, number> = {
  [ROLES.CREATOR]: 100,
  [ROLES.SUPER_ADMIN]: 90,
  [ROLES.ADMIN]: 60,
  [ROLES.TEACHER]: 40,
  [ROLES.STUDENT]: 20,
};
