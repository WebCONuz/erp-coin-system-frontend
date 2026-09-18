import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CalendarClock, Gift } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AdminDashboardNeedsAttention } from "../types";

interface Props {
  needsAttention?: AdminDashboardNeedsAttention;
}

export const NeedsAttentionBanner = ({ needsAttention }: Props) => {
  const { t } = useTranslation();

  if (!needsAttention) return null;

  const { pendingPurchases, pendingAttendanceSessions } = needsAttention;
  if (!pendingPurchases && !pendingAttendanceSessions) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
          <AlertTriangle
            size={18}
            className="text-amber-600 dark:text-amber-400"
          />
        </div>
        <div className="flex-1 space-y-2 pt-1">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            {t("admin.dashboard.needsAttention")}
          </p>

          <div className="flex flex-wrap gap-2">
            {!!pendingPurchases && (
              <Link
                to="/admin/market"
                className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-zinc-900 dark:text-amber-300 dark:hover:bg-amber-950/50"
              >
                <Gift size={13} />
                {t("admin.dashboard.pendingPurchases", {
                  count: pendingPurchases,
                })}
                <ArrowRight size={12} />
              </Link>
            )}
            {!!pendingAttendanceSessions && (
              <Link
                to="/admin/sessions"
                className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-zinc-900 dark:text-amber-300 dark:hover:bg-amber-950/50"
              >
                <CalendarClock size={13} />
                {t("admin.dashboard.pendingAttendance", {
                  count: pendingAttendanceSessions,
                })}
                <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
