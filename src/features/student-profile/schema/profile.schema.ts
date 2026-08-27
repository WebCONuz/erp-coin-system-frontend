import { z } from "zod";

export const editProfileSchema = z.object({
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
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Joriy parolni kiriting"),
    newPassword: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Yangi parol eskisidan farq qilishi kerak",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
