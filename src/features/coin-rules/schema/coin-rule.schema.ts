import { z } from "zod";
import {
  COIN_RULE_AMOUNT_MAX,
  COIN_RULE_DESCRIPTION_MAX,
} from "../constants";

type TFn = (key: string, options?: Record<string, unknown>) => string;

/**
 * @param maxAmount teacher uchun tenant limiti (`teacherCoinLimit`);
 * berilmasa umumiy chegara — 100 000.
 */
export const createCoinRuleFormSchema = (t: TFn, maxAmount?: number | null) => {
  const max = maxAmount ?? COIN_RULE_AMOUNT_MAX;
  return z
    .object({
      name: z.string().min(1, t("coinRules.schema.name_required")),
      coinAmount: z
        .number()
        .int(t("bulkCoin.schema.amount_int"))
        .min(1, t("coinRules.schema.amount_min"))
        .max(max, t("bulkCoin.schema.amount_max", { max })),
      direction: z.enum(["earn", "deduct"], {
        message: t("coinRules.schema.direction_required"),
      }),
      triggerType: z.enum(["auto", "manual"], {
        message: t("coinRules.schema.triggerType_required"),
      }),
      sourceType: z
        .enum([
          "attendance",
          "late",
          "homework",
          "competition",
          "bonus",
          "penalty",
        ])
        .optional(),
      description: z
        .string()
        .max(
          COIN_RULE_DESCRIPTION_MAX,
          t("coinRules.schema.description_max", {
            max: COIN_RULE_DESCRIPTION_MAX,
          }),
        )
        .optional(),
      groupId: z.string().optional(),
    })
    .refine((data) => data.triggerType !== "auto" || !!data.sourceType, {
      message: t("coinRules.schema.sourceType_required"),
      path: ["sourceType"],
    });
};

export type CoinRuleFormValues = z.infer<
  ReturnType<typeof createCoinRuleFormSchema>
>;
