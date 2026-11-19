import { z } from "zod";

type TFn = (key: string) => string;

export const createHolidayFormSchema = (t: TFn) =>
  z.object({
    date: z.string().min(1, t("holidays.schema.date_required")),
    name: z
      .string()
      .trim()
      .min(1, t("holidays.schema.name_required"))
      .max(100, t("holidays.schema.name_max")),
  });

export type HolidayFormValues = z.infer<
  ReturnType<typeof createHolidayFormSchema>
>;
