import React from "react";
import { useTranslation } from "react-i18next";
import { Gift, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Reward } from "@/features/market/types";
import { isInStock, isUnlimitedStock } from "@/features/market/lib/stock";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CoinAmount } from "@/components/shared/coin";
import { cn, getFileUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Reward;
  onBuy?: (reward: Reward) => void;
  isBuying?: boolean;
  onEdit?: (reward: Reward) => void;
  onDelete?: (reward: Reward) => void;
  // Karta pastidagi qo'shimcha blok (masalan, admin uchun zaxira tafsiloti).
  footer?: React.ReactNode;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  isBuying,
  onEdit,
  onDelete,
  footer,
}) => {
  const { t } = useTranslation();
  const inStock = isInStock(product);
  const isArchived = product.isActive === false;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground">
      {/* Rasm */}
      <div className="relative aspect-4/3 w-full bg-muted">
        {product.imageUrl ? (
          <img
            src={getFileUrl(product.imageUrl)}
            alt=""
            loading="lazy"
            className={cn(
              "w-full h-full sm:h-87.5 object-cover",
              (!inStock || isArchived) && "opacity-60 grayscale-40",
            )}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Gift className="size-10 text-muted-foreground/50" aria-hidden />
          </div>
        )}

        {/* Holat belgilari */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          {isArchived && (
            <span className="rounded-full bg-card/95 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-sm">
              {t("students.status.archived")}
            </span>
          )}
          {!inStock && (
            <span className="rounded-full bg-destructive px-2 py-0.5 text-[11px] font-medium text-white shadow-sm dark:text-background">
              {t("market.outOfStock")}
            </span>
          )}
        </div>

        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`${t("common.actions")}: ${product.title}`}
                className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-card/95 text-foreground shadow-sm transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-ring"
              >
                <MoreHorizontal className="size-4" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Pencil className="size-4" aria-hidden />
                  {t("common.edit")}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 className="size-4" aria-hidden />
                  {t("common.delete")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Kontent */}
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
          <CoinAmount
            value={product.coinPrice}
            size="md"
            className="text-base"
          />
          {!footer && (
            <span className="text-sm tabular-nums text-muted-foreground">
              {isUnlimitedStock(product)
                ? t("market.unlimited")
                : inStock
                  ? t("market.stockCount", { count: product.stock })
                  : t("market.outOfStock")}
            </span>
          )}
        </div>

        {footer && <div className="border-t pt-3">{footer}</div>}

        {onBuy && (
          <Button
            className="h-10 w-full"
            disabled={!inStock || isBuying}
            onClick={() => onBuy(product)}
          >
            {!inStock
              ? t("market.outOfStock")
              : isBuying
                ? t("common.sending")
                : t("market.buy")}
          </Button>
        )}
      </div>
    </article>
  );
};
