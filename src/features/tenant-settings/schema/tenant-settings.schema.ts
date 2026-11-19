import { z } from "zod";
import { COIN_AMOUNT_MAX, COIN_AMOUNT_MIN } from "../constants";

type TFn = (key: string, options?: Record<string, unknown>) => string;

export const createTenantSettingsSchema = (t: TFn) =>
  z.object({
    // Input string sifatida saqlanadi; bo'sh — limit yo'q (`null`).
    teacherCoinLimit: z
      .string()
      .trim()
      .refine(
        (value) => {
          if (!value) return true;
          const num = Number(value);
          return (
            Number.isInteger(num) &&
            num >= COIN_AMOUNT_MIN &&
            num <= COIN_AMOUNT_MAX
          );
        },
        {
          message: t("tenantSettings.schema.limit_invalid", {
            min: COIN_AMOUNT_MIN,
            max: COIN_AMOUNT_MAX,
          }),
        },
      ),
    timezone: z.string().min(1, t("tenantSettings.schema.timezone_required")),
  });

export type TenantSettingsFormValues = z.infer<
  ReturnType<typeof createTenantSettingsSchema>
>;
