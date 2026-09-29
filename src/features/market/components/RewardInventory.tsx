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

// Admin uchun zaxira: Sotuvda (stock) · Band (reservedCount) · Omborda (ikkalasi).
export const RewardInventory = ({ reward, linkReserved, className }: Props) => {
  const { t } = useTranslation();
  const reservedCount = reward.reservedCount ?? 0;
  const warehouse = getWarehouseCount(reward);

  const reserved = t("market.inventory.reserved", { count: reservedCount });

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400",
        className,
      )}
    >
      {isUnlimitedStock(reward) ? (
        <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
          <InfinityIcon size={14} />
          {t("market.unlimited")}
        </span>
      ) : reward.stock === 0 ? (
        <span className="rounded-4xl bg-red-100 px-2 py-0.5 font-medium text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {t("market.outOfStock")}
        </span>
      ) : (
        <span>
          {t("market.inventory.onSale", { count: reward.stock })}
        </span>
      )}

      {reservedCount > 0 && (
        <>
          <span>·</span>
          {linkReserved ? (
            <Link
              to={`/admin/purchases?rewardId=${reward.id}&status=pending`}
              title={t("market.inventory.reservedLinkHint")}
              className="font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
            >
              {reserved}
            </Link>
          ) : (
            <span>{reserved}</span>
          )}
        </>
      )}

      {warehouse !== null && reservedCount > 0 && (
        <>
          <span>·</span>
          <span>{t("market.inventory.warehouse", { count: warehouse })}</span>
        </>
      )}
    </div>
  );
};
