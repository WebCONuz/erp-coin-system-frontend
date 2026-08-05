import { z } from "zod";

export const createStudentSchema = z.object({
  fullName: z
    .string()
    .min(2, "F.I.Sh kamida 2 ta belgi bo'lishi kerak")
    .max(100, "F.I.Sh 100 ta belgidan oshmasligi kerak"),
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak")
    .max(13, "Telefon raqam juda uzun"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  roleId: z.string().min(1, "Rol ID majburiy"),
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

export const editStudentSchema = z.object({
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
  parentPhone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam")
    .max(13, "Telefon raqam juda uzun")
    .optional()
    .or(z.literal("")),
});

export type CreateFormValues = z.infer<typeof createStudentSchema>;

export type EditFormValues = z.infer<typeof editStudentSchema>;
