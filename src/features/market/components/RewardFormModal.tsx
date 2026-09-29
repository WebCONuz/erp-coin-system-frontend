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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createRewardFormSchema, type RewardFormValues } from "../schema";
import {
  useCreateReward,
  useRewardCategories,
  useUpdateReward,
} from "../hooks";
import { UNLIMITED_STOCK } from "../constants";
import { isUnlimitedStock } from "../lib/stock";
import type { Reward, UpdateRewardDto } from "../types";
import { ControlledSelect } from "@/components/controls";
import { RewardStockFields } from "./RewardStockFields";

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
  stockMode: "exact",
  isUnlimited: false,
  stock: 0,
  stockDelta: 0,
  rewardType: "physical",
  categoryId: "",
};

export const RewardFormModal = ({
  open,
  onClose,
  mode,
  reward,
}: RewardFormModalProps) => {
  const { t } = useTranslation();
  const isEdit = mode === "edit";
  const createReward = useCreateReward();
  const updateReward = useUpdateReward(reward?.id ?? "");
  const isPending = createReward.isPending || updateReward.isPending;
  const { data: categories } = useRewardCategories();

  const rewardFormSchema = useMemo(
    () => createRewardFormSchema(t, isEdit ? reward?.stock : undefined),
    [t, isEdit, reward?.stock],
  );

  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardFormSchema),
    defaultValues: emptyValues,
  });
  // Render paytida o'qiladi — RHF proxy'si dirtyFields'ni kuzatishi uchun.
  const { dirtyFields } = form.formState;

  useEffect(() => {
    if (isEdit && reward) {
      form.reset({
        title: reward.title,
        description: reward.description ?? "",
        imageUrl: reward.imageUrl ?? "",
        coinPrice: reward.coinPrice,
        // Cheksiz sovg'ada `stockDelta` ishlamaydi — faqat aniq qiymat rejimi.
        stockMode: isUnlimitedStock(reward) ? "exact" : "delta",
        isUnlimited: isUnlimitedStock(reward),
        stock: isUnlimitedStock(reward) ? 0 : reward.stock,
        stockDelta: 0,
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
    const {
      stockMode,
      isUnlimited,
      stock,
      stockDelta,
      imageUrl,
      ...fields
    } = values;
    const exactStock = isUnlimited ? UNLIMITED_STOCK : stock;
    const onError = (error: any) =>
      toast.error(error?.data?.message || t("common.error"));

    if (!isEdit || !reward) {
      // `stock` doim yuboriladi — aks holda backend 0 qo'yadi.
      createReward.mutate(
        { ...fields, imageUrl: imageUrl || undefined, stock: exactStock },
        { onSuccess: () => onClose(), onError },
      );
      return;
    }

    // Faqat o'zgargan maydonlar: eski `stock` ni qayta yuborish shu orada
    // sotilgan donalarni hisobdan o'chirib yuboradi.
    const dirty = dirtyFields;
    const data: UpdateRewardDto = {};
    if (dirty.title) data.title = fields.title;
    if (dirty.description) data.description = fields.description;
    if (dirty.imageUrl) data.imageUrl = imageUrl || undefined;
    if (dirty.coinPrice) data.coinPrice = fields.coinPrice;
    if (dirty.rewardType) data.rewardType = fields.rewardType;
    if (dirty.categoryId) data.categoryId = fields.categoryId;

    // `stock` va `stockDelta` birga yuborilmaydi.
    if (stockMode === "delta") {
      if (stockDelta !== 0) data.stockDelta = stockDelta;
    } else if (exactStock !== reward.stock) {
      data.stock = exactStock;
    }

    if (!Object.keys(data).length) {
      onClose();
      return;
    }

    updateReward.mutate(data, { onSuccess: () => onClose(), onError });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-120 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-900 dark:text-zinc-50">
            {isEdit
              ? t("market.rewardForm.editTitle")
              : t("market.rewardForm.createTitle")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("market.rewardForm.titleLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("market.rewardForm.titlePlaceholder")}
                      {...field}
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
                    {t("market.rewardForm.descriptionLabel")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "market.rewardForm.descriptionPlaceholder",
                      )}
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
                  <FormLabel>
                    {t("market.rewardForm.imageUrlLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coinPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("market.rewardForm.priceLabel")}</FormLabel>
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

            <RewardStockFields form={form} reward={isEdit ? reward : undefined} />

            <div className="grid grid-cols-2 gap-4">
              <ControlledSelect
                control={form.control}
                name="rewardType"
                label={t("market.rewardForm.typeLabel")}
                options={[
                  {
                    label: t("market.rewardForm.type.physical"),
                    value: "physical",
                  },
                  {
                    label: t("market.rewardForm.type.digital"),
                    value: "digital",
                  },
                  {
                    label: t("market.rewardForm.type.privilege"),
                    value: "privilege",
                  },
                ]}
                placeholder={t("market.rewardForm.typePlaceholder")}
              />

              <ControlledSelect
                control={form.control}
                name="categoryId"
                label={t("reward_categories.title_singular")}
                options={
                  categories && categories.length > 0
                    ? categories.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    : []
                }
                placeholder={t("market.rewardForm.categoryPlaceholder")}
              />
            </div>

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
