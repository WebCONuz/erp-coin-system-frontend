import { z } from "zod";

export const roleFormSchema = z.object({
  name: z.string().min(2, "Rol nomi kamida 2 ta belgidan iborat bo'lishi kerak"),
  displayName: z
    .string()
    .min(2, "Ko'rsatiladigan nom kamida 2 ta belgidan iborat bo'lishi kerak"),
  level: z.number().min(0, "Daraja manfiy bo'lishi mumkin emas"),
  scope: z.string().min(1, "Scope kiritilishi shart"),
  canDelete: z.boolean(),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
