import { Check, PackageCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PURCHASE_NEXT_STATUSES } from "../constants";
import type { Purchase, PurchaseActionStatus } from "../types";

interface Props {
  purchase: Purchase;
  onAction: (purchase: Purchase, status: PurchaseActionStatus) => void;
  /** `stretch` — mobil kartada tugmalar butun kenglikda. */
  layout?: "inline" | "stretch";
}

// Faqat backend ruxsat bergan o'tishlar uchun tugma chiqadi.
// Ierarxiya: keyingi qadam — asosiy tugma, bekor qilish — ikkinchi darajali.
export const PurchaseActions = ({
  purchase,
  onAction,
  layout = "inline",
}: Props) => {
  const { t } = useTranslation();
  const next = PURCHASE_NEXT_STATUSES[purchase.status];

  if (!next.length) {
    return layout === "inline" ? (
      <span className="text-xs text-muted-foreground">—</span>
    ) : null;
  }

  const stretch = layout === "stretch";

  return (
    <div className={cn("flex gap-1.5", stretch ? "w-full" : "flex-wrap")}>
      {next.includes("approved") && (
        <Button
          size={stretch ? "default" : "sm"}
          onClick={() => onAction(purchase, "approved")}
          className={cn(stretch && "h-10 flex-1")}
        >
          <Check aria-hidden />
          {t("purchases.actions.approve")}
        </Button>
      )}
      {next.includes("delivered") && (
        <Button
          size={stretch ? "default" : "sm"}
          onClick={() => onAction(purchase, "delivered")}
          className={cn(stretch && "h-10 flex-1")}
        >
          <PackageCheck aria-hidden />
          {t("purchases.actions.deliver")}
        </Button>
      )}
      {next.includes("cancelled") && (
        <Button
          size={stretch ? "default" : "sm"}
          variant="ghost"
          onClick={() => onAction(purchase, "cancelled")}
          className={cn(
            "text-destructive hover:bg-destructive-soft hover:text-destructive",
            stretch && "h-10",
          )}
        >
          <X aria-hidden />
          {t("purchases.actions.cancel")}
        </Button>
      )}
    </div>
  );
};
