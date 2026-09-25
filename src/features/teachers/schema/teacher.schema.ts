import { z } from "zod";
import { createUsernameSchema } from "@/ustils/username";

type TFn = (key: string) => string;

export const createCreateTeacherSchema = (t: TFn) =>
  z.object({
    username: createUsernameSchema(t),
    fullName: z
      .string()
      .min(2, t("teachers.schema.fullName_min"))
      .max(100, t("teachers.schema.fullName_max")),
    phone: z
      .string()
      .min(9, t("teachers.schema.phone_min"))
      .max(13, t("teachers.schema.phone_max")),
    password: z.string().min(6, t("teachers.schema.password_min")),
    email: z
      .string()
      .email(t("teachers.schema.email_invalid"))
      .optional()
      .or(z.literal("")),
    avatarUrl: z
      .string()
      .url(t("teachers.schema.url_invalid"))
      .optional()
      .or(z.literal("")),
  });

export const createEditTeacherSchema = (t: TFn) =>
  z.object({
    username: createUsernameSchema(t),
    fullName: z
      .string()
      .min(2, t("teachers.schema.fullName_min"))
      .max(100, t("teachers.schema.fullName_max")),
    phone: z
      .string()
      .min(9, t("teachers.schema.phone_min"))
      .max(13, t("teachers.schema.phone_max")),
    email: z
      .string()
      .email(t("teachers.schema.email_invalid"))
      .optional()
      .or(z.literal("")),
    avatarUrl: z
      .string()
      .url(t("teachers.schema.url_invalid"))
      .optional()
      .or(z.literal("")),
  });

export type CreateTeacherFormValues = z.infer<
  ReturnType<typeof createCreateTeacherSchema>
>;
export type EditTeacherFormValues = z.infer<
  ReturnType<typeof createEditTeacherSchema>
>;

export const createChangeTeacherPasswordSchema = (t: TFn) =>
  z
    .object({
      oldPassword: z.string().optional().or(z.literal("")),
      newPassword: z.string().min(6, t("teachers.schema.password_min")),
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: t("teachers.schema.newPassword_sameAsOld"),
      path: ["newPassword"],
    });

export type ChangeTeacherPasswordFormValues = z.infer<
  ReturnType<typeof createChangeTeacherPasswordSchema>
>;
