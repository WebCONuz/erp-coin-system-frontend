export const studentKeys = {
  allStudents: (params?: Record<string, any>) => ["all-students", params ?? {}],
  oneStudentById: (id: string) => ["one-student-by-id", id],
} as const;
