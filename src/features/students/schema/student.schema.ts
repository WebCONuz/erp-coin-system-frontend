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
  password: z.string().min(4, "Parol kamida 4 ta belgi bo'lishi kerak"),
  roleId: z.string().min(1, "Rol ID majburiy"),
});

export const editStudentSchema = z.object({
  fullName: z
    .string()
    .min(2, "F.I.Sh kamida 2 ta belgi bo'lishi kerak")
    .max(100, "F.I.Sh 100 ta belgidan oshmasligi kerak")
    .optional(),
  phone: z
    .string()
    .min(9, "Telefon raqam kamida 9 ta raqam bo'lishi kerak")
    .max(13, "Telefon raqam juda uzun")
    .optional(),
  password: z.string().min(4, "Parol kamida 4 ta belgi bo'lishi kerak").or(z.literal("")).optional(),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
export type EditStudentFormValues = z.infer<typeof editStudentSchema>;
