import { z } from "zod";

export const createCreateEmployeeSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z
      .string()
      .min(2, t("employees.schema.fullName_min"))
      .max(100, t("employees.schema.fullName_max")),
    phone: z
      .string()
      .min(9, t("employees.schema.phone_min"))
      .max(13, t("employees.schema.phone_max")),
    password: z.string().min(6, t("employees.schema.password_min")),
    roleId: z.string().min(1, t("employees.schema.role_required")),
    email: z
      .string()
      .email(t("employees.schema.email_invalid"))
      .optional()
      .or(z.literal("")),
    parentPhone: z
      .string()
      .min(9, t("employees.schema.parentPhone_min"))
      .max(13, t("employees.schema.phone_max"))
      .optional()
      .or(z.literal("")),
    avatarUrl: z
      .string()
      .url(t("employees.schema.url_invalid"))
      .optional()
      .or(z.literal("")),
  });

export const createEditEmployeeSchema = (t: (key: string) => string) =>
  z.object({
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
      .optional()
      .or(z.literal("")),
    avatarUrl: z
      .string()
      .url(t("employees.schema.url_invalid"))
      .optional()
      .or(z.literal("")),
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
  z
    .object({
      oldPassword: z.string().optional().or(z.literal("")),
      newPassword: z.string().min(6, t("employees.schema.password_min")),
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: t("employees.schema.newPassword_same"),
      path: ["newPassword"],
    });

export type ChangeEmployeePasswordFormValues = z.infer<
  ReturnType<typeof createChangeEmployeePasswordSchema>
>;
