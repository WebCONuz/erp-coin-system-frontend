import type { Group } from "../../models";

interface Props {
  data: Group;
}
export const GroupCard = ({ data }: Props) => {
  return (
    <div
      className={`${
        data.isActive ? "border-green-100" : "border-red-100"
      } border p-4 bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-xl`}
    >
      <div className="text-gray-400 mt-2 text-xs font-semibold mb-2">
        {data.createdAt}
      </div>
      <div className="flex gap-x-3 items-center">
        <div
          className={`w-2.5 h-2.5 ${
            data.isActive ? "bg-green-500" : "bg-red-500"
          } rounded-full`}
        ></div>
        <h4 className="text-2xl font-semibold">{data.name}</h4>
      </div>
      <div className="text-gray-400 mt-2">
        Sinfdai o'quvchilar soni: {data.studentCount}
      </div>
    </div>
  );
};
