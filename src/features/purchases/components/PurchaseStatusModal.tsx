import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Coins, Gift } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/modal";
import { getFileUrl } from "@/lib/utils";
import {
  createPurchaseStatusSchema,
  type PurchaseStatusFormValues,
} from "../schema";
import { useUpdatePurchaseStatus } from "../hooks";
import type {
  Purchase,
  PurchaseActionStatus,
  UpdatePurchaseStatusDto,
} from "../types";

interface Props {
  purchase: Purchase | null;
  status: PurchaseActionStatus | null;
  onClose: () => void;
}

export const PurchaseStatusModal = ({ purchase, status, onClose }: Props) => {
  const { t } = useTranslation();
  const updateStatus = useUpdatePurchaseStatus();
  const open = !!purchase && !!status;

  const submit = (data: UpdatePurchaseStatusDto) => {
    if (!purchase) return;

    updateStatus.mutate(
      { id: purchase.id, data },
      {
        onSuccess: (res) => {
          toast.success(
            res.refund
              ? t("purchases.refundToast", {
                  coins: res.refund.coins,
                  balance: res.refund.currentBalance,
                })
              : res.message,
            res.refund && {
              description: res.refund.stockRestored
                ? t("purchases.stockRestored")
                : t("purchases.stockNotRestored"),
            },
          );
          onClose();
        },
        onError: (error: any) => {
          toast.error(
            error?.status === 409
              ? t("purchases.conflict")
              : error?.data?.message || t("common.error"),
          );
          if (error?.status === 409) onClose();
        },
      },
    );
  };

  // "Topshirildi" — izohsiz, oddiy tasdiqlash dialogi.
  if (status === "delivered") {
    return (
      <ConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={() => submit({ status: "delivered" })}
        title={t("purchases.deliverModal.title")}
        description={t("purchases.deliverModal.description", {
          reward: purchase?.reward.title,
          student: purchase?.student?.fullName ?? "",
        })}
        confirmLabel={t("purchases.actions.deliver")}
        variant="warning"
        isPending={updateStatus.isPending}
      />
    );
  }

  return (
    <NoteFormModal
      open={open}
      purchase={purchase}
      isCancel={status === "cancelled"}
      isPending={updateStatus.isPending}
      onClose={onClose}
      onSubmit={({ adminNote, restock }) =>
        status &&
        submit({
          status,
          adminNote: adminNote || undefined,
          // Cheksiz sovg'ada (stockReserved: false) zaxira baribir o'zgarmaydi.
          ...(status === "cancelled" && purchase?.stockReserved
            ? { restock }
            : {}),
        })
      }
    />
  );
};

interface NoteFormModalProps {
  open: boolean;
  purchase: Purchase | null;
  isCancel: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: PurchaseStatusFormValues) => void;
}

const NoteFormModal = ({
  open,
  purchase,
  isCancel,
  isPending,
  onClose,
  onSubmit,
}: NoteFormModalProps) => {
  const { t } = useTranslation();
  const mode = isCancel ? "cancelModal" : "approveModal";

  const purchaseStatusSchema = useMemo(
    () => createPurchaseStatusSchema(t, isCancel),
    [t, isCancel],
  );

  const form = useForm<PurchaseStatusFormValues>({
    resolver: zodResolver(purchaseStatusSchema),
    defaultValues: { adminNote: "", restock: true },
  });

  useEffect(() => {
    if (!open) form.reset({ adminNote: "", restock: true });
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle>{t(`purchases.${mode}.title`)}</DialogTitle>
          <DialogDescription>
            {t(`purchases.${mode}.description`)}
          </DialogDescription>
        </DialogHeader>

        {purchase && (
          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-pink-100 dark:bg-pink-900/40">
              {purchase.reward.imageUrl ? (
                <img
                  src={getFileUrl(purchase.reward.imageUrl)}
                  alt={purchase.reward.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Gift size={18} className="text-pink-600 dark:text-pink-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {purchase.reward.title}
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {purchase.student?.fullName}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
              <Coins size={14} />
              {purchase.coinSpent}
            </span>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="adminNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t(`purchases.${mode}.noteLabel`)}
                    {isCancel && <span className="text-red-500">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t(`purchases.${mode}.notePlaceholder`)}
                      className="h-24 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isCancel && purchase?.stockReserved && (
              <FormField
                control={form.control}
                name="restock"
                render={({ field }) => (
                  <FormItem className="flex gap-2.5 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="cursor-pointer font-medium">
                        {t("purchases.cancelModal.restockLabel")}
                      </FormLabel>
                      <FormDescription className="text-xs">
                        {t("purchases.cancelModal.restockHint")}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {isCancel && purchase && (
              <p className="text-xs text-muted-foreground">
                {t("purchases.cancelModal.refundHint", {
                  coins: purchase.coinSpent,
                })}
              </p>
            )}

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className={
                  isCancel
                    ? "bg-none bg-red-600 hover:bg-red-700 text-white"
                    : undefined
                }
              >
                {isPending ? t("common.saving") : t(`purchases.${mode}.submit`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
