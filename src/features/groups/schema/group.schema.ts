import { z } from "zod";

export const createGroupFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("groups.schema.name_required"))
      .min(2, t("groups.schema.name_min"))
      .max(100, t("groups.schema.name_max")),

    maxStudents: z
      .number(t("groups.schema.max_students_number"))
      .int(t("groups.schema.max_students_int"))
      .min(1, t("groups.schema.max_students_min"))
      .max(30, t("groups.schema.max_students_max")),

    courseId: z.string().min(1, t("groups.schema.course_required")),

    teacherId: z.string().min(1, t("groups.schema.teacher_required")),
  });

export type GroupFormValues = z.infer<ReturnType<typeof createGroupFormSchema>>;
