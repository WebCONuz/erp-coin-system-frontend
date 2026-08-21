import React from "react";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import type { Reward } from "@/features/market/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFileUrl } from "@/lib/utils";

interface ProductCardProps {
  product: Reward;
  onBuy?: (reward: Reward) => void;
  isBuying?: boolean;
  onEdit?: (reward: Reward) => void;
  onDelete?: (reward: Reward) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  isBuying,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="group w-full bg-card text-card-foreground rounded-xl shadow-sm border border-border/50 overflow-hidden transition-all hover:shadow-xl">
      {/* Rasm qismi */}
      <div className="relative aspect-3/3 w-full bg-muted">
        {product.imageUrl && (
          <img
            src={getFileUrl(product.imageUrl)}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* O'ng yuqoridagi 3-nuqta tugmasi */}
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute top-3 right-3 p-2 bg-gray-100 dark:bg-black/60 backdrop-blur-sm rounded-full text-slate-700 dark:text-slate-200 shadow-md hover:bg-black/10 dark:hover:bg-black/80 transition-colors">
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Pencil className="text-blue-500" />
                  Tahrirlash
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(product)}
                >
                  <Trash />
                  O'chirish
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Kontent qismi */}
      <div className="p-4 space-y-4">
        {/* Sarlavha va Tavsif */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-tight text-slate-900 dark:text-slate-50 h-[22.5px] overflow-hidden">
            {product.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-normal h-10.75 overflow-hidden">
            {product.description}
          </p>
        </div>

        {/* Narx va Dona soni */}
        <div className="flex items-center justify-between pt-1">
          {/* Narx: Coin belgisi bilan */}
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center font-black text-xs text-white shadow-inner">
              E
            </div>
            <span className="text-lg font-semibold text-slate-950 dark:text-slate-50 leading-none">
              {product.coinPrice.toLocaleString("uz-UZ")}
            </span>
            <span className="text-lg text-slate-500 dark:text-slate-400 font-normal">
              coin
            </span>
          </div>

          {/* Dona soni */}
          <span className="text-lg text-slate-500 dark:text-slate-400 font-normal">
            {product.stock.toLocaleString("uz-UZ")} dona
          </span>
        </div>

        {onBuy && (
          <Button
            className="w-full bg-linear-to-br from-purple-500 to-purple-700 text-white"
            disabled={product.stock < 1 || isBuying}
            onClick={() => onBuy(product)}
          >
            {product.stock < 1
              ? "Tugagan"
              : isBuying
                ? "Yuborilmoqda..."
                : "Sotib olish"}
          </Button>
        )}
      </div>
    </div>
  );
};
