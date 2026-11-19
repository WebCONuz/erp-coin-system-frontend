import { z } from "zod";
import {
  COIN_NOTE_MAX,
  MANUAL_COIN_MAX,
  MANUAL_COIN_SOURCE_TYPES,
} from "../constants";

type TFn = (key: string, options?: Record<string, unknown>) => string;

/**
 * @param maxAmount teacher uchun tenant limiti (`teacherCoinLimit`); berilmasa
 * umumiy chegara — 100 000.
 */
export const createBulkGiveCoinSchema = (t: TFn, maxAmount?: number | null) => {
  const max = maxAmount ?? MANUAL_COIN_MAX;
  return z
    .object({
      mode: z.enum(["rule", "custom"]),
      ruleId: z.string().optional(),
      amount: z.number().int(t("bulkCoin.schema.amount_int")).optional(),
      direction: z.enum(["earn", "deduct"]),
      sourceType: z.enum(MANUAL_COIN_SOURCE_TYPES),
      note: z
        .string()
        .max(COIN_NOTE_MAX, t("bulkCoin.schema.note_max", { max: COIN_NOTE_MAX }))
        .optional(),
    })
    .refine((data) => data.mode !== "rule" || !!data.ruleId, {
      message: t("bulkCoin.schema.rule_required"),
      path: ["ruleId"],
    })
    .refine(
      (data) => data.mode !== "custom" || (!!data.amount && data.amount >= 1),
      {
        message: t("bulkCoin.schema.amount_invalid"),
        path: ["amount"],
      },
    )
    .refine(
      (data) => data.mode !== "custom" || !data.amount || data.amount <= max,
      {
        message: t("bulkCoin.schema.amount_max", { max }),
        path: ["amount"],
      },
    );
};

export type BulkGiveCoinFormValues = z.infer<
  ReturnType<typeof createBulkGiveCoinSchema>
>;
