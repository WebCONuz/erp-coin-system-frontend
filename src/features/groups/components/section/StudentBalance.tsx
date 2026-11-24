import { Activity, LineChart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { TrendLineChart, CoinFlowTrendChart } from "@/components/shared/charts";
import { Panel } from "@/components/shared/panel";
import { CoinAmount } from "@/components/shared/coin";
import { EmptyState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupStats } from "../../hooks";

interface StudentBalanceProps {
  groupId: string;
}

/** Guruh statistikasi: o'rtacha balans trendi va haftalik faollik. */
export const StudentBalance = ({ groupId }: StudentBalanceProps) => {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useGroupStats(groupId);

  const hasAvgTrend = !!stats?.avgBalance.trend.length;
  const hasActivityTrend = !!stats?.weeklyActivity.trend.length;

  return (
    <section aria-label={t("groups.balance.title")} className="space-y-4 sm:space-y-5">
      <Panel
        title={t("groups.balance.avgTitle")}
        action={
          isLoading ? (
            <Skeleton className="h-6 w-14" />
          ) : (
            stats && (
              <CoinAmount
                value={Math.round(stats.avgBalance.current)}
                size="md"
                className="text-base"
              />
            )
          )
        }
      >
        {isLoading ? (
          <Skeleton className="h-44 rounded-xl" />
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
                color: "var(--chart-1)",
              },
            ]}
          />
        ) : (
          <EmptyState
            size="sm"
            icon={LineChart}
            title={t("groups.balance.avgEmpty1")}
            description={t("groups.balance.avgEmpty2")}
          />
        )}
      </Panel>

      <Panel title={t("groups.balance.activityTitle")}>
        {isLoading ? (
          <Skeleton className="h-44 rounded-xl" />
        ) : hasActivityTrend ? (
          <CoinFlowTrendChart
            data={stats!.weeklyActivity.trend}
            earnedLabel={t("admin.dashboard.coinEconomy.earned")}
            deductedLabel={t("admin.dashboard.coinEconomy.deducted")}
            xTickFormatter={formatDayLabel}
            height={176}
          />
        ) : (
          <EmptyState
            size="sm"
            icon={Activity}
            title={t("groups.balance.activityEmpty1")}
            description={t("groups.balance.activityEmpty2")}
          />
        )}
      </Panel>
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
