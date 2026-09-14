import type { IOption } from "@/components/controls";

export const studentKeys = {
  allStudents: (params?: Record<string, unknown>) => ["all-students", params ?? {}],
  oneStudentById: (id: string) => ["one-student-by-id", id],
  coinTransactions: (params?: Record<string, unknown>) => ["student-coin-transactions", params ?? {}],
  purchases: (params?: Record<string, unknown>) => ["student-purchases", params ?? {}],
} as const;

export const getBulkCoinSourceTypeOptions = (
  t: (key: string) => string,
): IOption[] => [
  { value: "bonus", label: t("sourceTypes.bonus") },
  { value: "attendance", label: t("sourceTypes.attendance") },
  { value: "homework", label: t("sourceTypes.homework") },
  { value: "competition", label: t("sourceTypes.competition") },
  { value: "purchase", label: t("sourceTypes.purchase") },
  { value: "manual", label: t("sourceTypes.manual") },
];
