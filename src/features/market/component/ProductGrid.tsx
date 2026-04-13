import { ProductCard } from "@/components/shared/cards";
import { productsMock } from "../constants";

export const ProductGrid = () => {
  return (
    <div className="grid grid-cols-4 gap-6">
      {productsMock.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </div>
  );
};
