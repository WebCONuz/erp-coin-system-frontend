import { useTranslation } from "react-i18next";
import {
  Coins,
  Gift,
  Info,
  MessageSquareText,
  PackageCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn, getFileUrl } from "@/lib/utils";
import { formatDate } from "@/ustils";
import {
  getStudentPurchaseStatusLabels,
  STUDENT_PURCHASE_STATUS_BADGE_CLASS,
} from "../../constants";
import type { Purchase } from "../../types";

export const StudentPurchaseCard = ({ purchase }: { purchase: Purchase }) => {
  const { t } = useTranslation();
  const labels = getStudentPurchaseStatusLabels(t);
  const isReady = purchase.status === "approved";
  const canAskCancel =
    purchase.status === "pending" || purchase.status === "approved";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-card p-4",
        isReady ? "border-coin/60 ring-2 ring-coin/20" : "border-border",
      )}
    >
      {isReady && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-coin-ink">
          <Sparkles size={14} />
          {t("purchases.student.readyTitle")}
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-destructive/10">
          {purchase.reward.imageUrl ? (
            <img
              src={getFileUrl(purchase.reward.imageUrl)}
              alt={purchase.reward.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <Gift size={18} className="text-destructive" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {purchase.reward.title}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Coins size={11} />
              {purchase.coinSpent}
            </span>
            <span>·</span>
            <span>{formatDate(purchase.purchasedAt, "dd.MM.yyyy")}</span>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
            STUDENT_PURCHASE_STATUS_BADGE_CLASS[purchase.status],
          )}
        >
          {labels[purchase.status] ?? purchase.status}
        </span>
      </div>

      {purchase.deliveryNote && purchase.status !== "delivered" && (
        <div
          className={cn(
            "flex gap-2 rounded-xl px-3 py-2 text-xs",
            purchase.status === "cancelled"
              ? "bg-destructive/8 text-destructive"
              : "bg-muted/55 text-foreground",
          )}
        >
          <MessageSquareText size={14} className="mt-0.5 shrink-0" />
          <p className="min-w-0 wrap-break-word">
            {purchase.status === "cancelled" && (
              <span className="font-medium">
                {t("purchases.student.reason")}:{" "}
              </span>
            )}
            {purchase.deliveryNote}
          </p>
        </div>
      )}

      {purchase.status === "delivered" && purchase.deliveredAt && (
        <p className="flex items-center gap-1.5 text-xs text-primary">
          <PackageCheck size={14} />
          {t("purchases.student.deliveredOn", {
            date: formatDate(purchase.deliveredAt, "dd.MM.yyyy"),
          })}
        </p>
      )}

      {purchase.status === "cancelled" && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RotateCcw size={13} />
          {t("purchases.student.refunded", { coins: purchase.coinSpent })}
        </p>
      )}

      {canAskCancel && (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
          <Info size={12} />
          {t("purchases.student.cancelHint")}
        </p>
      )}
    </div>
  );
};
