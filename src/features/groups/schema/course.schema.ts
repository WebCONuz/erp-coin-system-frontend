import * as z from "zod";

export const courseFormSchema = z.object({
  title: z.string().min(2, {
    message: "Kurs nomi kamida 2 ta belgidan iborat bo'lishi kerak",
  }),
  description: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
