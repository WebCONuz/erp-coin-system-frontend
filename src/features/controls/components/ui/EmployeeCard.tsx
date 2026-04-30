import { Pencil, Trash } from "lucide-react";
import type { Employee } from "../../models";

interface Props {
  data: Employee;
}

export const EmployeeCard = ({ data }: Props) => {
  return (
    <div className="bg-bg-primary dark:bg-black rounded-xl p-4 relative">
      <div className="absolute top-4 right-5 flex gap-x-2.5">
        <Pencil
          size="17"
          className="text-green-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
        />
        <Trash
          size="17"
          className="text-red-600 cursor-pointer opacity-50 hover:opacity-100 duration-150"
        />
      </div>

      <div className="flex gap-x-3 items-center mb-3">
        <img
          src={data.avatarUrl}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h4 className="text-lg font-semibold leading-5">{data.fullName}</h4>
          <span className="text-sm text-gray-400 font-light leading-0">
            ({data.tenant.name})
          </span>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <p className="text-sm leading-0 font-medium">Guruhlari:</p>
        {data.taughtGroups.map((item) => (
          <span
            className="px-2 py-0.5 rounded-4xl text-xs bg-background border"
            key={item.id}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
};
