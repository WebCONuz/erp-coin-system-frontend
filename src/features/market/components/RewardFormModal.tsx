import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { toast } from "sonner";
import { rewardFormSchema, type RewardFormValues } from "../schema";
import {
  useCreateReward,
  useRewardCategories,
  useUpdateReward,
} from "../hooks";
import type { Reward } from "../types";
import { ControlledSelect } from "@/components/controls";

interface RewardFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  reward?: Reward;
}

const emptyValues: RewardFormValues = {
  title: "",
  description: "",
  imageUrl: "",
  coinPrice: 0,
  stock: 0,
  rewardType: "physical",
  categoryId: "",
};

export const RewardFormModal = ({
  open,
  onClose,
  mode,
  reward,
}: RewardFormModalProps) => {
  const isEdit = mode === "edit";
  const createReward = useCreateReward();
  const updateReward = useUpdateReward(reward?.id ?? "");
  const isPending = createReward.isPending || updateReward.isPending;
  const { data: categories } = useRewardCategories();

  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isEdit && reward) {
      form.reset({
        title: reward.title,
        description: reward.description ?? "",
        imageUrl: reward.imageUrl ?? "",
        coinPrice: reward.coinPrice,
        stock: reward.stock,
        rewardType: reward.rewardType,
        categoryId: reward.categoryId,
      });
    }
  }, [isEdit, reward, form]);

  useEffect(() => {
    if (!open) {
      form.reset(emptyValues);
    }
  }, [open, form]);

  const onSubmit = (values: RewardFormValues) => {
    const data = { ...values, imageUrl: values.imageUrl || undefined };
    const onError = (error: any) =>
      toast.error(error?.data?.message || "Xatolik yuz berdi");

    if (isEdit && reward) {
      updateReward.mutate(data, { onSuccess: () => onClose(), onError });
    } else {
      createReward.mutate(data, { onSuccess: () => onClose(), onError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-120 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit ? "Sovg'ani tahrirlash" : "Yangi sovg'a yaratish"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sovg'a nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: Kitob" {...field} />
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
                      placeholder="Sovg'a haqida qisqacha ma'lumot..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rasm URL (Ixtiyoriy)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coinPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Narxi (coin)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
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
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dona soni</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ControlledSelect
                control={form.control}
                name="rewardType"
                label="Turi"
                options={[
                  { label: "Jismoniy sovg'a", value: "physical" },
                  { label: "Raqamli sovg'a", value: "digital" },
                  { label: "Imtiyoz", value: "privilege" },
                ]}
                placeholder="Sovg'a turini tanlang"
              />

              <ControlledSelect
                control={form.control}
                name="categoryId"
                label="Kategoriya"
                options={
                  categories && categories.length > 0
                    ? categories.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    : []
                }
                placeholder="Kategoriyani tanlang"
              />
            </div>

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
