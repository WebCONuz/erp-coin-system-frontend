import { z } from "zod";

export const subjectFormSchema = z.object({
  name: z.string().min(1, "Fan nomi kiritilishi shart"),
  description: z.string().optional(),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;
