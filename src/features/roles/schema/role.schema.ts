import { z } from "zod";

export const createRoleFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, t("roles.schema.name_min")),
    displayName: z.string().min(2, t("roles.schema.displayName_min")),
    level: z.number().min(0, t("roles.schema.level_min")),
    scope: z.string().min(1, t("roles.schema.scope_required")),
    canDelete: z.boolean(),
  });

export type RoleFormValues = z.infer<ReturnType<typeof createRoleFormSchema>>;
