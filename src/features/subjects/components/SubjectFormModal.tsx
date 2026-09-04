import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { subjectFormSchema, type SubjectFormValues } from "../schema";
import { useCreateSubject, useUpdateSubject } from "../hooks";
import type { Subject } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  subject?: Subject;
}

const emptyValues: SubjectFormValues = {
  name: "",
  description: "",
};

export const SubjectFormModal = ({ open, onClose, mode, subject }: Props) => {
  const isEdit = mode === "edit";
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject(subject?.id ?? "");
  const isPending = createSubject.isPending || updateSubject.isPending;

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && subject) {
      form.reset({
        name: subject.name,
        description: subject.description ?? "",
      });
    } else {
      form.reset(emptyValues);
    }
  }, [open, isEdit, subject, form]);

  const onError = (error: any) =>
    toast.error(error?.data?.message || "Xatolik yuz berdi");

  const onSubmit = (values: SubjectFormValues) => {
    const data = { ...values, description: values.description || undefined };

    if (isEdit && subject) {
      updateSubject.mutate(data, { onSuccess: () => onClose(), onError });
    } else {
      createSubject.mutate(data, { onSuccess: () => onClose(), onError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fan nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: Matematika" {...field} />
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
                  <FormLabel>Tavsif (Ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masalan: Algebra va geometriya asoslari"
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
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? "Saqlanmoqda..."
                    : "Yaratilmoqda..."
                  : isEdit
                    ? "Saqlash"
                    : "Yaratish"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
