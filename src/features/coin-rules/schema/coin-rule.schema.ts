import { z } from "zod";

export const createCoinRuleFormSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(1, t("coinRules.schema.name_required")),
      coinAmount: z
        .number()
        .min(1, t("coinRules.schema.amount_min")),
      direction: z.enum(["earn", "deduct"], {
        message: t("coinRules.schema.direction_required"),
      }),
      triggerType: z.enum(["auto", "manual"], {
        message: t("coinRules.schema.triggerType_required"),
      }),
      sourceType: z
        .enum(["attendance", "homework", "competition", "bonus", "penalty"])
        .optional(),
      description: z.string().optional(),
      groupId: z.string().optional(),
    })
    .refine((data) => data.triggerType !== "auto" || !!data.sourceType, {
      message: t("coinRules.schema.sourceType_required"),
      path: ["sourceType"],
    });

export type CoinRuleFormValues = z.infer<
  ReturnType<typeof createCoinRuleFormSchema>
>;
