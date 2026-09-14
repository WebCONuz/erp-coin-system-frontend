import { z } from "zod";

export const createRoomFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("rooms.schema.name_required")),
    capacity: z
      .number()
      .min(1, t("rooms.schema.capacity_min"))
      .max(300, t("rooms.schema.capacity_max")),
    description: z.string().optional(),
  });

export type RoomFormValues = z.infer<ReturnType<typeof createRoomFormSchema>>;
