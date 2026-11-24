import { Link } from "react-router-dom";
import { CalendarClock, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ActivityFeed,
  CoinEconomySection,
  DashboardStats,
  Leaderboard,
  NeedsAttentionBanner,
} from "@/features/dashboard/components";
import { useAdminDashboard } from "@/features/dashboard/hooks";
import { DashboardTitle } from "@/components/shared/title";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { MonthlyCalendar } from "@/features/plans/components";
import { formatLongDate } from "@/ustils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError, refetch, isFetching } = useAdminDashboard();

  return (
    <div className="space-y-4 sm:space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <DashboardTitle
          title={t("admin.dashboard.title", {
            name: user?.fullName || t("admin.dashboard.defaultUser"),
          })}
          description={formatLongDate(new Date(), i18n.language)}
        />

        {isLoading ? (
          <Skeleton className="h-10 w-40 rounded-full" />
        ) : (
          data && (
            <Link
              to="/admin/sessions"
              className="group flex items-center gap-2 rounded-full border bg-card py-1.5 pr-3 pl-1.5 text-sm font-medium transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary-soft text-primary">
                <CalendarClock className="size-4" aria-hidden />
              </span>
              {t("admin.dashboard.todaySessions", {
                count: data.todaySessionsCount ?? 0,
              })}
              <ChevronRight
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          )
        )}
      </header>

      {isError && !data ? (
        <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
      ) : (
        <>
          <NeedsAttentionBanner
            needsAttention={data?.needsAttention}
            isLoading={isLoading}
          />

          <DashboardStats stats={data?.stats} isLoading={isLoading} />

          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
              <CoinEconomySection
                coinEconomy={data?.coinEconomy}
                isLoading={isLoading}
              />
            </div>
            <Leaderboard
              leaderboard={data?.leaderboard}
              isLoading={isLoading}
            />
          </div>

          <ActivityFeed activity={data?.recentActivity} isLoading={isLoading} />
        </>
      )}

      <MonthlyCalendar hasAction={false} />
    </div>
  );
}
