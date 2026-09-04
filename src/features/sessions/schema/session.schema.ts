import { z } from "zod";

export const sessionFormSchema = z.object({
  sessionDate: z.string().min(1, "Sana kiritilishi shart"),
  startTime: z.string().min(1, "Boshlanish vaqti kiritilishi shart"),
  endTime: z.string().min(1, "Tugash vaqti kiritilishi shart"),
  sessionType: z.enum(["lesson", "exam", "trial"], {
    message: "Dars turini tanlang",
  }),
  groupId: z.string().min(1, "Guruhni tanlang"),
  roomId: z.string().min(1, "Xonani tanlang"),
  teacherId: z.string().min(1, "O'qituvchini tanlang"),
  subjectId: z.string().optional(),
  topic: z.string().optional(),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;

export const sessionInfoFormSchema = z.object({
  topic: z.string().optional(),
  startTime: z.string().min(1, "Boshlanish vaqti kiritilishi shart"),
  endTime: z.string().min(1, "Tugash vaqti kiritilishi shart"),
  roomId: z.string().min(1, "Xonani tanlang"),
  teacherId: z.string().min(1, "O'qituvchini tanlang"),
  subjectId: z.string().optional(),
});

export type SessionInfoFormValues = z.infer<typeof sessionInfoFormSchema>;
