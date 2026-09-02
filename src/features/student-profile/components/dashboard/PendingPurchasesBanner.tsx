import { Link } from "react-router-dom";
import { Gift, ChevronRight } from "lucide-react";
import type { DashboardResponse } from "../../types";

export const PendingPurchasesBanner = ({
  purchases,
}: {
  purchases: DashboardResponse["purchases"];
}) => {
  if (purchases.pendingCount < 1) return null;

  return (
    <Link
      to="/student/profile"
      className="flex items-center justify-between gap-3 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50 dark:bg-pink-950/20 px-4 py-3 hover:bg-pink-100 dark:hover:bg-pink-950/40 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0">
          <Gift size={16} className="text-pink-600 dark:text-pink-400" />
        </div>
        <p className="text-sm text-pink-800 dark:text-pink-300 truncate">
          <b>{purchases.pendingCount}</b> ta xaridingiz tasdiqlanishini
          kutmoqda
        </p>
      </div>
      <ChevronRight size={16} className="text-pink-500 shrink-0" />
    </Link>
  );
};
