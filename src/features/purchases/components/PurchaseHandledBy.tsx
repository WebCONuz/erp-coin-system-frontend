import { useTranslation } from "react-i18next";
import { formatDate } from "@/ustils";
import type { Purchase } from "../types";

/** Kim tasdiqladi / topshirdi va qachon. */
export const PurchaseHandledBy = ({ purchase }: { purchase: Purchase }) => {
  const { t } = useTranslation();
  const { approvedBy, deliveredBy, deliveredAt } = purchase;

  if (!approvedBy && !deliveredBy) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <dl className="min-w-40 space-y-0.5 text-xs text-muted-foreground">
      {approvedBy && (
        <div className="flex flex-wrap gap-x-1">
          <dt>{t("purchases.table.approvedBy")}:</dt>
          <dd className="text-foreground">{approvedBy.fullName}</dd>
        </div>
      )}
      {deliveredBy && (
        <div className="flex flex-wrap gap-x-1">
          <dt>{t("purchases.table.deliveredBy")}:</dt>
          <dd className="text-foreground">
            {deliveredBy.fullName}
            {deliveredAt && (
              <span className="tabular-nums text-muted-foreground">
                {", "}
                {formatDate(deliveredAt, "dd.MM.yyyy, HH:mm")}
              </span>
            )}
          </dd>
        </div>
      )}
    </dl>
  );
};
