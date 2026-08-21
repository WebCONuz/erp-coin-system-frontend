import { z } from "zod";

export const rewardFormSchema = z.object({
  title: z.string().min(1, "Sovg'a nomi kiritilishi shart"),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url("To'g'ri URL kiriting")
    .optional()
    .or(z.literal("")),
  coinPrice: z.number().min(1, "Narx 0 dan katta bo'lishi kerak"),
  stock: z.number().min(0, "Dona soni manfiy bo'lishi mumkin emas"),
  rewardType: z.enum(["physical", "digital", "privilege"]),
  categoryId: z.string().min(1, "Kategoriya tanlanishi shart"),
});

export type RewardFormValues = z.infer<typeof rewardFormSchema>;

export const rewardCategoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Kategoriya nomi kamida 2 ta belgidan iborat bo'lishi kerak",
  }),
});

export type RewardCategoryFormValues = z.infer<
  typeof rewardCategoryFormSchema
>;
