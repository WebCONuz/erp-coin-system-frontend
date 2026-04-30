import {
  GroupCategory,
  GroupGrid,
  HeaderFilter,
} from "@/features/groups/component/section";

const Groups = () => {
  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-1">
        <GroupCategory />
      </div>
      <div className="col-span-4 space-y-6">
        <HeaderFilter />
        <GroupGrid />
      </div>
    </div>
  );
};

export default Groups;
