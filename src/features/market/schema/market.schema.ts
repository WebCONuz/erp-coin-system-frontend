import { z } from "zod";
import {
  TEXT_LIMITS,
  createOptionalTextSchema,
  isValidImageUrl,
} from "@/ustils";

type TFn = (key: string, options?: Record<string, unknown>) => string;

// `currentStock` — faqat tahrirlashda: `stockDelta` zaxirani 0 dan pastga
// tushirmasligini tekshirish uchun (backend ham 400 qaytaradi).
export const createRewardFormSchema = (t: TFn, currentStock?: number) =>
  z
    .object({
      title: z.string().min(1, t("market.schema.title_required")),
      description: createOptionalTextSchema(t, TEXT_LIMITS.DESCRIPTION),
      // Backend: `/uploads/...` yoki `https://...`, ≤500 belgi; `""` — rasmni olib tashlash.
      imageUrl: z
        .string()
        .trim()
        .max(
          TEXT_LIMITS.IMAGE_URL,
          t("validation.maxLength", { max: TEXT_LIMITS.IMAGE_URL }),
        )
        .refine((value) => !value || isValidImageUrl(value), {
          message: t("market.schema.url_invalid"),
        })
        .optional()
        .or(z.literal("")),
      coinPrice: z.number().min(1, t("market.schema.price_min")),
      // "delta" — nisbiy o'zgarish (kundalik), "exact" — aniq qiymat / cheksiz.
      stockMode: z.enum(["delta", "exact"]),
      isUnlimited: z.boolean(),
      stock: z.number().int().min(0, t("market.schema.stock_min")),
      stockDelta: z.number().int(),
      rewardType: z.enum(["physical", "digital", "privilege"]),
      categoryId: z.string().min(1, t("market.schema.category_required")),
    })
    .refine(
      (data) =>
        data.stockMode !== "delta" ||
        currentStock === undefined ||
        currentStock + data.stockDelta >= 0,
      {
        message: t("market.schema.stockDelta_min"),
        path: ["stockDelta"],
      },
    );

export type RewardFormValues = z.infer<ReturnType<typeof createRewardFormSchema>>;

export const createRewardCategoryFormSchema = (t: TFn) =>
  z.object({
    name: z.string().min(2, { message: t("market.schema.categoryName_min") }),
  });

export type RewardCategoryFormValues = z.infer<
  ReturnType<typeof createRewardCategoryFormSchema>
>;
