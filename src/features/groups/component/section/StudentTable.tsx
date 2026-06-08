// features/groups/components/StudentTable.tsx

import { useState } from "react";
import { Trash2, ChevronUp, ChevronDown, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { GroupDetail, GroupStudent } from "../../types";
import { useRemoveStudent } from "../../hooks";
import { formatDate } from "@/ustils";

interface StudentTableProps {
  group: GroupDetail;
}

type SortKey = "name" | "joinedAt";
type SortDir = "asc" | "desc";

export const StudentTable = ({ group }: StudentTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const removeStudent = useRemoveStudent(group.id);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...group.students].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") {
      cmp = a.student.fullName.localeCompare(b.student.fullName);
    } else {
      cmp = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleRemove = (studentId: string) => {
    removeStudent.mutate(studentId, {
      onSuccess: () => setOpenPopoverId(null),
    });
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return (
        <ChevronUp className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" />
      );
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
    );
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Table header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
              <th className="text-left px-4 py-3 w-10 text-zinc-500 dark:text-zinc-400 font-medium">
                #
              </th>
              <th className="text-left px-4 py-3 text-zinc-500 dark:text-zinc-400 font-medium">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                  Ism
                  <SortIcon col="name" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-zinc-500 dark:text-zinc-400 font-medium hidden sm:table-cell">
                Telefon
              </th>
              <th className="text-left px-4 py-3 text-zinc-500 dark:text-zinc-400 font-medium hidden md:table-cell">
                <button
                  onClick={() => handleSort("joinedAt")}
                  className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                >
                  Qo'shilgan sana
                  <SortIcon col="joinedAt" />
                </button>
              </th>
              <th className="px-4 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-zinc-400 dark:text-zinc-500"
                >
                  Guruhda hali o'quvchi yo'q
                </td>
              </tr>
            ) : (
              sorted.map((gs, idx) => (
                <StudentRow
                  key={gs.id}
                  groupStudent={gs}
                  index={idx + 1}
                  isOpen={openPopoverId === gs.student.id}
                  onOpenChange={(open) =>
                    setOpenPopoverId(open ? gs.student.id : null)
                  }
                  onRemove={() => handleRemove(gs.student.id)}
                  isRemoving={removeStudent.isPending}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Alohida Row komponenti (Popover state izolyatsiyasi uchun) ---

interface StudentRowProps {
  groupStudent: GroupStudent;
  index: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: () => void;
  isRemoving: boolean;
}

const StudentRow = ({
  groupStudent,
  index,
  isOpen,
  onOpenChange,
  onRemove,
  isRemoving,
}: StudentRowProps) => {
  const { student, joinedAt } = groupStudent;

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
      <td className="px-4 py-3 text-zinc-400 dark:text-zinc-500 text-xs">
        {index}
      </td>
      <td className="px-4 py-3">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">
          {student.fullName}
        </p>
        <p className="text-zinc-500 dark:text-zinc-400 sm:hidden mt-0.5">
          {student.phone}
        </p>
      </td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">
        {student.phone}
      </td>
      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden md:table-cell">
        {formatDate(joinedAt, "dd.MM.yyyy, hh:mm")}
      </td>
      <td className="px-4 py-3">
        <Popover open={isOpen} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-64 p-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-950/50 shrink-0">
                <UserMinus className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Guruhdan chiqarish
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {student.fullName}
                  </span>{" "}
                  ni guruhdan chiqarasizmi?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isRemoving}
                className="flex-1 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs"
              >
                Yo'q
              </Button>
              <Button
                size="sm"
                onClick={onRemove}
                disabled={isRemoving}
                className="flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs"
              >
                {isRemoving ? "..." : "Ha, chiqarish"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </td>
    </tr>
  );
};
