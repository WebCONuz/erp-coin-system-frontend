import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  getPurchaseStatusLabels,
  PURCHASE_STATUS_BADGE_CLASS,
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
        "inline-block whitespace-nowrap px-2 py-0.5 rounded-4xl text-xs font-medium",
        PURCHASE_STATUS_BADGE_CLASS[status],
        className,
      )}
    >
      {labels[status] ?? status}
    </span>
  );
};
