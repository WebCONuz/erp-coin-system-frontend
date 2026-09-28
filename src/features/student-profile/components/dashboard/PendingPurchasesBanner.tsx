import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Gift, ChevronRight, Sparkles } from "lucide-react";
import type { DashboardResponse } from "../../types";

export const PendingPurchasesBanner = ({
  purchases,
}: {
  purchases: DashboardResponse["purchases"];
}) => {
  const { t } = useTranslation();
  // Dashboard faqat oxirgi xaridlarni beradi — "tayyor" sovg'alarni shulardan olamiz.
  const readyCount = purchases.recent.filter(
    (p) => p.status === "approved",
  ).length;

  if (purchases.pendingCount < 1 && readyCount < 1) return null;

  return (
    <div className="space-y-2">
      {readyCount > 0 && (
        <Link
          to="/student/market?tab=purchases&purchaseStatus=approved"
          className="flex items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 hover:bg-gold/15 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-gold" />
            </div>
            <p className="text-sm text-ink truncate">
              {t("purchases.student.readyBanner", { count: readyCount })}
            </p>
          </div>
          <ChevronRight size={16} className="text-gold shrink-0" />
        </Link>
      )}

      {purchases.pendingCount > 0 && (
        <Link
          to="/student/market?tab=purchases&purchaseStatus=pending"
          className="flex items-center justify-between gap-3 rounded-2xl border border-bloom/25 bg-bloom/8 px-4 py-3 hover:bg-bloom/12 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-bloom/15 flex items-center justify-center shrink-0">
              <Gift size={16} className="text-bloom" />
            </div>
            <p className="text-sm text-ink truncate">
              {t("purchases.student.pendingBanner", {
                count: purchases.pendingCount,
              })}
            </p>
          </div>
          <ChevronRight size={16} className="text-bloom shrink-0" />
        </Link>
      )}
    </div>
  );
};
