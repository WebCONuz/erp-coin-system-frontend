import { groupData } from "../../constants";
import { GroupCard } from "../ui";

export const GroupGrid = () => {
  return (
    <div className="grid grid-cols-4 gap-6">
      {groupData.map((item) => (
        <GroupCard key={item.id} data={item} />
      ))}
    </div>
  );
};
