export const teacherKeys = {
  allTeachers: (params?: Record<string, any>) => ["all-teachers", params ?? {}],
  oneTeacherById: (id: string) => ["one-teacher-by-id", id],
} as const;

/** `?teacherId=` — profil sahifasidagi sessiyalar filtri shuni o'qiydi. */
export const teacherProfilePath = (id: string) =>
  `/admin/teachers/${id}?teacherId=${id}`;
