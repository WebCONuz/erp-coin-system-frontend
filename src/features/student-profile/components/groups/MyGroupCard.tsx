import { useNavigate } from "react-router-dom";
import { BookOpen, Users } from "lucide-react";
import type { MyGroupItem } from "../../types";

export const MyGroupCard = ({ data }: { data: MyGroupItem }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/student/groups/${data.id}`)}
      className="text-left border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
            <Users size={18} className="text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="text-base font-semibold truncate">{data.name}</h4>
        </div>
        {!data.isActive && (
          <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
            Nofaol
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 mt-3">
        <BookOpen size={13} />
        {data.course.title}
      </div>
      <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
        <span>{data.teacher.fullName}</span>
        <span className="flex items-center gap-1">
          <Users size={13} />
          {data._count.students}
        </span>
      </div>
    </button>
  );
};
