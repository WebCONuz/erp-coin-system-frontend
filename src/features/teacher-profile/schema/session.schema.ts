import { z } from "zod";

export const createTeacherSessionInfoFormSchema = (
  t: (key: string) => string,
) =>
  z.object({
    topic: z.string().optional(),
    startTime: z.string().min(1, t("sessions.schema.startTime_required")),
    endTime: z.string().min(1, t("sessions.schema.endTime_required")),
    roomId: z.string().min(1, t("sessions.schema.room_required")),
  });

export type TeacherSessionInfoFormValues = z.infer<
  ReturnType<typeof createTeacherSessionInfoFormSchema>
>;
