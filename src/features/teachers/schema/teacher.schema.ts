import { z } from "zod";

export const createTeacherSchema = z.object({
  fullName: z
    .string()
    .min(2, "F.I.Sh kamida 2 ta belgi bo'lishi kerak")
    .max(100, "F.I.Sh 100 ta belgidan oshmasligi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak")
    .max(13, "Telefon raqam juda uzun"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
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

export const editTeacherSchema = z.object({
  fullName: z
    .string()
    .min(2, "F.I.Sh kamida 2 ta belgi bo'lishi kerak")
    .max(100, "F.I.Sh 100 ta belgidan oshmasligi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak")
    .max(13, "Telefon raqam juda uzun"),
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

export type CreateTeacherFormValues = z.infer<typeof createTeacherSchema>;
export type EditTeacherFormValues = z.infer<typeof editTeacherSchema>;

export const changeTeacherPasswordSchema = z
  .object({
    oldPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Yangi parol eskisidan farq qilishi kerak",
    path: ["newPassword"],
  });

export type ChangeTeacherPasswordFormValues = z.infer<
  typeof changeTeacherPasswordSchema
>;
