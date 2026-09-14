import { z } from "zod";
import { WEEKDAYS } from "../types";

type TFn = (key: string) => string;

export const createTemplateFormSchema = (t: TFn) =>
  z.object({
    weekday: z.enum(WEEKDAYS),
    groupId: z.string().min(1, t("plans.schema.group_required")),
    roomId: z.string().min(1, t("plans.schema.room_required")),
    teacherId: z.string().min(1, t("plans.schema.teacher_required")),
    subjectId: z.string().optional(),
    startTime: z.string().min(1, t("sessions.schema.startTime_required")),
    endTime: z.string().min(1, t("sessions.schema.endTime_required")),
  });

// Fan tanlovi faqat "o'quv markaz" bo'lmagan tenantlar uchun ko'rsatiladi va
// shundagina majburiy bo'ladi — ko'rinmaydigan maydonni required qilish
// FormMessage'siz "jim" submit xatosiga olib keladi (TemplateFormModal'da
// avval duch kelingan bug).
export const getTemplateFormSchema = (
  subjectRequired: boolean,
  t: TFn,
) => {
  const base = createTemplateFormSchema(t);
  return subjectRequired
    ? base.extend({
        subjectId: z.string().min(1, t("plans.schema.subject_required")),
      })
    : base;
};

export type TemplateFormValues = z.infer<
  ReturnType<typeof createTemplateFormSchema>
>;

export const createCancelExceptionFormSchema = (_t: TFn) =>
  z.object({
    note: z.string().optional(),
  });

export type CancelExceptionFormValues = z.infer<
  ReturnType<typeof createCancelExceptionFormSchema>
>;

export const createRescheduleExceptionFormSchema = (t: TFn) =>
  z.object({
    startTime: z.string().min(1, t("sessions.schema.startTime_required")),
    endTime: z.string().min(1, t("sessions.schema.endTime_required")),
    note: z.string().optional(),
  });

export type RescheduleExceptionFormValues = z.infer<
  ReturnType<typeof createRescheduleExceptionFormSchema>
>;

export const createGenerateSessionsFormSchema = (t: TFn) =>
  z.object({
    fromDate: z.string().min(1, t("plans.schema.fromDate_required")),
    toDate: z.string().min(1, t("plans.schema.toDate_required")),
  });

export type GenerateSessionsFormValues = z.infer<
  ReturnType<typeof createGenerateSessionsFormSchema>
>;
