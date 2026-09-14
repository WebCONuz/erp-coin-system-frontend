import { z } from "zod";

export const createSubjectFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("subjects.schema.name_required")),
    description: z.string().optional(),
  });

export type SubjectFormValues = z.infer<
  ReturnType<typeof createSubjectFormSchema>
>;
