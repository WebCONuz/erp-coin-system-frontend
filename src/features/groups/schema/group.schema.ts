import { z } from "zod";

export const groupFormSchema = z.object({
  name: z
    .string()
    .min(1, "Guruh nomi majburiy")
    .min(2, "Guruh nomi kamida 2 ta belgi bo'lishi kerak")
    .max(100, "Guruh nomi 100 ta belgidan oshmasligi kerak"),

  maxStudents: z
    .number("Son kiriting")
    .int("Butun son kiriting")
    .min(1, "Kamida 1 ta student bo'lishi kerak")
    .max(30, "30 tadan oshmasligi kerak"),

  courseId: z.string().min(1, "Kursni tanlang"),

  teacherId: z.string().min(1, "O'qituvchini tanlang"),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;
