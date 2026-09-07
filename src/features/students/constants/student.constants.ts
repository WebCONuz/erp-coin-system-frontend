import type { IOption } from "@/components/controls";

export const studentKeys = {
  allStudents: (params?: Record<string, unknown>) => ["all-students", params ?? {}],
  oneStudentById: (id: string) => ["one-student-by-id", id],
  coinTransactions: (params?: Record<string, unknown>) => ["student-coin-transactions", params ?? {}],
  purchases: (params?: Record<string, unknown>) => ["student-purchases", params ?? {}],
} as const;

export const bulkCoinSourceTypeOptions: IOption[] = [
  { value: "bonus", label: "Bonus" },
  { value: "attendance", label: "Davomat" },
  { value: "homework", label: "Uy vazifasi" },
  { value: "competition", label: "Musobaqa" },
  { value: "purchase", label: "Xarid" },
  { value: "manual", label: "Qo'lda" },
];
