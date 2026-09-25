import * as z from "zod";
import { createUsernameSchema } from "@/ustils/username";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    username: createUsernameSchema(t),
    password: z.string().min(6, t("login.schema.password_min")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
