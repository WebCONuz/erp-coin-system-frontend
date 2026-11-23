import { getApiErrorMessage, getApiErrorStatus } from "./username";
import { formatDate } from "./format-date";

type TFn = (key: string, options?: Record<string, unknown>) => string;

/** Backend xato kodlari — xatolar `message` matni bo'yicha emas, shu kodlar bo'yicha aniqlanadi. */
export const API_ERROR_CODES = {
  TENANT_INACTIVE: "TENANT_INACTIVE",
  TEACHER_COIN_LIMIT_EXCEEDED: "TEACHER_COIN_LIMIT_EXCEEDED",
  SESSION_LOCKED: "SESSION_LOCKED",
  SESSION_NOT_STARTED: "SESSION_NOT_STARTED",
  INVALID_TIME_RANGE: "INVALID_TIME_RANGE",
  ATTENDANCE_EDIT_WINDOW_EXPIRED: "ATTENDANCE_EDIT_WINDOW_EXPIRED",
  SESSION_DATE_TOO_OLD: "SESSION_DATE_TOO_OLD",
  SESSION_DUPLICATE: "SESSION_DUPLICATE",
  SCHEDULE_CONFLICT: "SCHEDULE_CONFLICT",
  ATTENDANCE_STATUS_MISMATCH: "ATTENDANCE_STATUS_MISMATCH",
  STUDENTS_NOT_IN_GROUP: "STUDENTS_NOT_IN_GROUP",
  STUDENTS_NOT_FOUND: "STUDENTS_NOT_FOUND",
  IDEMPOTENCY_KEY_REQUIRED: "IDEMPOTENCY_KEY_REQUIRED",
  IDEMPOTENCY_KEY_INVALID: "IDEMPOTENCY_KEY_INVALID",
  IDEMPOTENCY_REQUEST_IN_PROGRESS: "IDEMPOTENCY_REQUEST_IN_PROGRESS",
  IDEMPOTENCY_KEY_REUSED: "IDEMPOTENCY_KEY_REUSED",
  // Ma'lumotlar bazasi xatolari
  DUPLICATE_VALUE: "DUPLICATE_VALUE",
  RECORD_NOT_FOUND: "RECORD_NOT_FOUND",
  RELATED_RECORD_CONSTRAINT: "RELATED_RECORD_CONSTRAINT",
  VALUE_TOO_LONG: "VALUE_TOO_LONG",
  CONCURRENT_UPDATE: "CONCURRENT_UPDATE",
  DATABASE_UNAVAILABLE: "DATABASE_UNAVAILABLE",
  DATABASE_REQUEST_FAILED: "DATABASE_REQUEST_FAILED",
} as const;

export type ConflictKind = "group" | "room" | "teacher";

export interface ScheduleConflictInfo {
  kind: ConflictKind;
  sessionId?: string;
  groupName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

/**
 * Backendning yangi xatolari `message` (o'zbekcha) bilan birga i18n uchun
 * `code` ham qaytaradi, ba'zilarida qo'shimcha maydonlar bor.
 */
export interface ApiErrorData {
  statusCode?: number;
  message?: string | string[];
  code?: string;
  studentIds?: string[];
  studentId?: string;
  maxScore?: number;
  highestScore?: number;
  allowedModes?: string[];
  evaluationMode?: string;
  /** TEACHER_COIN_LIMIT_EXCEEDED */
  limit?: number;
  /** SCHEDULE_CONFLICT */
  conflict?: ScheduleConflictInfo;
  /** SESSION_DUPLICATE */
  sessionId?: string;
  /** SESSION_DATE_TOO_OLD — `YYYY-MM-DD` */
  earliestDate?: string;
  /** SESSION_NOT_STARTED */
  startsAt?: { date: string; time: string };
  /** ATTENDANCE_EDIT_WINDOW_EXPIRED */
  checkedAt?: string;
  editableUntil?: string;
  /** DUPLICATE_VALUE — takrorlangan maydonlar (`username`, `phone`, `slug` …) */
  fields?: string[];
  /** So'rov URL'i */
  path?: string;
  /** So'rov ID'si (header: `X-Request-Id`) — server logidan topish uchun */
  requestId?: string;
}

export const getApiErrorData = (error: unknown): ApiErrorData | undefined =>
  (error as { data?: ApiErrorData } | undefined)?.data;

/** Javob body'sidagi `requestId`, bo'lmasa `X-Request-Id` header'i. */
export const getApiErrorRequestId = (error: unknown): string | undefined => {
  const fromBody = getApiErrorData(error)?.requestId;
  if (fromBody) return fromBody;
  const headers = (error as { headers?: Record<string, unknown> } | undefined)
    ?.headers;
  const fromHeader = headers?.["x-request-id"];
  return typeof fromHeader === "string" ? fromHeader : undefined;
};

/** 5xx — kutilmagan server / baza xatosi. */
export const isServerError = (error: unknown) => {
  const status = getApiErrorStatus(error);
  return status !== undefined && status >= 500;
};

export const getApiErrorCode = (error: unknown): string | undefined =>
  getApiErrorData(error)?.code;

export const hasApiErrorCode = (error: unknown, code: string) =>
  getApiErrorCode(error) === code;

/**
 * `403` — ruxsat yo'q. Bo'sh ro'yxat yoki "topilmadi" holatidan farqli
 * ko'rsatish uchun (masalan teacher guruhga tegishli bo'lmasa).
 */
export const isForbiddenError = (error: unknown) =>
  getApiErrorStatus(error) === 403;

/** `429` — juda ko'p urinish (login limiti yoki umumiy throttling). */
export const isTooManyRequestsError = (error: unknown) =>
  getApiErrorStatus(error) === 429;

/** 4xx — so'rovni takrorlash natijani o'zgartirmaydi. */
export const isClientError = (error: unknown) => {
  const status = getApiErrorStatus(error);
  return status !== undefined && status >= 400 && status < 500;
};

/** To'qnashuvni bir qatorda tarjima qiladi: "Xona band — 9-B, 14:00–15:30". */
export const formatScheduleConflict = (
  conflict: ScheduleConflictInfo,
  t: TFn,
): string => {
  const kind = t(`scheduleConflict.kind.${conflict.kind}`, {
    defaultValue: conflict.kind,
  });
  const time =
    conflict.startTime && conflict.endTime
      ? `${conflict.startTime}–${conflict.endTime}`
      : "";
  const parts = [
    conflict.date ? formatDate(conflict.date, "dd.MM.yyyy") : "",
    time,
    conflict.groupName ? `"${conflict.groupName}"` : "",
  ].filter(Boolean);
  return parts.length ? `${kind} — ${parts.join(", ")}` : kind;
};

/** `fields: ["phone"]` → "Telefon raqam" (tarjima topilmasa maydon nomi). */
const formatErrorFields = (fields: string[] | undefined, t: TFn) =>
  (fields ?? [])
    .map((field) => t(`apiErrors.fields.${field}`, { defaultValue: field }))
    .join(", ");

/**
 * 5xx xatolarda foydalanuvchi xabar qilishi uchun so'rov ID'si qo'shiladi:
 * "Serverda xatolik yuz berdi (Xato kodi: 3f2c…)".
 */
const withRequestId = (message: string, error: unknown, t: TFn) => {
  if (!isServerError(error)) return message;
  const requestId = getApiErrorRequestId(error);
  return requestId
    ? `${message} (${t("apiErrors.requestId", { id: requestId })})`
    : message;
};

/**
 * Xatoni `apiErrors.<code>` kaliti bo'yicha tarjima qiladi. Tarjima topilmasa
 * backend `message` i, u ham bo'lmasa `common.error` ko'rsatiladi.
 */
export const translateApiError = (error: unknown, t: TFn): string =>
  withRequestId(translateApiErrorMessage(error, t), error, t);

const translateApiErrorMessage = (error: unknown, t: TFn): string => {
  const data = getApiErrorData(error);
  const fallback = getApiErrorMessage(error) || t("common.error");

  if (!data?.code) {
    // 429 da `code` yo'q — status bo'yicha umumiy xabar.
    if (isTooManyRequestsError(error)) return t("apiErrors.TOO_MANY_REQUESTS");
    return fallback;
  }

  if (data.code === API_ERROR_CODES.DUPLICATE_VALUE) {
    const fields = formatErrorFields(data.fields, t);
    return fields
      ? t("apiErrors.DUPLICATE_VALUE_FIELDS", { fields })
      : t("apiErrors.DUPLICATE_VALUE", { defaultValue: fallback });
  }

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
    limit: data.limit,
    earliestDate: data.earliestDate
      ? formatDate(data.earliestDate, "dd.MM.yyyy")
      : "",
    startsAt: data.startsAt
      ? `${formatDate(data.startsAt.date, "dd.MM.yyyy")} ${data.startsAt.time}`
      : "",
    editableUntil: data.editableUntil
      ? formatDate(data.editableUntil, "dd.MM.yyyy HH:mm")
      : "",
    conflict: data.conflict ? formatScheduleConflict(data.conflict, t) : "",
  });
};
