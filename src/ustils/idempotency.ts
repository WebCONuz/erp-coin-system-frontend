import { getApiErrorStatus } from "./username";

/**
 * Coin berish/ayirish va xarid so'rovlari (`manual`, `bulk-manual`,
 * `apply-rule`, `rewards/:id/purchase`) uchun majburiy header.
 * Qoida: har bir yangi amal — yangi kalit; o'sha amalni qayta yuborish — o'sha kalit.
 */
export const IDEMPOTENCY_HEADER = "Idempotency-Key";

/** Backend javobni takrorlaganda (amal qayta bajarilmagan) qo'yadigan header. */
export const IDEMPOTENT_REPLAYED_HEADER = "idempotent-replayed";

// `crypto.randomUUID` faqat secure context (https / localhost) da mavjud —
// http orqali ochilgan deploy'da ham ishlashi uchun zaxira variant.
export const createIdempotencyKey = (): string => {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b: number) => b.toString(16).padStart(2, "0")).join(
    "",
  );
};

export const idempotencyHeaders = (key: string) => ({
  [IDEMPOTENCY_HEADER]: key,
});

/**
 * Xatodan keyin kalitni saqlab qolish kerakmi. Javob kelmagan (tarmoq xatosi /
 * timeout), so'rov hali bajarilayotgan (`409 IDEMPOTENCY_REQUEST_IN_PROGRESS`)
 * yoki server xatosi (5xx) holatida amal bajarilgan bo'lishi mumkin — qayta
 * yuborishda o'sha kalit ishlatilsa, coin ikki marta berilmaydi. Boshqa 4xx
 * xatolarda backend kalitni bo'shatadi, keyingi urinish uchun yangisi olinadi.
 */
export const shouldKeepIdempotencyKey = (error: unknown) => {
  const status = getApiErrorStatus(error);
  if (status === undefined) return true;
  if (status >= 500) return true;
  const code = (error as { data?: { code?: string } } | undefined)?.data?.code;
  return code === "IDEMPOTENCY_REQUEST_IN_PROGRESS";
};
