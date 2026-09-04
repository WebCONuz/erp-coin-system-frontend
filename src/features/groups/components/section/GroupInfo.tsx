import { BookOpen, User, Phone, Edit, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GroupDetail } from "../../types";
import { DonutChart } from "../custom-charts";
import { useNavigate } from "react-router-dom";

interface GroupInfoProps {
  group: GroupDetail;
  onEdit: () => void;
}

export const GroupInfo = ({ group, onEdit }: GroupInfoProps) => {
  const navigate = useNavigate();
  const studentCount = group.students.length;
  const isFull = studentCount >= group.maxStudents;
  const fillPercent = Math.round((studentCount / group.maxStudents) * 100);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
      <div className="flex items-start justify-between gap-4">
        {/* title */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Guruh nomi:{" "}
              <span className="font-extrabold text-blue-400">{group.name}</span>
            </h2>
            {isFull && (
              <Badge variant="destructive" className="">
                To'lgan
              </Badge>
            )}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Yaratilgan vaqti:{" "}
            {new Date(group.createdAt).toLocaleDateString("uz-UZ")}
          </p>
        </div>

        {/* edit-btn */}
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

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Kurs */}
        <div className="col-span-1 flex items-start gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-gray-300 dark:border-zinc-700">
          <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-400 to-blue-700 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
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
        <div className="col-span-1 flex items-start gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-gray-300 dark:border-zinc-700 relative">
          <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-purple-400 to-purple-700 rounded-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">O'qituvchi</p>
            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {group?.teacher?.fullName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              <p className="text-zinc-500 dark:text-zinc-400">
                {group?.teacher?.phone}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="bg-gray-200 text-gray-500 hover:text-blue-500 hover:bg-blue-100 absolute top-3 right-3 h-9"
            onClick={() => navigate(`/admin/teachers/${group?.teacher?.id}`)}
          >
            <Eye size={18} />
          </Button>
        </div>

        {/* O'quvchilar soni — donut chart */}
        <div className="col-span-1 flex items-center gap-5 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-gray-300 dark:border-zinc-700 relative">
          {/* Info */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-emerald-400 to-emerald-700 rounded-lg mb-2">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Guruh to'lishiga
            </p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {Math.max(0, group.maxStudents - studentCount)} ta joy bor
            </p>
          </div>

          {/* Divider */}
          <div className="w-px self-stretch bg-zinc-200 dark:bg-zinc-700" />

          {/* Donut SVG */}
          <DonutChart
            value={studentCount}
            max={group.maxStudents}
            percent={fillPercent}
            isFull={isFull}
          />
        </div>
      </div>
    </div>
  );
};
