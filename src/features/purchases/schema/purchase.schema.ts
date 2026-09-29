import { z } from "zod";

// Bekor qilishda sabab majburiy — u o'quvchiga ham, coin tarixiga ham yoziladi.
// `restock` faqat bekor qilishda yuboriladi (dona zaxiraga qaytadimi).
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
    restock: z.boolean(),
  });

export type PurchaseStatusFormValues = z.infer<
  ReturnType<typeof createPurchaseStatusSchema>
>;
