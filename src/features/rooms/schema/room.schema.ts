import { z } from "zod";

export const roomFormSchema = z.object({
  name: z.string().min(1, "Xona nomi kiritilishi shart"),
  capacity: z
    .number()
    .min(1, "Sig'im kamida 1 bo'lishi kerak")
    .max(300, "Sig'im 300 dan oshmasligi kerak"),
  description: z.string().optional(),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;
