import { z } from "zod";
import { createTimeSchema } from "@/ustils/time";
import { TEXT_LIMITS, createOptionalTextSchema } from "@/ustils/api-limits";

export const createTeacherSessionInfoFormSchema = (
  t: (key: string) => string,
) =>
  z.object({
    topic: createOptionalTextSchema(t, TEXT_LIMITS.TOPIC),
    startTime: createTimeSchema(t, "sessions.schema.startTime_required"),
    endTime: createTimeSchema(t, "sessions.schema.endTime_required"),
    roomId: z.string().min(1, t("sessions.schema.room_required")),
  });

export type TeacherSessionInfoFormValues = z.infer<
  ReturnType<typeof createTeacherSessionInfoFormSchema>
>;
