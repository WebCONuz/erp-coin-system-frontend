import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Clock, PartyPopper } from "lucide-react";
import type { DashboardResponse } from "../../types";

/** Tayyor sovg'alar (olib ketish kerak) va tasdiqlanishini kutayotgan xaridlar. */
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
    <ul className="grid gap-2 md:grid-cols-2">
      {readyCount > 0 && (
        <li>
          <Link
            to="/student/market?tab=purchases&purchaseStatus=approved"
            className="group flex min-h-14 items-center gap-3 rounded-2xl border border-coin/40 bg-coin-soft px-4 py-3 transition-colors hover:border-coin focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-coin-ink">
              <PartyPopper className="size-4.5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
              {t("purchases.student.readyBanner", { count: readyCount })}
            </span>
            <ChevronRight
              className="size-4 shrink-0 text-coin-ink transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </li>
      )}

      {purchases.pendingCount > 0 && (
        <li>
          <Link
            to="/student/market?tab=purchases&purchaseStatus=pending"
            className="group flex min-h-14 items-center gap-3 rounded-2xl border bg-card px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-info-soft text-info">
              <Clock className="size-4.5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 text-sm">
              {t("purchases.student.pendingBanner", {
                count: purchases.pendingCount,
              })}
            </span>
            <ChevronRight
              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </li>
      )}
    </ul>
  );
};
