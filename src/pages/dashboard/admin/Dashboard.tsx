import { CalendarClock } from "lucide-react";
import {
  CoinEconomySection,
  DashboardStats,
  Leaderboard,
  NeedsAttentionBanner,
} from "@/features/dashboard/components";
import { useAdminDashboard } from "@/features/dashboard/hooks";
import { DashboardTitle } from "@/components/shared/title";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useTranslation } from "react-i18next";
import { MonthlyCalendar } from "@/features/plans/components";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data, isLoading } = useAdminDashboard();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DashboardTitle
          title={t("admin.dashboard.title", {
            name: user?.fullName || t("admin.dashboard.defaultUser"),
          })}
          description={t("admin.dashboard.description")}
        />

        {!isLoading && (
          <span className="flex items-center gap-1.5 rounded-full bg-white dark:bg-zinc-900 px-3.5 py-2 text-sm font-medium shadow-sm">
            <CalendarClock size={15} className="text-primary" />
            {t("admin.dashboard.todaySessions", {
              count: data?.todaySessionsCount ?? 0,
            })}
          </span>
        )}
      </div>

      <NeedsAttentionBanner needsAttention={data?.needsAttention} />

      <DashboardStats stats={data?.stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CoinEconomySection
            coinEconomy={data?.coinEconomy}
            isLoading={isLoading}
          />
        </div>
        <Leaderboard leaderboard={data?.leaderboard} isLoading={isLoading} />
      </div>

      {/* <ActivityFeed activity={data?.recentActivity} isLoading={isLoading} /> */}

      <MonthlyCalendar hasAction={false} />
    </div>
  );
}
