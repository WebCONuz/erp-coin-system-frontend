import { z } from "zod";

type TFn = (key: string) => string;

export const createRewardFormSchema = (t: TFn) =>
  z.object({
    title: z.string().min(1, t("market.schema.title_required")),
    description: z.string().optional(),
    imageUrl: z
      .string()
      .url(t("market.schema.url_invalid"))
      .optional()
      .or(z.literal("")),
    coinPrice: z.number().min(1, t("market.schema.price_min")),
    stock: z.number().min(0, t("market.schema.stock_min")),
    rewardType: z.enum(["physical", "digital", "privilege"]),
    categoryId: z.string().min(1, t("market.schema.category_required")),
  });

export type RewardFormValues = z.infer<ReturnType<typeof createRewardFormSchema>>;

export const createRewardCategoryFormSchema = (t: TFn) =>
  z.object({
    name: z.string().min(2, { message: t("market.schema.categoryName_min") }),
  });

export type RewardCategoryFormValues = z.infer<
  ReturnType<typeof createRewardCategoryFormSchema>
>;
