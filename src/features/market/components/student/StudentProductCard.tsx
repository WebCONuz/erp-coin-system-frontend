import { Coins, Gift } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import type { Reward } from "../../types";

const CARD_TINTS = ["bg-forest/8", "bg-gold/12", "bg-bloom/8", "bg-emerald-50"];

function tintFor(seed: string) {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_TINTS[sum % CARD_TINTS.length];
}

interface Props {
  product: Reward;
  balance: number;
  onBuy: (reward: Reward) => void;
  isBuying?: boolean;
}

export const StudentProductCard = ({
  product,
  balance,
  onBuy,
  isBuying,
}: Props) => {
  const inStock = product.stock > 0;
  const canAfford = balance >= product.coinPrice && inStock;
  const progress = Math.min(100, (balance / product.coinPrice) * 100);
  const remaining = Math.max(0, product.coinPrice - balance);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden flex flex-col">
      <div
        className={`aspect-square w-full flex items-center justify-center ${tintFor(product.id)}`}
      >
        <div className="relative aspect-3/3 w-full bg-muted">
          {product.imageUrl ? (
            <img
              src={getFileUrl(product.imageUrl)}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Gift size={32} className="text-ink-soft/40" />
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-ink truncate">
          {product.title}
        </h3>
        {product.description && (
          <p className="text-xs text-ink-soft mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="flex items-center gap-1 font-display text-base font-bold text-gold">
            <Coins size={15} />
            {product.coinPrice}
          </span>
          <span className="text-xs text-ink-soft">
            {inStock ? `${product.stock} dona` : "Tugagan"}
          </span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-paper-soft overflow-hidden mt-3">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-ink-soft mt-1.5">
          {balance}/{product.coinPrice} coin
          {remaining > 0 ? ` · yana ${remaining} coin kerak` : ""}
        </p>

        <button
          type="button"
          onClick={() => onBuy(product)}
          disabled={!canAfford || isBuying}
          className={`mt-3 w-full rounded-xl py-2.5 text-sm font-medium transition-colors ${
            canAfford
              ? "bg-forest text-paper hover:bg-forest-light"
              : "bg-paper-soft text-ink-soft/70 cursor-not-allowed"
          }`}
        >
          {!inStock
            ? "Tugagan"
            : isBuying
              ? "Yuborilmoqda..."
              : canAfford
                ? "Sotib olish"
                : `Yana ${remaining} coin kerak`}
        </button>
      </div>
    </div>
  );
};
