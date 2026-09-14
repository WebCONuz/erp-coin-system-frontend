import { z } from "zod";
import { TENANT_TYPES } from "../types";

export const createTenantFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("tenants.schema.name_required")),
    slug: z
      .string()
      .min(1, t("tenants.schema.slug_required"))
      .regex(/^[a-z0-9-]+$/, t("tenants.schema.slug_invalid")),
    plan: z.string().optional(),
    type: z.enum(TENANT_TYPES).optional().or(z.literal("")),
  });

export type TenantFormValues = z.infer<ReturnType<typeof createTenantFormSchema>>;
