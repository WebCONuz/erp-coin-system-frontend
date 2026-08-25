import { z } from "zod";

export const coinRuleFormSchema = z
  .object({
    name: z.string().min(1, "Nomi kiritilishi shart"),
    coinAmount: z
      .number()
      .min(1, "Tanga miqdori kamida 1 bo'lishi kerak"),
    direction: z.enum(["earn", "deduct"], {
      message: "Yo'nalishni tanlang",
    }),
    triggerType: z.enum(["auto", "manual"], {
      message: "Ishga tushirish turini tanlang",
    }),
    sourceType: z
      .enum(["attendance", "homework", "competition", "bonus", "penalty"])
      .optional(),
    description: z.string().optional(),
    groupId: z.string().optional(),
  })
  .refine((data) => data.triggerType !== "auto" || !!data.sourceType, {
    message: "Avtomatik qoida uchun manba turi tanlanishi shart",
    path: ["sourceType"],
  });

export type CoinRuleFormValues = z.infer<typeof coinRuleFormSchema>;
