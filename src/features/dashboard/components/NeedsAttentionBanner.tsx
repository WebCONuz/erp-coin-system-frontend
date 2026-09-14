import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CalendarClock, Gift } from "lucide-react";
import type { AdminDashboardNeedsAttention } from "../types";

interface Props {
  needsAttention?: AdminDashboardNeedsAttention;
}

export const NeedsAttentionBanner = ({ needsAttention }: Props) => {
  if (!needsAttention) return null;

  const { pendingPurchases, pendingAttendanceSessions } = needsAttention;
  if (!pendingPurchases && !pendingAttendanceSessions) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
      <div className="flex items-start gap-2.5">
        <AlertTriangle
          size={18}
          className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
        />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            E'tibor talab qiladi
          </p>

          <div className="flex flex-wrap gap-2">
            {!!pendingPurchases && (
              <Link
                to="/admin/market"
                className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-zinc-900 dark:text-amber-300 dark:hover:bg-amber-950/50"
              >
                <Gift size={13} />
                {pendingPurchases} ta xarid tasdiqlashni kutmoqda
                <ArrowRight size={12} />
              </Link>
            )}
            {!!pendingAttendanceSessions && (
              <Link
                to="/admin/sessions"
                className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-zinc-900 dark:text-amber-300 dark:hover:bg-amber-950/50"
              >
                <CalendarClock size={13} />
                {pendingAttendanceSessions} ta darsda yo'qlama kiritilmagan
                <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
