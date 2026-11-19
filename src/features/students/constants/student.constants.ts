import type { IOption } from "@/components/controls";

export const studentKeys = {
  allStudents: (params?: Record<string, unknown>) => ["all-students", params ?? {}],
  oneStudentById: (id: string) => ["one-student-by-id", id],
  coinTransactions: (params?: Record<string, unknown>) => ["student-coin-transactions", params ?? {}],
} as const;

// Backend qo'lda coin uchun faqat shu ikkitasini qabul qiladi.
export const MANUAL_COIN_SOURCE_TYPES = ["bonus", "manual"] as const;

export const getBulkCoinSourceTypeOptions = (
  t: (key: string) => string,
): IOption[] =>
  MANUAL_COIN_SOURCE_TYPES.map((value) => ({
    value,
    label: t(`sourceTypes.${value}`),
  }));

/** Qo'lda coin `amount` chegarasi (backend validatsiyasi bilan bir xil). */
export const MANUAL_COIN_MAX = 100000;
/** Coin izohi (`note`) uchun maksimal uzunlik. */
export const COIN_NOTE_MAX = 500;
