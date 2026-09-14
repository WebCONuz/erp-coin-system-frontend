import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea"; // Description uchun textarea
import { Button } from "@/components/ui/button";
import { createCourseFormSchema, type CourseFormValues } from "../../schema";
import { useCreateCourse, useUpdateCourse } from "../../hooks";

// Kurs uchun sodda tip interfeysi
interface CourseItem {
  id: string;
  title: string;
  description?: string;
}

interface CourseFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  course?: CourseItem;
}

export const CourseFormModal = ({
  open,
  onClose,
  mode,
  course,
}: CourseFormModalProps) => {
  const { t } = useTranslation();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse(course?.id ?? "");
  const isPending = createCourse.isPending || updateCourse.isPending;

  const isEdit = mode === "edit";

  const courseFormSchema = useMemo(() => createCourseFormSchema(t), [t]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Tahrirlash rejimida ma'lumotni formaga to'ldirish
  useEffect(() => {
    if (isEdit && course) {
      form.reset({
        title: course.title,
        description: course.description || "",
      });
    }
  }, [isEdit, course, form]);

  // Modal yopilganda formni tozalash
  useEffect(() => {
    if (!open) {
      form.reset({ title: "", description: "" });
    }
  }, [open, form]);

  const onSubmit = (values: CourseFormValues) => {
    if (isEdit && course) {
      updateCourse.mutate(values, {
        onSuccess: () => onClose(),
      });
    } else {
      createCourse.mutate(values, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-120 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? t("courses.form.edit_title") : t("courses.form.create_title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Kurs nomi (Title) */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-zinc-300">
                    {t("courses.form.title_label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("courses.form.title_placeholder")}
                      className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kurs tavsifi (Description) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-zinc-300">
                    {t("courses.form.description_label")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("courses.form.description_placeholder")}
                      className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 resize-none h-24"
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
                className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              >
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
