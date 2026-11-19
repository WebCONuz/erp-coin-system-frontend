import { z } from "zod";
import { createTimeSchema } from "@/ustils/time";

export const createTeacherSessionInfoFormSchema = (
  t: (key: string) => string,
) =>
  z.object({
    topic: z.string().optional(),
    startTime: createTimeSchema(t, "sessions.schema.startTime_required"),
    endTime: createTimeSchema(t, "sessions.schema.endTime_required"),
    roomId: z.string().min(1, t("sessions.schema.room_required")),
  });

export type TeacherSessionInfoFormValues = z.infer<
  ReturnType<typeof createTeacherSessionInfoFormSchema>
>;
