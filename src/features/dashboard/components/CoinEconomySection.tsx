import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatsCard, WeeklyTrendChart } from "./ui";
import type { AdminDashboardCoinEconomy } from "../types";

interface Props {
  coinEconomy?: AdminDashboardCoinEconomy;
  isLoading?: boolean;
}

export const CoinEconomySection = ({ coinEconomy, isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">
        {t("admin.dashboard.coinEconomy.title")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatsCard
          title={t("admin.dashboard.coinEconomy.inCirculation")}
          value={isLoading ? undefined : coinEconomy?.totalInCirculation}
          icon={<Coins size={18} />}
          bgColor="bg-blue-50 dark:bg-blue-500/20"
        />
        <StatsCard
          title={t("admin.dashboard.coinEconomy.earnedThisMonth")}
          value={isLoading ? undefined : coinEconomy?.earnedThisMonth}
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          bgColor="bg-green-50 dark:bg-green-500/10"
        />
        <StatsCard
          title={t("admin.dashboard.coinEconomy.deductedThisMonth")}
          value={isLoading ? undefined : coinEconomy?.deductedThisMonth}
          icon={<TrendingDown size={18} className="text-red-500" />}
          bgColor="bg-red-50 dark:bg-red-500/10"
        />
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="h-40 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        ) : (
          <WeeklyTrendChart data={coinEconomy?.weeklyTrend ?? []} />
        )}
      </div>
    </div>
  );
};
