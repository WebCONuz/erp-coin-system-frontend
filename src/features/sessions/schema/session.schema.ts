import { z } from "zod";
import { MAX_SCORE_LIMIT } from "../constants";

type TFn = (key: string, options?: Record<string, unknown>) => string;

// Input string sifatida saqlanadi; bo'sh — ball yuqoridan cheklanmaydi.
const createMaxScoreSchema = (t: TFn) =>
  z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const num = Number(value);
        return Number.isInteger(num) && num >= 1 && num <= MAX_SCORE_LIMIT;
      },
      { message: t("sessions.schema.maxScore_invalid", { max: MAX_SCORE_LIMIT }) },
    );

const evaluationModeSchema = z.enum(["attendance", "scored"]).optional();

export const createSessionFormSchema = (t: TFn) =>
  z.object({
    sessionDate: z.string().min(1, t("sessions.schema.date_required")),
    startTime: z.string().min(1, t("sessions.schema.startTime_required")),
    endTime: z.string().min(1, t("sessions.schema.endTime_required")),
    // Turlar ro'yxati backenddan keladi (GET /sessions/types).
    sessionType: z.string().min(1, t("sessions.schema.type_required")),
    evaluationMode: evaluationModeSchema,
    maxScore: createMaxScoreSchema(t),
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
    evaluationMode: evaluationModeSchema,
    maxScore: createMaxScoreSchema(t),
  });

export type SessionInfoFormValues = z.infer<
  ReturnType<typeof createSessionInfoFormSchema>
>;
