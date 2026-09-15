import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import type { TeacherDashboardGroup } from "../../types";

const ACCENTS = [
  "bg-forest/8 text-forest",
  "bg-gold/12 text-gold",
  "bg-bloom/8 text-bloom",
];

function accentFor(seed: string) {
  const sum = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ACCENTS[sum % ACCENTS.length];
}

export const TeacherGroupsPreview = ({
  groups,
}: {
  groups: TeacherDashboardGroup[];
}) => {
  if (!groups.length) return null;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold text-ink">
          Guruhlarim
        </h3>
        <Link
          to="/teacher/groups"
          className="text-xs font-medium text-forest hover:underline"
        >
          Barchasi
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
        {groups.map((group, index) => (
          <Link
            key={group.id}
            to={`/teacher/groups/${group.id}`}
            className="flex items-center gap-3 rounded-xl bg-paper border border-ink/8 px-3 py-2.5 hover:border-gold/40 transition-colors"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold ${accentFor(group.id)}`}
            >
              No{index + 1}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">
                {group.name}
              </p>
              <p className="text-xs text-ink-soft truncate">
                {group.course.title}
              </p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 text-ink-soft shrink-0">
              <Users size={14} />
              <b>{group._count.students}</b>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
