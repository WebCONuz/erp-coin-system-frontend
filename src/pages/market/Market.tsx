import {
  GiftCategory,
  ProductDataFilter,
  ProductGrid,
} from "@/features/market/component";

const Market = () => {
  const clearFilters = () => console.log("Filters cleared");
  const searchData = (val: string) => console.log(val);
  const onAddGift = () => console.log("onAddGift");
  const onAddCategory = () => console.log("onAddCategory");
  const filterByCategory = (val: string) =>
    console.log("filterByCategory:", val);

  return (
    <>
      <ProductDataFilter
        filterByCategory={filterByCategory}
        onAddCategory={onAddCategory}
        onAddGift={onAddGift}
        onClear={clearFilters}
        onSearch={searchData}
      />
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-1">
          <GiftCategory />
        </div>
        <div className="col-span-4">
          <ProductGrid />
        </div>
      </div>
    </>
  );
};
export default Market;
