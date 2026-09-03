import { Coins, Gift, Users } from "lucide-react";
import { formatDate } from "@/ustils";
import type { StudentDetailFull } from "@/features/students/types";

const R = 18;
const CIRCUMFERENCE = 2 * Math.PI * R;

const AttendanceRingTile = ({
  present,
  total,
}: {
  present: number;
  total: number;
}) => {
  const percent = total ? Math.round((present / total) * 100) : 0;
  const filled = CIRCUMFERENCE * (Math.min(percent, 100) / 100);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 flex items-center gap-4">
      <div className="relative w-14 h-14 shrink-0">
        <svg width="56" height="56" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke="var(--color-paper-soft)"
            strokeWidth="5"
          />
          <circle
            cx="24"
            cy="24"
            r={R}
            fill="none"
            stroke="var(--color-forest)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
            transform="rotate(-90 24 24)"
          />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold text-ink">
          {present}/{total}
        </p>
        <p className="text-xs text-ink-soft">Davomat</p>
      </div>
    </div>
  );
};

export const ProfileStatsRow = ({ student }: { student: StudentDetailFull }) => {
  const lastTx = student.coinTransactionsReceived?.[0];
  const lastCoinActivity = lastTx
    ? `${lastTx.direction === "earn" ? "+" : "-"}${lastTx.amount} · ${formatDate(lastTx.createdAt, "dd.MM.yyyy")}`
    : null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-gold/30 bg-gold-soft/20 p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
          <Coins size={20} className="text-gold" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-xl font-bold text-ink">
            {student.wallet?.balance ?? 0}
          </p>
          <p className="text-xs text-ink-soft">Coin balansi</p>
          {lastCoinActivity && (
            <p className="text-[11px] text-forest font-medium mt-0.5">
              {lastCoinActivity}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-forest/8 flex items-center justify-center shrink-0">
          <Users size={20} className="text-forest" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-xl font-bold text-ink">
            {student.groupMemberships?.length ?? 0}
          </p>
          <p className="text-xs text-ink-soft">Guruhlar soni</p>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-bloom/10 flex items-center justify-center shrink-0">
          <Gift size={20} className="text-bloom" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-xl font-bold text-ink">
            {student.stats?.totalPurchases ?? 0}
          </p>
          <p className="text-xs text-ink-soft">Sotib olingan</p>
          {!student.stats?.totalPurchases && (
            <p className="text-[11px] text-ink-soft/70 mt-0.5">
              Hali xarid yo'q
            </p>
          )}
        </div>
      </div>

      <AttendanceRingTile
        present={student.stats?.presentCount ?? 0}
        total={student.stats?.totalSessions ?? 0}
      />
    </div>
  );
};
