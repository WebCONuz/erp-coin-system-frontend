import { z } from "zod";
import { createUsernameSchema } from "@/ustils/username";

type TFn = (key: string) => string;

const PHONE_REGEX = /^\+998\d{9}$/;

export const createMyProfileSchema = (t: TFn) =>
  z.object({
    username: createUsernameSchema(t),
    fullName: z
      .string()
      .trim()
      .min(1, t("profile.schema.fullName_required"))
      .max(150, t("profile.schema.fullName_max")),
    phone: z.string().trim().regex(PHONE_REGEX, t("profile.schema.phone_invalid")),
    parentPhone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, t("profile.schema.phone_invalid"))
      .optional()
      .or(z.literal("")),
    email: z
      .string()
      .trim()
      .email(t("profile.schema.email_invalid"))
      .optional()
      .or(z.literal("")),
    avatarUrl: z.string().trim().optional().or(z.literal("")),
  });

export type MyProfileFormValues = z.infer<
  ReturnType<typeof createMyProfileSchema>
>;

export const createChangeMyPasswordSchema = (t: TFn) =>
  z
    .object({
      oldPassword: z.string().min(1, t("profile.schema.oldPassword_required")),
      newPassword: z.string().min(6, t("profile.schema.password_min")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: t("profile.schema.newPassword_same"),
      path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("profile.schema.confirmPassword_mismatch"),
      path: ["confirmPassword"],
    });

export type ChangeMyPasswordFormValues = z.infer<
  ReturnType<typeof createChangeMyPasswordSchema>
>;
