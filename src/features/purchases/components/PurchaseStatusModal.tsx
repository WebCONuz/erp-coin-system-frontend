import { getApiErrorStatus, translateApiError } from "@/ustils";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
import { CoinAmount } from "@/components/shared/coin";
import { RewardThumb } from "./RewardThumb";
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
        onError: (error: unknown) => {
          const isConflict = getApiErrorStatus(error) === 409;
          toast.error(
            isConflict ? t("purchases.conflict") : translateApiError(error, t),
          );
          if (isConflict) onClose();
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {t(`purchases.${mode}.title`)}
          </DialogTitle>
          <DialogDescription>
            {t(`purchases.${mode}.description`)}
          </DialogDescription>
        </DialogHeader>

        {purchase && (
          <div className="flex items-center gap-3 rounded-xl border bg-muted/50 p-3">
            <RewardThumb
              imageUrl={purchase.reward.imageUrl}
              className="size-11 bg-card"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {purchase.reward.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {purchase.student?.fullName}
              </p>
            </div>
            <CoinAmount value={purchase.coinSpent} variant="pill" size="sm" />
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
                    {isCancel && (
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    )}
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
                  <FormItem className="flex gap-2.5 rounded-xl border p-3">
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
                    ? "bg-destructive text-white hover:bg-destructive/90 dark:text-background"
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
