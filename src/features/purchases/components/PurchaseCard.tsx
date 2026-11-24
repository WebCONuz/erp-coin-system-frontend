import { useTranslation } from "react-i18next";
import { CoinAmount } from "@/components/shared/coin";
import { cn } from "@/lib/utils";
import { formatDate } from "@/ustils";
import { PURCHASE_NEXT_STATUSES } from "../constants";
import type { Purchase, PurchaseActionStatus } from "../types";
import { PurchaseActions } from "./PurchaseActions";
import { PurchaseHandledBy } from "./PurchaseHandledBy";
import { PurchaseStatusBadge } from "./PurchaseStatusBadge";
import { RewardThumb } from "./RewardThumb";

interface Props {
  purchase: Purchase;
  onAction: (purchase: Purchase, status: PurchaseActionStatus) => void;
}

/** Mobil (< md) ko'rinish: jadval qatori o'rniga karta. */
export const PurchaseCard = ({ purchase, onAction }: Props) => {
  const { t } = useTranslation();
  const needsAction = PURCHASE_NEXT_STATUSES[purchase.status].length > 0;

  return (
    <article
      className={cn(
        "space-y-3 rounded-2xl border bg-card p-4",
        purchase.status === "pending" && "border-warning/40",
      )}
    >
      <div className="flex items-start gap-3">
        <RewardThumb imageUrl={purchase.reward.imageUrl} className="size-12" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{purchase.reward.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <CoinAmount value={purchase.coinSpent} variant="pill" size="sm" />
            <PurchaseStatusBadge status={purchase.status} />
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">
            {t("purchases.table.student")}
          </dt>
          <dd className="truncate font-medium">{purchase.student?.fullName}</dd>
          <dd className="text-xs tabular-nums text-muted-foreground">
            {purchase.student?.phone}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">
            {t("purchases.table.purchasedAt")}
          </dt>
          <dd className="tabular-nums">
            {formatDate(purchase.purchasedAt, "dd.MM.yyyy, HH:mm")}
          </dd>
        </div>
      </dl>

      {purchase.deliveryNote && (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          {purchase.deliveryNote}
        </p>
      )}

      {(purchase.approvedBy || purchase.deliveredBy) && (
        <PurchaseHandledBy purchase={purchase} />
      )}

      {needsAction && (
        <div className="border-t pt-3">
          <PurchaseActions
            purchase={purchase}
            onAction={onAction}
            layout="stretch"
          />
        </div>
      )}
    </article>
  );
};
