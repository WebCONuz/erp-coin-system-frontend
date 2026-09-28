import { Check, PackageCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { PURCHASE_NEXT_STATUSES } from "../constants";
import type { Purchase, PurchaseActionStatus } from "../types";

interface Props {
  purchase: Purchase;
  onAction: (purchase: Purchase, status: PurchaseActionStatus) => void;
}

// Faqat backend ruxsat bergan o'tishlar uchun tugma chiqadi.
export const PurchaseActions = ({ purchase, onAction }: Props) => {
  const { t } = useTranslation();
  const next = PURCHASE_NEXT_STATUSES[purchase.status];

  if (!next.length) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {next.includes("approved") && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction(purchase, "approved")}
          className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/50"
        >
          <Check />
          {t("purchases.actions.approve")}
        </Button>
      )}
      {next.includes("delivered") && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction(purchase, "delivered")}
          className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
        >
          <PackageCheck />
          {t("purchases.actions.deliver")}
        </Button>
      )}
      {next.includes("cancelled") && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAction(purchase, "cancelled")}
          className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          <X />
          {t("purchases.actions.cancel")}
        </Button>
      )}
    </div>
  );
};
