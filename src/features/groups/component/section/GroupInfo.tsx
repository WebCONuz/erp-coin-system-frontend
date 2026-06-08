import { BookOpen, User, Users, Phone, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GroupDetail } from "../../types";

interface GroupInfoProps {
  group: GroupDetail;
  onEdit: () => void;
}

export const GroupInfo = ({ group, onEdit }: GroupInfoProps) => {
  const studentCount = group.students.length;
  const isFull = studentCount >= group.maxStudents;
  const fillPercent = Math.round((studentCount / group.maxStudents) * 100);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {group.name}
            </h2>
            {isFull && (
              <Badge variant="destructive" className="">
                To'lgan
              </Badge>
            )}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Yaratilgan: {new Date(group.createdAt).toLocaleDateString("uz-UZ")}
          </p>
        </div>

        <Button
          variant="outline"
          size="default"
          onClick={onEdit}
          className="gap-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
        >
          <Edit className="w-4 h-4" />
          Tahrirlash
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Kurs */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
          <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">Kurs</p>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {group.course.title}
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 truncate mt-1">
              {group.course.description}
            </p>
          </div>
        </div>

        {/* O'qituvchi */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
          <User className="w-6 h-6 text-violet-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">O'qituvchi</p>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {group.teacher.fullName}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3 text-zinc-400" />
              <p className="text-zinc-500 dark:text-zinc-400">
                {group.teacher.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Studentlar soni */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60">
          <Users className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
          <div className="w-full min-w-0">
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">O'quvchilar</p>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
              {studentCount} / {group.maxStudents}
            </p>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  isFull
                    ? "bg-red-600"
                    : fillPercent >= 80
                      ? "bg-amber-600"
                      : "bg-emerald-600"
                }`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              {fillPercent}% to'lgan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
