import * as z from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(9, {
      message: "Telefon raqam kamida 9 ta raqamdan iborat bo'lishi kerak",
    })
    .max(13, { message: "Telefon raqam juda uzun" }),
  password: z
    .string()
    .min(4, { message: "Parol kamida 4 ta belgi bo'lishi kerak" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
