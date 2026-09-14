import { z } from "zod";

export const createBulkGiveCoinSchema = (t: (key: string) => string) =>
  z
    .object({
      mode: z.enum(["rule", "custom"]),
      ruleId: z.string().optional(),
      amount: z.number().int(t("bulkCoin.schema.amount_int")).optional(),
      direction: z.enum(["earn", "deduct"]),
      sourceType: z.enum([
        "attendance",
        "homework",
        "competition",
        "manual",
        "bonus",
        "purchase",
      ]),
      note: z.string().optional(),
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
    );

export type BulkGiveCoinFormValues = z.infer<
  ReturnType<typeof createBulkGiveCoinSchema>
>;
