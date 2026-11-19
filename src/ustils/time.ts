import { z } from "zod";

type TFn = (key: string) => string;

/** Backend qoidasi: qat'iy `HH:MM`, soat doim ikki xonali (`09:00`, `9:00` emas). */
export const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/** `<input type="time">` ba'zi brauzerlarda `HH:MM:SS` beradi — sekundlarni tashlaymiz. */
export const normalizeTime = (value: string) => value.trim().slice(0, 5);

export const createTimeSchema = (t: TFn, requiredKey: string) =>
  z
    .string()
    .transform(normalizeTime)
    .refine((value) => value.length > 0, { message: t(requiredKey) })
    .refine((value) => !value || TIME_REGEX.test(value), {
      message: t("validation.timeFormat"),
    });

/** `HH:MM` satrlari leksikografik taqqoslanadi — format qat'iy bo'lgani uchun to'g'ri. */
export const isEndAfterStart = (startTime?: string, endTime?: string) =>
  !startTime || !endTime || endTime > startTime;
