export const studentKeys = {
  allStudents: (params?: Record<string, unknown>) => ["all-students", params ?? {}],
  oneStudentById: (id: string) => ["one-student-by-id", id],
  coinTransactions: (params?: Record<string, unknown>) => ["student-coin-transactions", params ?? {}],
  purchases: (params?: Record<string, unknown>) => ["student-purchases", params ?? {}],
} as const;
