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
      className="flex items-center justify-between gap-3 rounded-2xl border border-bloom/25 bg-bloom/8 px-4 py-3 hover:bg-bloom/12 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-bloom/15 flex items-center justify-center shrink-0">
          <Gift size={16} className="text-bloom" />
        </div>
        <p className="text-sm text-ink truncate">
          <b>{purchases.pendingCount}</b> ta xaridingiz tasdiqlanishini
          kutmoqda
        </p>
      </div>
      <ChevronRight size={16} className="text-bloom shrink-0" />
    </Link>
  );
};
