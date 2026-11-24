import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  getPurchaseStatusLabels,
  PURCHASE_STATUS_BADGE_CLASS,
  PURCHASE_STATUS_DOT_CLASS,
} from "../constants";
import type { PurchaseStatus } from "../types";

interface Props {
  status: PurchaseStatus;
  className?: string;
}

export const PurchaseStatusBadge = ({ status, className }: Props) => {
  const { t } = useTranslation();
  const labels = getPurchaseStatusLabels(t);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium",
        PURCHASE_STATUS_BADGE_CLASS[status],
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", PURCHASE_STATUS_DOT_CLASS[status])}
        aria-hidden
      />
      {labels[status] ?? status}
    </span>
  );
};
