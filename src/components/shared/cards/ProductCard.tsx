import React from "react";
import { MoreVertical } from "lucide-react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group w-full bg-card text-card-foreground rounded-xl shadow-lg border border-border/50 overflow-hidden transition-all hover:shadow-xl">
      {/* Rasm qismi */}
      <div className="relative aspect-4/3 w-full">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />

        {/* O'ng yuqoridagi 3-nuqta tugmasi */}
        <button className="absolute top-4 right-4 p-2 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-full text-slate-700 dark:text-slate-200 shadow-md hover:bg-white/80 dark:hover:bg-black/80 transition-colors">
          <MoreVertical size={20} />
        </button>
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
              {product.price.toLocaleString("uz-UZ")}
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
      </div>
    </div>
  );
};
