import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWarehouseCount, isUnlimitedStock } from "../lib/stock";
import type { Reward } from "../types";

interface Props {
  reward: Reward;
  // "Band" soni bosilganda shu sovg'aning kutilayotgan xaridlariga o'tadi.
  linkReserved?: boolean;
  className?: string;
}

// Admin uchun zaxira: Sotuvda (stock), Band (reservedCount), Omborda (ikkalasi).
export const RewardInventory = ({ reward, linkReserved, className }: Props) => {
  const { t } = useTranslation();
  const reservedCount = reward.reservedCount ?? 0;
  const warehouse = getWarehouseCount(reward);

  const reserved = t("market.inventory.reserved", { count: reservedCount });

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
    >
      <li>
        {isUnlimitedStock(reward) ? (
          <span className="flex items-center gap-1 font-medium text-success">
            <InfinityIcon className="size-3.5" aria-hidden />
            {t("market.unlimited")}
          </span>
        ) : reward.stock === 0 ? (
          <span className="font-medium text-destructive">
            {t("market.outOfStock")}
          </span>
        ) : (
          <span className="tabular-nums">
            {t("market.inventory.onSale", { count: reward.stock })}
          </span>
        )}
      </li>

      {reservedCount > 0 && (
        <li>
          {linkReserved ? (
            <Link
              to={`/admin/purchases?rewardId=${reward.id}&status=pending`}
              title={t("market.inventory.reservedLinkHint")}
              className="font-medium tabular-nums text-info underline-offset-2 hover:underline focus-visible:underline"
            >
              {reserved}
            </Link>
          ) : (
            <span className="tabular-nums">{reserved}</span>
          )}
        </li>
      )}

      {warehouse !== null && reservedCount > 0 && (
        <li className="tabular-nums">
          {t("market.inventory.warehouse", { count: warehouse })}
        </li>
      )}
    </ul>
  );
};
