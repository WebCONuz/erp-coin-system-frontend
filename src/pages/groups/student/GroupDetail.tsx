import { useParams } from "react-router-dom";
import { BookOpen, Phone, User, Users } from "lucide-react";
import { BackListButton } from "@/components/shared/back";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { useGroup } from "@/features/groups/hooks";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading, isError } = useGroup(id ?? "");

  if (isLoading) return <PageLoading />;
  if (isError || !group) {
    return <NoData text="Guruh ma'lumotlari topilmadi" />;
  }

  return (
    <div className="space-y-6">
      <BackListButton title="Guruhlarim" />

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
            <Users size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {group.name}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <BookOpen size={13} />
              {group.course.title}
            </p>
          </div>
        </div>

        {group.course.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {group.course.description}
          </p>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-600 dark:text-zinc-300 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="flex items-center gap-1.5">
            <User size={13} />
            O'qituvchi: {group.teacher.fullName}
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {group.teacher.phone}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Guruhdoshlar ({group.students.length})
        </h3>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {group.students.map((member, idx) => (
            <div
              key={member.id}
              className={`flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900 ${
                idx !== group.students.length - 1
                  ? "border-b border-zinc-100 dark:border-zinc-800"
                  : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {member.student.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {member.student.fullName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
