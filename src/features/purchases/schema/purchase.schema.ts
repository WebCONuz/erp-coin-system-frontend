import { z } from "zod";

// Bekor qilishda sabab majburiy — u o'quvchiga ham, coin tarixiga ham yoziladi.
export const createPurchaseStatusSchema = (
  t: (key: string) => string,
  isNoteRequired: boolean,
) =>
  z.object({
    adminNote: isNoteRequired
      ? z
          .string()
          .trim()
          .min(1, t("purchases.schema.reason_required"))
          .max(500, t("purchases.schema.note_max"))
      : z.string().trim().max(500, t("purchases.schema.note_max")),
  });

export type PurchaseStatusFormValues = z.infer<
  ReturnType<typeof createPurchaseStatusSchema>
>;
