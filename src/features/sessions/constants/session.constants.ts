import type { IOption } from "@/components/controls";
import type { EvaluationMode, SessionTypeConfig } from "../types";

type TFn = (key: string, options?: Record<string, unknown>) => string;

export const sessionKeys = {
  allSessions: (params?: Record<string, any>) => ["all-sessions", params ?? {}],
  oneSessionById: (id: string) => ["one-session-by-id", id],
  attendanceBySessionId: (id: string) => ["session-attendance", id],
  sessionTypes: () => ["session-types"],
} as const;

/**
 * `GET /sessions/types` hali kelmagan (yoki xato bergan) paytdagi zaxira ro'yxat.
 * Asosiy manba — backend; bu yerda faqat turlar nomi uchun ishlatiladi.
 */
const FALLBACK_SESSION_TYPES = ["lesson", "exam", "competition", "extra"];

/** Backendga yangi tur qo'shilsa-yu tarjimasi hali bo'lmasa, turning o'zi ko'rsatiladi. */
export const getSessionTypeLabel = (t: TFn, type: string) =>
  t(`sessions.type.${type}`, { defaultValue: type });

export const getSessionTypeOptions = (
  t: TFn,
  types?: SessionTypeConfig[],
): IOption[] =>
  (types?.map((item) => item.type) ?? FALLBACK_SESSION_TYPES).map((type) => ({
    value: type,
    label: getSessionTypeLabel(t, type),
  }));

export const getSessionTypeLabels = (t: TFn): Record<string, string> =>
  Object.fromEntries(
    FALLBACK_SESSION_TYPES.map((type) => [type, getSessionTypeLabel(t, type)]),
  );

export const getEvaluationModeOptions = (
  t: TFn,
  modes: EvaluationMode[],
): IOption[] =>
  modes.map((mode) => ({
    value: mode,
    label: t(`sessions.evaluationMode.${mode}`, { defaultValue: mode }),
  }));

export const getIsCheckedOptions = (t: TFn): IOption[] => [
  { value: "true", label: t("sessions.filter.checked") },
  { value: "false", label: t("sessions.filter.unchecked") },
];

export const ALL_VALUE = "all";

// ─── Scored rejim chegaralari (backend validatsiyasi bilan bir xil) ──────────
export const MAX_SCORE_LIMIT = 100000;
export const MAX_COIN_AMOUNT = 10000;
export const MAX_RESULT_NOTE_LENGTH = 500;
