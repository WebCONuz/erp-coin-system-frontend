import { createAvatarUrlSchema } from "@/ustils/avatar-url";
import { z } from "zod";
import {
  TEXT_LIMITS,
  createPasswordSchema,
  maxLengthMessage,
} from "@/ustils/api-limits";
import { createUsernameSchema } from "@/ustils/username";

export const createCreateEmployeeSchema = (t: (key: string) => string) =>
  z.object({
    username: createUsernameSchema(t),
    fullName: z
      .string()
      .min(2, t("employees.schema.fullName_min"))
      .max(100, t("employees.schema.fullName_max")),
    phone: z
      .string()
      .min(9, t("employees.schema.phone_min"))
      .max(13, t("employees.schema.phone_max")),
    password: createPasswordSchema(t),
    roleId: z.string().min(1, t("employees.schema.role_required")),
    email: z
      .string()
      .email(t("employees.schema.email_invalid"))
      .max(TEXT_LIMITS.EMAIL, maxLengthMessage(t, TEXT_LIMITS.EMAIL))
      .optional()
      .or(z.literal("")),
    parentPhone: z
      .string()
      .min(9, t("employees.schema.parentPhone_min"))
      .max(13, t("employees.schema.phone_max"))
      .optional()
      .or(z.literal("")),
    avatarUrl: createAvatarUrlSchema(t),
  });

export const createEditEmployeeSchema = (t: (key: string) => string) =>
  z.object({
    username: createUsernameSchema(t),
    fullName: z
      .string()
      .min(2, t("employees.schema.fullName_min"))
      .max(100, t("employees.schema.fullName_max")),
    phone: z
      .string()
      .min(9, t("employees.schema.phone_min"))
      .max(13, t("employees.schema.phone_max")),
    roleId: z.string().min(1, t("employees.schema.role_required")),
    email: z
      .string()
      .email(t("employees.schema.email_invalid"))
      .max(TEXT_LIMITS.EMAIL, maxLengthMessage(t, TEXT_LIMITS.EMAIL))
      .optional()
      .or(z.literal("")),
    avatarUrl: createAvatarUrlSchema(t),
  });

export type CreateEmployeeFormValues = z.infer<
  ReturnType<typeof createCreateEmployeeSchema>
>;
export type EditEmployeeFormValues = z.infer<
  ReturnType<typeof createEditEmployeeSchema>
>;

export const createChangeEmployeePasswordSchema = (
  t: (key: string) => string,
) =>
  // Boshqa userning paroli — backend `oldPassword` ni tekshirmaydi (faqat o'z
  // parolida majburiy, u profil modalida).
  z.object({
    newPassword: createPasswordSchema(t),
  });

export type ChangeEmployeePasswordFormValues = z.infer<
  ReturnType<typeof createChangeEmployeePasswordSchema>
>;
