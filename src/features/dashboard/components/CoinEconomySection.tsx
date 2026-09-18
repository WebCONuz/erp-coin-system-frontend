import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard, WeeklyTrendChart } from "./ui";
import type { AdminDashboardCoinEconomy } from "../types";

interface Props {
  coinEconomy?: AdminDashboardCoinEconomy;
  isLoading?: boolean;
}

export const CoinEconomySection = ({ coinEconomy, isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <CardHeader className="flex-row items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Coins size={16} />
        </div>
        <CardTitle>{t("admin.dashboard.coinEconomy.title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatsCard
            title={t("admin.dashboard.coinEconomy.inCirculation")}
            value={isLoading ? undefined : coinEconomy?.totalInCirculation}
            icon={<Coins size={18} />}
            iconBg="bg-blue-50 dark:bg-blue-500/10"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title={t("admin.dashboard.coinEconomy.earnedThisMonth")}
            value={isLoading ? undefined : coinEconomy?.earnedThisMonth}
            icon={<TrendingUp size={18} />}
            iconBg="bg-emerald-50 dark:bg-emerald-500/10"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <StatsCard
            title={t("admin.dashboard.coinEconomy.deductedThisMonth")}
            value={isLoading ? undefined : coinEconomy?.deductedThisMonth}
            icon={<TrendingDown size={18} />}
            iconBg="bg-red-50 dark:bg-red-500/10"
            iconColor="text-red-600 dark:text-red-400"
          />
        </div>

        {isLoading ? (
          <div className="h-48 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        ) : (
          <WeeklyTrendChart data={coinEconomy?.weeklyTrend ?? []} />
        )}
      </CardContent>
    </Card>
  );
};
