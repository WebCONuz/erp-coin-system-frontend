import { createAvatarUrlSchema } from "@/ustils/avatar-url";
import { z } from "zod";
import {
  TEXT_LIMITS,
  createPasswordSchema,
  maxLengthMessage,
} from "@/ustils/api-limits";
import { createUsernameSchema } from "@/ustils/username";

export const createCreateStudentSchema = (t: (key: string) => string) =>
  z.object({
    username: createUsernameSchema(t),
    fullName: z
      .string()
      .min(2, t("students.schema.fullName_min"))
      .max(100, t("students.schema.fullName_max")),
    phone: z
      .string()
      .min(9, t("students.schema.phone_min"))
      .max(13, t("students.schema.phone_max")),
    password: createPasswordSchema(t),
    roleId: z.string().min(1, t("students.schema.roleId_required")),
    email: z
      .string()
      .email(t("students.schema.email_invalid"))
      .max(TEXT_LIMITS.EMAIL, maxLengthMessage(t, TEXT_LIMITS.EMAIL))
      .optional()
      .or(z.literal("")),
    parentPhone: z
      .string()
      .min(9, t("students.schema.phone_min"))
      .max(13, t("students.schema.phone_max"))
      .optional()
      .or(z.literal("")),
    avatarUrl: createAvatarUrlSchema(t),
  });

export const createEditStudentSchema = (t: (key: string) => string) =>
  z.object({
    username: createUsernameSchema(t),
    fullName: z
      .string()
      .min(2, t("students.schema.fullName_min"))
      .max(100, t("students.schema.fullName_max")),
    phone: z
      .string()
      .min(9, t("students.schema.phone_min"))
      .max(13, t("students.schema.phone_max")),
    email: z
      .string()
      .email(t("students.schema.email_invalid"))
      .max(TEXT_LIMITS.EMAIL, maxLengthMessage(t, TEXT_LIMITS.EMAIL))
      .optional()
      .or(z.literal("")),
    avatarUrl: createAvatarUrlSchema(t),
    parentPhone: z
      .string()
      .min(9, t("students.schema.phone_min"))
      .max(13, t("students.schema.phone_max"))
      .optional()
      .or(z.literal("")),
  });

export type CreateFormValues = z.infer<
  ReturnType<typeof createCreateStudentSchema>
>;

export type EditFormValues = z.infer<
  ReturnType<typeof createEditStudentSchema>
>;
