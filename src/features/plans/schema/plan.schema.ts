import { z } from "zod";
import {
  createTimeSchema,
  isEndAfterStart,
  normalizeTime,
  TIME_REGEX,
} from "@/ustils/time";
import { WEEKDAYS } from "../types";
import { GENERATE_SESSIONS_MAX_DAYS } from "../constants";

type TFn = (key: string) => string;

const createTemplateBaseShape = (t: TFn) => ({
  weekday: z.enum(WEEKDAYS),
  groupId: z.string().min(1, t("plans.schema.group_required")),
  roomId: z.string().min(1, t("plans.schema.room_required")),
  teacherId: z.string().min(1, t("plans.schema.teacher_required")),
  subjectId: z.string().optional(),
  // Qat'iy HH:MM (backend `9:00` ni rad etadi).
  startTime: createTimeSchema(t, "sessions.schema.startTime_required"),
  endTime: createTimeSchema(t, "sessions.schema.endTime_required"),
  /** Amal qilish muddati (`YYYY-MM-DD`), bo'sh — cheklov yo'q. */
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
});

// Fan tanlovi faqat "o'quv markaz" bo'lmagan tenantlar uchun ko'rsatiladi va
// shundagina majburiy bo'ladi — ko'rinmaydigan maydonni required qilish
// FormMessage'siz "jim" submit xatosiga olib keladi (TemplateFormModal'da
// avval duch kelingan bug).
// zod 4: refine qilingan obyektni `.extend` qilib bo'lmaydi — avval shakl, keyin refine.
export const getTemplateFormSchema = (subjectRequired: boolean, t: TFn) =>
  z
    .object({
      ...createTemplateBaseShape(t),
      ...(subjectRequired && {
        subjectId: z.string().min(1, t("plans.schema.subject_required")),
      }),
    })
    .refine((data) => isEndAfterStart(data.startTime, data.endTime), {
      message: t("validation.endAfterStart"),
      path: ["endTime"],
    })
    .refine(
      (data) => !data.validFrom || !data.validTo || data.validFrom <= data.validTo,
      { message: t("plans.schema.validRange_invalid"), path: ["validTo"] },
    );

export type TemplateFormValues = z.infer<
  ReturnType<typeof getTemplateFormSchema>
>;

export const createCancelExceptionFormSchema = (_t: TFn) =>
  z.object({
    note: z.string().optional(),
  });

export type CancelExceptionFormValues = z.infer<
  ReturnType<typeof createCancelExceptionFormSchema>
>;

/**
 * Bekor qilinmagan istisno: vaqt (startTime + endTime birga), boshqa xona yoki
 * o'rinbosar o'qituvchidan **kamida bittasi** o'zgarishi kerak. Bo'sh maydon —
 * shablondagisi.
 */
export const createRescheduleExceptionFormSchema = (t: TFn) =>
  z
    .object({
      startTime: z.string().transform(normalizeTime),
      endTime: z.string().transform(normalizeTime),
      roomId: z.string().optional(),
      teacherId: z.string().optional(),
      note: z.string().optional(),
    })
    .refine((d) => !d.startTime || TIME_REGEX.test(d.startTime), {
      message: t("validation.timeFormat"),
      path: ["startTime"],
    })
    .refine((d) => !d.endTime || TIME_REGEX.test(d.endTime), {
      message: t("validation.timeFormat"),
      path: ["endTime"],
    })
    .refine((d) => !!d.startTime === !!d.endTime, {
      message: t("plans.schema.timeBothRequired"),
      path: ["endTime"],
    })
    .refine((d) => isEndAfterStart(d.startTime, d.endTime), {
      message: t("validation.endAfterStart"),
      path: ["endTime"],
    })
    .refine((d) => !!d.startTime || !!d.roomId || !!d.teacherId, {
      message: t("plans.schema.exceptionChangeRequired"),
      path: ["startTime"],
    });

export type RescheduleExceptionFormValues = z.infer<
  ReturnType<typeof createRescheduleExceptionFormSchema>
>;

const DAY_MS = 24 * 60 * 60 * 1000;

/** `fromDate`…`toDate` oralig'idagi kunlar soni (ikkala chekka ham kiradi). */
export const countDaysInclusive = (fromDate: string, toDate: string) =>
  Math.round(
    (new Date(`${toDate}T00:00:00Z`).getTime() -
      new Date(`${fromDate}T00:00:00Z`).getTime()) /
      DAY_MS,
  ) + 1;

export const createGenerateSessionsFormSchema = (t: TFn) =>
  z
    .object({
      fromDate: z.string().min(1, t("plans.schema.fromDate_required")),
      toDate: z.string().min(1, t("plans.schema.toDate_required")),
    })
    // Backend: bir so'rovda ko'pi bilan 92 kun (oshsa 400).
    .refine(
      (d) =>
        !d.fromDate ||
        !d.toDate ||
        countDaysInclusive(d.fromDate, d.toDate) <= GENERATE_SESSIONS_MAX_DAYS,
      { message: t("plans.schema.rangeTooLong"), path: ["toDate"] },
    );

export type GenerateSessionsFormValues = z.infer<
  ReturnType<typeof createGenerateSessionsFormSchema>
>;
