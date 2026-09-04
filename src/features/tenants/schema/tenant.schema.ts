import { z } from "zod";
import { TENANT_TYPES } from "../types";

export const tenantFormSchema = z.object({
  name: z.string().min(1, "Markaz nomi kiritilishi shart"),
  slug: z
    .string()
    .min(1, "Slug kiritilishi shart")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug faqat kichik lotin harflari, raqamlar va - belgisidan iborat bo'lishi mumkin",
    ),
  plan: z.string().optional(),
  type: z.enum(TENANT_TYPES).optional().or(z.literal("")),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;
