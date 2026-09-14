import { z } from "zod";

type TFn = (key: string) => string;

export const createSessionFormSchema = (t: TFn) =>
  z.object({
    sessionDate: z.string().min(1, t("sessions.schema.date_required")),
    startTime: z.string().min(1, t("sessions.schema.startTime_required")),
    endTime: z.string().min(1, t("sessions.schema.endTime_required")),
    sessionType: z.enum(["lesson", "exam", "trial"], {
      message: t("sessions.schema.type_required"),
    }),
    groupId: z.string().min(1, t("sessions.schema.group_required")),
    roomId: z.string().min(1, t("sessions.schema.room_required")),
    teacherId: z.string().min(1, t("sessions.schema.teacher_required")),
    subjectId: z.string().optional(),
    topic: z.string().optional(),
  });

export type SessionFormValues = z.infer<
  ReturnType<typeof createSessionFormSchema>
>;

export const createSessionInfoFormSchema = (t: TFn) =>
  z.object({
    topic: z.string().optional(),
    startTime: z.string().min(1, t("sessions.schema.startTime_required")),
    endTime: z.string().min(1, t("sessions.schema.endTime_required")),
    roomId: z.string().min(1, t("sessions.schema.room_required")),
    teacherId: z.string().min(1, t("sessions.schema.teacher_required")),
    subjectId: z.string().optional(),
  });

export type SessionInfoFormValues = z.infer<
  ReturnType<typeof createSessionInfoFormSchema>
>;
