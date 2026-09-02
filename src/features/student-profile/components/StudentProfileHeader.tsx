import { Coins, Phone, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFileUrl } from "@/lib/utils";
import type { StudentDetailFull } from "@/features/students/types";

interface Props {
  student: StudentDetailFull;
}

export const StudentProfileHeader = ({ student }: Props) => {
  const avatarLetter = student.fullName.charAt(0).toUpperCase();
  const activeGroups = student.groupMemberships?.filter((g) => g.isActive) ?? [];
  const primaryGroup = activeGroups[0];

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <div className="shrink-0">
        {student.avatarUrl ? (
          <img
            src={getFileUrl(student.avatarUrl)}
            alt="avatar"
            className="w-16 h-16 rounded-xl object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center text-2xl font-bold text-white">
            {avatarLetter}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {student.fullName}
          </h1>
          {!student.isActive && (
            <Badge className="border-0 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
              Arxivlangan
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {student.phone}
          </span>
          {student.parentPhone && (
            <span className="flex items-center gap-1.5 text-blue-500 dark:text-blue-400">
              <PhoneCall size={13} />
              Ota-ona: {student.parentPhone}
            </span>
          )}
          {primaryGroup && (
            <span>
              {primaryGroup.group.name} guruhi · {primaryGroup.group.teacher.fullName}
              {activeGroups.length > 1 && ` +${activeGroups.length - 1}`}
            </span>
          )}
          <span className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
            <Coins size={13} />
            {student.wallet?.balance ?? 0} coin
          </span>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
          Ma'lumotlaringiz noto'g'ri bo'lsa, o'quv markazi administratoriga
          murojaat qiling.
        </p>
      </div>
    </header>
  );
};
