import { z } from "zod";

export const rewardFormSchema = z.object({
  title: z.string().min(1, "Sovg'a nomi kiritilishi shart"),
  description: z.string().optional(),
  coinPrice: z.number().min(1, "Narx 0 dan katta bo'lishi kerak"),
  stock: z.number().min(0, "Dona soni manfiy bo'lishi mumkin emas"),
  rewardType: z.enum(["physical", "digital", "privilege"]),
});

export type RewardFormValues = z.infer<typeof rewardFormSchema>;
