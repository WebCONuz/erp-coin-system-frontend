import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createRoomFormSchema, type RoomFormValues } from "../schema";
import { useCreateRoom, useUpdateRoom } from "../hooks";
import type { Room } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  room?: Room;
}

const emptyValues: RoomFormValues = {
  name: "",
  capacity: 1,
  description: "",
};

export const RoomFormModal = ({ open, onClose, mode, room }: Props) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom(room?.id ?? "");
  const isPending = createRoom.isPending || updateRoom.isPending;

  const roomFormSchema = useMemo(() => createRoomFormSchema(t), [t]);

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && room) {
      form.reset({
        name: room.name,
        capacity: room.capacity,
        description: room.description ?? "",
      });
    } else {
      form.reset(emptyValues);
    }
  }, [open, isEdit, room, form]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

  const onSubmit = (values: RoomFormValues) => {
    const data = { ...values, description: values.description || undefined };

    if (isEdit && room) {
      updateRoom.mutate(data, { onSuccess: () => onClose(), onError });
    } else {
      createRoom.mutate(data, { onSuccess: () => onClose(), onError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? t("rooms.form.editTitle") : t("rooms.form.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rooms.form.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("rooms.form.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rooms.form.capacityLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={300}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("common.description")} {t("common.optional")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("rooms.form.descriptionPlaceholder")}
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? t("common.saving")
                    : t("common.creating")
                  : isEdit
                    ? t("common.save")
                    : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
