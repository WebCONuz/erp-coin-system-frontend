import { z } from "zod";

type TFn = (key: string, options?: Record<string, unknown>) => string;

/** Backend matn uzunligi chegaralari (oshsa `400`). */
export const TEXT_LIMITS = {
  /** Kurs, fan, xona, sovg'a tavsifi */
  DESCRIPTION: 1000,
  /** Sessiya mavzusi */
  TOPIC: 300,
  /** Jadval istisnosi izohi */
  EXCEPTION_NOTE: 300,
  FULL_NAME: 150,
  EMAIL: 150,
  /** Ro'yxat filtrlaridagi qidiruv */
  SEARCH: 100,
  /** SMS / email matni */
  MESSAGE: 2000,
  /** Email mavzusi */
  MESSAGE_SUBJECT: 200,
  /** Sovg'a rasmi manzili */
  IMAGE_URL: 500,
} as const;

/** Ro'yxat endpointlarida `limit` 1–100 (butun son), oshsa `400`. */
export const MAX_PAGE_LIMIT = 100;
/** `GET /coin-transactions/leaderboard` — `limit` 1–50. */
export const MAX_LEADERBOARD_LIMIT = 50;

/** Parol siyosati — yangi parol 8–72 belgi (login'da tekshirilmaydi). */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

/** "Ko'pi bilan {{max}} belgi" — `t` faqat kalit qabul qiladigan schema'lar uchun. */
export const maxLengthMessage = (t: TFn, max: number) =>
  t("validation.maxLength", { max });

/** Ixtiyoriy matn maydoni, `max` belgidan oshmasin. */
export const createOptionalTextSchema = (t: TFn, max: number) =>
  z.string().max(max, maxLengthMessage(t, max)).optional();

export const createPasswordSchema = (t: TFn) =>
  z
    .string()
    .min(PASSWORD_MIN, t("validation.passwordMin", { min: PASSWORD_MIN }))
    .max(PASSWORD_MAX, t("validation.passwordMax", { max: PASSWORD_MAX }));
