import { z } from "zod";

export const createEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(2, "F.I.Sh kamida 2 ta belgi bo'lishi kerak")
    .max(100, "F.I.Sh 100 ta belgidan oshmasligi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak")
    .max(13, "Telefon raqam juda uzun"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  roleId: z.string().min(1, "Rol tanlanishi shart"),
  email: z
    .string()
    .email("Email noto'g'ri formatda")
    .optional()
    .or(z.literal("")),
  parentPhone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam")
    .max(13, "Telefon raqam juda uzun")
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("URL noto'g'ri formatda")
    .optional()
    .or(z.literal("")),
});

export const editEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(2, "F.I.Sh kamida 2 ta belgi bo'lishi kerak")
    .max(100, "F.I.Sh 100 ta belgidan oshmasligi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak")
    .max(13, "Telefon raqam juda uzun"),
  roleId: z.string().min(1, "Rol tanlanishi shart"),
  email: z
    .string()
    .email("Email noto'g'ri formatda")
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("URL noto'g'ri formatda")
    .optional()
    .or(z.literal("")),
});

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;
export type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>;

export const changeEmployeePasswordSchema = z
  .object({
    oldPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Yangi parol eskisidan farq qilishi kerak",
    path: ["newPassword"],
  });

export type ChangeEmployeePasswordFormValues = z.infer<
  typeof changeEmployeePasswordSchema
>;
