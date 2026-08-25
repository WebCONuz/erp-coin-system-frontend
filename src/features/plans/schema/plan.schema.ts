import { z } from "zod";
import { WEEKDAYS } from "../types";

export const templateFormSchema = z.object({
  weekday: z.enum(WEEKDAYS),
  groupId: z.string().min(1, "Guruh tanlanishi shart"),
  roomId: z.string().min(1, "Xona tanlanishi shart"),
  teacherId: z.string().min(1, "O'qituvchini tanlang"),
  startTime: z.string().min(1, "Boshlanish vaqti kiritilishi shart"),
  endTime: z.string().min(1, "Tugash vaqti kiritilishi shart"),
});

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
