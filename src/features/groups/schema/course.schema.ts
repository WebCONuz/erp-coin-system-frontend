import * as z from "zod";

export const createCourseFormSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(2, { message: t("courses.schema.title_min") }),
    description: z.string().optional(),
  });

export type CourseFormValues = z.infer<
  ReturnType<typeof createCourseFormSchema>
>;
