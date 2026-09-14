import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import { StatsCard, WeeklyTrendChart } from "./ui";
import type { AdminDashboardCoinEconomy } from "../types";

interface Props {
  coinEconomy?: AdminDashboardCoinEconomy;
  isLoading?: boolean;
}

export const CoinEconomySection = ({ coinEconomy, isLoading }: Props) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">Tanga iqtisodiyoti</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatsCard
          title="Aylanmada"
          value={isLoading ? undefined : coinEconomy?.totalInCirculation}
          icon={<Coins size={18} />}
        />
        <StatsCard
          title="Bu oy berildi"
          value={isLoading ? undefined : coinEconomy?.earnedThisMonth}
          icon={<TrendingUp size={18} className="text-emerald-500" />}
        />
        <StatsCard
          title="Bu oy ayirildi"
          value={isLoading ? undefined : coinEconomy?.deductedThisMonth}
          icon={<TrendingDown size={18} className="text-red-500" />}
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
