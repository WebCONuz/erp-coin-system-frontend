import { createAvatarUrlSchema } from "@/ustils/avatar-url";
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
    avatarUrl: createAvatarUrlSchema(t),
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
    avatarUrl: createAvatarUrlSchema(t),
  });

export type CreateTeacherFormValues = z.infer<
  ReturnType<typeof createCreateTeacherSchema>
>;
export type EditTeacherFormValues = z.infer<
  ReturnType<typeof createEditTeacherSchema>
>;

export const createChangeTeacherPasswordSchema = (t: TFn) =>
  // Boshqa userning paroli — backend `oldPassword` ni tekshirmaydi (faqat o'z
  // parolida majburiy, u profil modalida).
  z.object({
    newPassword: z.string().min(6, t("teachers.schema.password_min")),
  });

export type ChangeTeacherPasswordFormValues = z.infer<
  ReturnType<typeof createChangeTeacherPasswordSchema>
>;
