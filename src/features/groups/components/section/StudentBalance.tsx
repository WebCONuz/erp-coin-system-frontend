import { ActivityIcon, LayoutList } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { TrendLineChart, CoinFlowTrendChart } from "@/components/shared/charts";
import { useGroupStats } from "../../hooks";

interface StudentBalanceProps {
  groupId: string;
}

export const StudentBalance = ({ groupId }: StudentBalanceProps) => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGroupStats(groupId);

  const hasAvgTrend = !!stats?.avgBalance.trend.length;
  const hasActivityTrend = !!stats?.weeklyActivity.trend.length;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
        {t("groups.balance.title")}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* O'rtacha BB-coin balansi */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {t("groups.balance.avgTitle")}
            </h3>
            {!isLoading && stats && (
              <span className="text-lg font-bold text-emerald-600">
                {Math.round(stats.avgBalance.current)}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="h-44 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ) : hasAvgTrend ? (
            <TrendLineChart
              data={stats!.avgBalance.trend}
              xKey="date"
              xTickFormatter={formatDayLabel}
              height={176}
              series={[
                {
                  key: "avgBalance",
                  label: t("groups.balance.avgTitle"),
                  color: "#10b981",
                },
              ]}
            />
          ) : (
            <div className="flex flex-col items-center gap-y-6 py-2">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg border border-gray-400 bg-gray-100 dark:bg-zinc-800/60 dark:border-zinc-700">
                <ActivityIcon className="w-8 h-8 text-gray-400 dark:text-zinc-400" />
              </div>
              <p className="text-center text-zinc-900 dark:text-zinc-50">
                {t("groups.balance.avgEmpty1")}
                <br />
                {t("groups.balance.avgEmpty2")}
              </p>
            </div>
          )}
        </div>

        {/* Guruh haftalik faolligi */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            {t("groups.balance.activityTitle")}
          </h3>

          {isLoading ? (
            <div className="h-44 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ) : hasActivityTrend ? (
            <CoinFlowTrendChart
              data={stats!.weeklyActivity.trend}
              earnedLabel={t("admin.dashboard.coinEconomy.earned")}
              deductedLabel={t("admin.dashboard.coinEconomy.deducted")}
              xTickFormatter={formatDayLabel}
              height={176}
            />
          ) : (
            <div className="flex flex-col items-center gap-y-6 py-2">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg border border-gray-400 bg-gray-100 dark:bg-zinc-800/60 dark:border-zinc-700">
                <LayoutList className="w-8 h-8 text-gray-400 dark:text-zinc-400" />
              </div>
              <p className="text-center text-zinc-900 dark:text-zinc-50">
                {t("groups.balance.activityEmpty1")}
                <br /> {t("groups.balance.activityEmpty2")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const formatDayLabel = (date: string) => {
  try {
    return format(parseISO(date), "dd.MM");
  } catch {
    return date;
  }
};
