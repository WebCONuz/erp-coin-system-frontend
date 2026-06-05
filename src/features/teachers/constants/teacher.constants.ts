export const teacherKeys = {
  allTeachers: (params?: Record<string, any>) => ["all-teachers", params ?? {}],
  oneTeacherById: (id: string) => ["one-teacher-by-id", id],
} as const;
