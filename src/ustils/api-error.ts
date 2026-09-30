import { getApiErrorMessage, getApiErrorStatus } from "./username";

type TFn = (key: string, options?: Record<string, unknown>) => string;

/**
 * Backendning yangi xatolari `message` (o'zbekcha) bilan birga i18n uchun
 * `code` ham qaytaradi, ba'zilarida qo'shimcha maydonlar bor
 * (`studentIds`, `maxScore`, `highestScore`, `allowedModes`...).
 */
export interface ApiErrorData {
  statusCode?: number;
  message?: string | string[];
  code?: string;
  studentIds?: string[];
  maxScore?: number;
  highestScore?: number;
  allowedModes?: string[];
  evaluationMode?: string;
}

export const getApiErrorData = (error: unknown): ApiErrorData | undefined =>
  (error as { data?: ApiErrorData } | undefined)?.data;

export const getApiErrorCode = (error: unknown): string | undefined =>
  getApiErrorData(error)?.code;

/**
 * `403` — ruxsat yo'q. Bo'sh ro'yxat yoki "topilmadi" holatidan farqli
 * ko'rsatish uchun (masalan teacher guruhga tegishli bo'lmasa).
 */
export const isForbiddenError = (error: unknown) =>
  getApiErrorStatus(error) === 403;

/** 4xx — so'rovni takrorlash natijani o'zgartirmaydi. */
export const isClientError = (error: unknown) => {
  const status = getApiErrorStatus(error);
  return status !== undefined && status >= 400 && status < 500;
};

/**
 * Xatoni `apiErrors.<code>` kaliti bo'yicha tarjima qiladi. Tarjima topilmasa
 * backend `message` i, u ham bo'lmasa `common.error` ko'rsatiladi.
 */
export const translateApiError = (error: unknown, t: TFn): string => {
  const data = getApiErrorData(error);
  const fallback = getApiErrorMessage(error) || t("common.error");
  if (!data?.code) return fallback;

  return t(`apiErrors.${data.code}`, {
    defaultValue: fallback,
    maxScore: data.maxScore,
    highestScore: data.highestScore,
    allowedModes: data.allowedModes
      ?.map((mode) =>
        t(`sessions.evaluationMode.${mode}`, { defaultValue: mode }),
      )
      .join(", "),
    evaluationMode:
      data.evaluationMode &&
      t(`sessions.evaluationMode.${data.evaluationMode}`, {
        defaultValue: data.evaluationMode,
      }),
  });
};
