import { Coins, Phone, PhoneCall } from "lucide-react";
import { getFileUrl } from "@/lib/utils";
import type { StudentDetailFull } from "@/features/students/types";

interface Props {
  student: StudentDetailFull;
}

export const StudentProfileHeader = ({ student }: Props) => {
  const avatarLetter = student.fullName.charAt(0).toUpperCase();
  const activeGroups = student.groupMemberships?.filter((g) => g.isActive) ?? [];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-forest text-paper p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
          <div className="shrink-0">
            {student.avatarUrl ? (
              <img
                src={getFileUrl(student.avatarUrl)}
                alt="avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gold/40"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-forest-light flex items-center justify-center text-2xl font-display font-bold text-gold ring-2 ring-gold/40">
                {avatarLetter}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold truncate">
              {student.fullName}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper/60 mt-1.5">
              <span className="flex items-center gap-1.5">
                <Phone size={13} />
                {student.phone}
              </span>
              {student.parentPhone && (
                <span className="flex items-center gap-1.5">
                  <PhoneCall size={13} />
                  Ota-ona: {student.parentPhone}
                </span>
              )}
            </div>
            {activeGroups.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {activeGroups.map((g) => (
                  <span
                    key={g.id}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/8 text-paper/80"
                  >
                    {g.group.name} · {g.group.teacher.fullName}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-paper/40 mt-3 max-w-md">
              Ma'lumotlaringiz noto'g'ri bo'lsa, o'quv markazi
              administratoriga murojaat qiling.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <p className="text-xs text-paper/50">Coin balansi</p>
          <p className="font-display text-3xl font-bold text-gold flex items-center gap-1.5 sm:justify-end">
            <Coins size={22} />
            {student.wallet?.balance ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};
