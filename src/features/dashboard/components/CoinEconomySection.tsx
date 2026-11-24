import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Panel } from "@/components/shared/panel";
import { CoinAmount } from "@/components/shared/coin";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { WeeklyTrendChart } from "./ui";
import type { AdminDashboardCoinEconomy } from "../types";

interface Props {
  coinEconomy?: AdminDashboardCoinEconomy;
  isLoading?: boolean;
}

/**
 * Tanga iqtisodiyoti. Aylanmadagi tanga — sahifadagi yagona "katta" raqam
 * va yagona animatsiya (bir marta sanab chiqadi).
 */
export const CoinEconomySection = ({ coinEconomy, isLoading }: Props) => {
  const { t } = useTranslation();

  return (
    <Panel
      title={t("admin.dashboard.coinEconomy.title")}
      className="h-full"
      aria-busy={isLoading || undefined}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("admin.dashboard.coinEconomy.inCirculation")}
          </p>
          {isLoading ? (
            <Skeleton className="mt-2 h-10 w-40" />
          ) : (
            <CoinAmount
              value={coinEconomy?.totalInCirculation ?? 0}
              size="xl"
              animate
              className="mt-1"
            />
          )}
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:flex sm:gap-6">
          <MonthFigure
            label={t("admin.dashboard.coinEconomy.earnedThisMonth")}
            value={coinEconomy?.earnedThisMonth}
            sign={1}
            icon={TrendingUp}
            tone="text-success"
            isLoading={isLoading}
          />
          <MonthFigure
            label={t("admin.dashboard.coinEconomy.deductedThisMonth")}
            value={coinEconomy?.deductedThisMonth}
            sign={-1}
            icon={TrendingDown}
            tone="text-destructive"
            isLoading={isLoading}
          />
        </dl>
      </div>

      <div className="mt-6 border-t pt-5">
        {isLoading ? (
          <Skeleton className="h-56 w-full rounded-xl" />
        ) : (
          <WeeklyTrendChart data={coinEconomy?.weeklyTrend ?? []} />
        )}
      </div>
    </Panel>
  );
};

const MonthFigure = ({
  label,
  value,
  sign,
  icon: Icon,
  tone,
  isLoading,
}: {
  label: string;
  value?: number;
  sign: 1 | -1;
  icon: LucideIcon;
  tone: string;
  isLoading?: boolean;
}) => (
  <div className="min-w-0 rounded-xl bg-muted/60 px-3.5 py-2.5 sm:bg-transparent sm:p-0">
    <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className={cn("size-4", tone)} aria-hidden />
      {label}
    </dt>
    <dd className="mt-1">
      {isLoading ? (
        <Skeleton className="h-6 w-16" />
      ) : (
        <CoinAmount
          value={(value ?? 0) * sign}
          signed
          size="md"
          className={cn("text-base", tone)}
        />
      )}
    </dd>
  </div>
);
