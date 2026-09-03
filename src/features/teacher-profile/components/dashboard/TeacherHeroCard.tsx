import { GraduationCap, UsersRound } from "lucide-react";

interface Props {
  fullName: string;
  totalActiveGroups: number;
  totalStudents: number;
}

export const TeacherHeroCard = ({
  fullName,
  totalActiveGroups,
  totalStudents,
}: Props) => (
  <div className="relative overflow-hidden rounded-3xl bg-forest text-paper p-6 sm:p-8">
    <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="min-w-0">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">
          Salom, {fullName.split(" ")[0]}! 👋
        </h1>
        <p className="text-paper/60 text-sm mt-2 max-w-md">
          Bugungi darslaringiz va o'quvchilaringizning holati bilan tanishing.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="rounded-2xl bg-white/8 border border-white/10 px-4 py-3 min-w-32">
          <div className="flex items-center gap-1.5 text-gold">
            <UsersRound size={15} />
            <span className="font-display text-xl font-bold">
              {totalActiveGroups}
            </span>
          </div>
          <p className="text-[11px] text-paper/50 mt-0.5">Faol guruhlar</p>
        </div>
        <div className="rounded-2xl bg-white/8 border border-white/10 px-4 py-3 min-w-32">
          <div className="flex items-center gap-1.5 text-gold">
            <GraduationCap size={15} />
            <span className="font-display text-xl font-bold">
              {totalStudents}
            </span>
          </div>
          <p className="text-[11px] text-paper/50 mt-0.5">Jami o'quvchilar</p>
        </div>
      </div>
    </div>
  </div>
);
