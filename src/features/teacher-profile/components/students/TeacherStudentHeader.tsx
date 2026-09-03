import { Coins, Phone } from "lucide-react";
import type { StudentDetailFull } from "@/features/students/types";

interface Props {
  student: StudentDetailFull;
  myGroupIds: Set<string>;
  onGiveCoin: () => void;
}

export const TeacherStudentHeader = ({ student, myGroupIds, onGiveCoin }: Props) => {
  const myMemberships = (student.groupMemberships ?? []).filter((gm) =>
    myGroupIds.has(gm.group.id),
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-forest text-paper p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-forest-light flex items-center justify-center text-2xl font-display font-bold text-gold ring-2 ring-gold/40 shrink-0">
            {student.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-semibold truncate">
              {student.fullName}
            </h1>
            <p className="text-sm text-paper/60 flex items-center gap-1.5 mt-1">
              <Phone size={13} />
              {student.phone}
            </p>
            {myMemberships.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {myMemberships.map((gm) => (
                  <span
                    key={gm.id}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/8 text-paper/80"
                  >
                    {gm.group.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
          <div className="text-left sm:text-right">
            <p className="text-xs text-paper/50">Coin balansi</p>
            <p className="font-display text-2xl font-bold text-gold flex items-center gap-1.5 sm:justify-end">
              <Coins size={18} />
              {student.wallet?.balance ?? 0}
            </p>
          </div>
          <button
            type="button"
            onClick={onGiveCoin}
            className="inline-flex items-center gap-2 rounded-xl bg-gold/15 border border-gold/30 text-gold px-4 py-2.5 text-sm font-medium hover:bg-gold/20 transition-colors"
          >
            <Coins size={15} />
            Coin berish
          </button>
        </div>
      </div>
    </div>
  );
};
