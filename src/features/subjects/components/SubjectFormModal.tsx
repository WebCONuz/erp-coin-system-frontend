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
import { createSubjectFormSchema, type SubjectFormValues } from "../schema";
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
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject(subject?.id ?? "");
  const isPending = createSubject.isPending || updateSubject.isPending;

  const subjectFormSchema = useMemo(() => createSubjectFormSchema(t), [t]);

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
    toast.error(error?.data?.message || t("common.error"));

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
            {isEdit ? t("subjects.form.editTitle") : t("subjects.form.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("subjects.form.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("subjects.form.namePlaceholder")} {...field} />
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
                      placeholder={t("subjects.form.descriptionPlaceholder")}
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
