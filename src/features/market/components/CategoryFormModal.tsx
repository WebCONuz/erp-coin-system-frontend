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
import { Button } from "@/components/ui/button";
import {
  rewardCategoryFormSchema,
  type RewardCategoryFormValues,
} from "../schema";
import { useCreateRewardCategory, useUpdateRewardCategory } from "../hooks";
import type { RewardCategory } from "../types";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  category?: RewardCategory;
}

export const CategoryFormModal = ({
  open,
  onClose,
  mode,
  category,
}: CategoryFormModalProps) => {
  const createCategory = useCreateRewardCategory();
  const updateCategory = useUpdateRewardCategory(category?.id ?? "");
  const isPending = createCategory.isPending || updateCategory.isPending;

  const isEdit = mode === "edit";

  const form = useForm<RewardCategoryFormValues>({
    resolver: zodResolver(rewardCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isEdit && category) {
      form.reset({ name: category.name });
    }
  }, [isEdit, category, form]);

  useEffect(() => {
    if (!open) {
      form.reset({ name: "" });
    }
  }, [open, form]);

  const onSubmit = (values: RewardCategoryFormValues) => {
    const onError = (error: any) =>
      toast.error(error?.data?.message || "Xatolik yuz berdi");

    if (isEdit && category) {
      updateCategory.mutate(values, { onSuccess: () => onClose(), onError });
    } else {
      createCategory.mutate(values, { onSuccess: () => onClose(), onError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? "Kategoriyani tahrirlash" : "Yangi kategoriya yaratish"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-700 dark:text-zinc-300">
                    Kategoriya nomi
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masalan: Elektron qurilmalar"
                      className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50"
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
                Bekor qilish
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              >
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
