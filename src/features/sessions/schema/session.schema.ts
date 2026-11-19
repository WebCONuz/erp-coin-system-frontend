import { z } from "zod";
import { createTimeSchema, isEndAfterStart } from "@/ustils/time";
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
  z
    .object({
      sessionDate: z.string().min(1, t("sessions.schema.date_required")),
      // Qat'iy HH:MM (backend `9:00` ni rad etadi).
      startTime: createTimeSchema(t, "sessions.schema.startTime_required"),
      endTime: createTimeSchema(t, "sessions.schema.endTime_required"),
      // Turlar ro'yxati backenddan keladi (GET /sessions/types).
      sessionType: z.string().min(1, t("sessions.schema.type_required")),
      evaluationMode: evaluationModeSchema,
      maxScore: createMaxScoreSchema(t),
      groupId: z.string().min(1, t("sessions.schema.group_required")),
      roomId: z.string().min(1, t("sessions.schema.room_required")),
      teacherId: z.string().min(1, t("sessions.schema.teacher_required")),
      subjectId: z.string().optional(),
      topic: z.string().optional(),
    })
    // Backend `INVALID_TIME_RANGE` bilan bir xil qoida.
    .refine((data) => isEndAfterStart(data.startTime, data.endTime), {
      message: t("validation.endAfterStart"),
      path: ["endTime"],
    });

export type SessionFormValues = z.infer<
  ReturnType<typeof createSessionFormSchema>
>;

export const createSessionInfoFormSchema = (t: TFn) =>
  z
    .object({
      topic: z.string().optional(),
      startTime: createTimeSchema(t, "sessions.schema.startTime_required"),
      endTime: createTimeSchema(t, "sessions.schema.endTime_required"),
      roomId: z.string().min(1, t("sessions.schema.room_required")),
      teacherId: z.string().min(1, t("sessions.schema.teacher_required")),
      subjectId: z.string().optional(),
      evaluationMode: evaluationModeSchema,
      maxScore: createMaxScoreSchema(t),
    })
    .refine((data) => isEndAfterStart(data.startTime, data.endTime), {
      message: t("validation.endAfterStart"),
      path: ["endTime"],
    });

export type SessionInfoFormValues = z.infer<
  ReturnType<typeof createSessionInfoFormSchema>
>;
