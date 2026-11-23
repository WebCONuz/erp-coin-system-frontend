import { z } from "zod";
import { TEXT_LIMITS, createOptionalTextSchema } from "@/ustils";

export const createSubjectFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("subjects.schema.name_required")),
    description: createOptionalTextSchema(t, TEXT_LIMITS.DESCRIPTION),
  });

export type SubjectFormValues = z.infer<
  ReturnType<typeof createSubjectFormSchema>
>;
