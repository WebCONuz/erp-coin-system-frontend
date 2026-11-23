import * as z from "zod";
import { TEXT_LIMITS, createOptionalTextSchema } from "@/ustils";

export const createCourseFormSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(2, { message: t("courses.schema.title_min") }),
    description: createOptionalTextSchema(t, TEXT_LIMITS.DESCRIPTION),
  });

export type CourseFormValues = z.infer<
  ReturnType<typeof createCourseFormSchema>
>;
