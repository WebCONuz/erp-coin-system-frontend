import { z } from "zod";

export const createCreateStudentSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z
      .string()
      .min(2, t("students.schema.fullName_min"))
      .max(100, t("students.schema.fullName_max")),
    phone: z
      .string()
      .min(9, t("students.schema.phone_min"))
      .max(13, t("students.schema.phone_max")),
    password: z.string().min(6, t("students.schema.password_min")),
    roleId: z.string().min(1, t("students.schema.roleId_required")),
    email: z
      .string()
      .email(t("students.schema.email_invalid"))
      .optional()
      .or(z.literal("")),
    parentPhone: z
      .string()
      .min(9, t("students.schema.phone_min"))
      .max(13, t("students.schema.phone_max"))
      .optional()
      .or(z.literal("")),
    avatarUrl: z
      .string()
      .url(t("students.schema.url_invalid"))
      .optional()
      .or(z.literal("")),
  });

export const createEditStudentSchema = (t: (key: string) => string) =>
  z.object({
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
      .optional()
      .or(z.literal("")),
    avatarUrl: z
      .string()
      .url(t("students.schema.url_invalid"))
      .optional()
      .or(z.literal("")),
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
