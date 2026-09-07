import { z } from "zod";

export const bulkGiveCoinSchema = z
  .object({
    mode: z.enum(["rule", "custom"]),
    ruleId: z.string().optional(),
    amount: z.number().int("Butun son kiriting").optional(),
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
    message: "Tanga qoidasini tanlang",
    path: ["ruleId"],
  })
  .refine(
    (data) => data.mode !== "custom" || (!!data.amount && data.amount >= 1),
    {
      message: "Miqdorni to'g'ri kiriting",
      path: ["amount"],
    },
  );

export type BulkGiveCoinFormValues = z.infer<typeof bulkGiveCoinSchema>;
