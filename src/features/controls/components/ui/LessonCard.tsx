import { Pencil, Trash } from "lucide-react";
import type { Lesson } from "../../models";

interface Props {
  data: Lesson;
}

export const LessonCard = ({ data }: Props) => {
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
      <h4 className="text-lg mb-1 font-semibold">{data.title}</h4>
      <p className="text-sm mb-2">{data.description}</p>
      <div className="flex flex-wrap gap-2">
        {data.groups.map((item) => (
          <span
            className="py-1 px-3 rounded-4xl text-sm bg-background border"
            key={item.id}
          >
            {item.name}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-x-2 mt-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: data.color }}
        ></div>
        <span className="text-sm">{data.color}</span>
      </div>
    </div>
  );
};
