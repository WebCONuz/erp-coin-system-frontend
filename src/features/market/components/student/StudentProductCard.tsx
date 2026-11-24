import { Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CoinAmount } from "@/components/shared/coin";
import { cn, getFileUrl } from "@/lib/utils";
import { isInStock, isUnlimitedStock } from "../../lib/stock";
import type { Reward } from "../../types";

interface Props {
  product: Reward;
  balance: number;
  onBuy: (reward: Reward) => void;
  isBuying?: boolean;
}

/**
 * O'quvchi do'koni kartasi: narx + "yana qancha kerak" chizig'i.
 * Yetarli tanga bo'lsa — asosiy "Sotib olish" tugmasi.
 */
export const StudentProductCard = ({
  product,
  balance,
  onBuy,
  isBuying,
}: Props) => {
  const { t } = useTranslation();
  const inStock = isInStock(product);
  const canAfford = balance >= product.coinPrice && inStock;
  const progress = Math.min(100, (balance / product.coinPrice) * 100);
  const remaining = Math.max(0, product.coinPrice - balance);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="relative aspect-4/3 w-full bg-muted">
        {product.imageUrl ? (
          <img
            src={getFileUrl(product.imageUrl)}
            alt=""
            loading="lazy"
            className={cn(
              "size-full object-cover",
              !inStock && "opacity-60 grayscale-40",
            )}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Gift className="size-10 text-muted-foreground/50" aria-hidden />
          </div>
        )}
        {!inStock && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-medium text-white shadow-sm dark:text-background">
            {t("market.outOfStock")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0 space-y-1">
          <h3 className="line-clamp-1 font-heading text-base font-semibold leading-snug">
            {product.title}
          </h3>
          {product.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <CoinAmount value={product.coinPrice} className="text-base" />
          {inStock && (
            <span className="text-xs tabular-nums text-muted-foreground">
              {isUnlimitedStock(product)
                ? t("market.unlimited")
                : t("market.stockCount", { count: product.stock })}
            </span>
          )}
        </div>

        {/* Yig'ish jarayoni — yetarli bo'lmasa, qancha qolgani */}
        {inStock && (
          <div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={product.coinPrice}
              aria-valuenow={Math.min(balance, product.coinPrice)}
              aria-label={`${product.title}: ${Math.round(progress)}%`}
              className="h-1.5 overflow-hidden rounded-full bg-muted"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  canAfford ? "bg-success" : "bg-coin",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">
              {canAfford
                ? `${balance}/${product.coinPrice}`
                : t("market.student.moreNeeded", { count: remaining })}
            </p>
          </div>
        )}

        <Button
          onClick={() => onBuy(product)}
          disabled={!canAfford || isBuying}
          variant={canAfford ? "default" : "secondary"}
          className="h-10 w-full"
        >
          {!inStock
            ? t("market.outOfStock")
            : isBuying
              ? t("market.purchaseModal.sending")
              : canAfford
                ? t("market.buy")
                : t("market.student.moreNeededButton", { count: remaining })}
        </Button>
      </div>
    </article>
  );
};
