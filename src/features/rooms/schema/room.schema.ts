import { z } from "zod";
import { TEXT_LIMITS, createOptionalTextSchema } from "@/ustils";

export const createRoomFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("rooms.schema.name_required")),
    capacity: z
      .number()
      .min(1, t("rooms.schema.capacity_min"))
      .max(300, t("rooms.schema.capacity_max")),
    description: createOptionalTextSchema(t, TEXT_LIMITS.DESCRIPTION),
  });

export type RoomFormValues = z.infer<ReturnType<typeof createRoomFormSchema>>;
