import { z } from "zod";

export const teacherSessionInfoFormSchema = z.object({
  topic: z.string().optional(),
  startTime: z.string().min(1, "Boshlanish vaqti kiritilishi shart"),
  endTime: z.string().min(1, "Tugash vaqti kiritilishi shart"),
  roomId: z.string().min(1, "Xonani tanlang"),
});

export type TeacherSessionInfoFormValues = z.infer<
  typeof teacherSessionInfoFormSchema
>;
