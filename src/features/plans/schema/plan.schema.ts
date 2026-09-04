import { z } from "zod";
import { WEEKDAYS } from "../types";

export const templateFormSchema = z.object({
  weekday: z.enum(WEEKDAYS),
  groupId: z.string().min(1, "Guruh tanlanishi shart"),
  roomId: z.string().min(1, "Xona tanlanishi shart"),
  teacherId: z.string().min(1, "O'qituvchini tanlang"),
  subjectId: z.string().optional(),
  startTime: z.string().min(1, "Boshlanish vaqti kiritilishi shart"),
  endTime: z.string().min(1, "Tugash vaqti kiritilishi shart"),
});

// Fan tanlovi faqat "o'quv markaz" bo'lmagan tenantlar uchun ko'rsatiladi va
// shundagina majburiy bo'ladi — ko'rinmaydigan maydonni required qilish
// FormMessage'siz "jim" submit xatosiga olib keladi (TemplateFormModal'da
// avval duch kelingan bug).
export const getTemplateFormSchema = (subjectRequired: boolean) =>
  subjectRequired
    ? templateFormSchema.extend({
        subjectId: z.string().min(1, "Fan tanlanishi shart"),
      })
    : templateFormSchema;

export type TemplateFormValues = z.infer<typeof templateFormSchema>;

export const cancelExceptionFormSchema = z.object({
  note: z.string().optional(),
});

export type CancelExceptionFormValues = z.infer<
  typeof cancelExceptionFormSchema
>;

export const rescheduleExceptionFormSchema = z.object({
  startTime: z.string().min(1, "Boshlanish vaqti kiritilishi shart"),
  endTime: z.string().min(1, "Tugash vaqti kiritilishi shart"),
  note: z.string().optional(),
});

export type RescheduleExceptionFormValues = z.infer<
  typeof rescheduleExceptionFormSchema
>;

export const generateSessionsFormSchema = z.object({
  fromDate: z.string().min(1, "Boshlanish sanasi kiritilishi shart"),
  toDate: z.string().min(1, "Tugash sanasi kiritilishi shart"),
});

export type GenerateSessionsFormValues = z.infer<
  typeof generateSessionsFormSchema
>;
