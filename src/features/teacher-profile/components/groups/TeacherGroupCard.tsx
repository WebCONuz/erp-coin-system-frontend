import { useNavigate } from "react-router-dom";
import { ChevronRight, Users } from "lucide-react";
import { getGroupAccent } from "@/lib/group-accent";
import type { TeacherGroupItem } from "../../types";

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export const TeacherGroupCard = ({ data }: { data: TeacherGroupItem }) => {
  const navigate = useNavigate();
  const accent = getGroupAccent(data.id);

  return (
    <button
      type="button"
      onClick={() => navigate(`/teacher/groups/${data.id}`)}
      className="text-left rounded-2xl border border-ink/10 bg-white overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className={`h-1.5 ${accent.bar}`} />

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${accent.bg} ${accent.text}`}
            >
              {initials(data.name)}
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-ink truncate">
                {data.name}
              </h4>
              <p className="text-xs text-ink-soft truncate">
                {data.course.title}
              </p>
            </div>
          </div>
          {!data.isActive && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-bloom/10 text-bloom">
              Nofaol
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink/8">
          <span className="flex items-center gap-1.5 text-sm text-ink-soft">
            <Users size={14} />
            {data._count.students}/{data.maxStudents} o'quvchi
          </span>
          <span className="flex items-center gap-0.5 text-xs font-medium text-forest">
            Guruh sahifasi
            <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </button>
  );
};
