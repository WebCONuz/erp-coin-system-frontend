import { format, parseISO } from "date-fns";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CoinFlowTrendChart } from "@/components/shared/charts";
import { EmptyState } from "@/components/shared/states";
import type { CoinEconomyTrendPoint } from "../../types";

interface Props {
  data: CoinEconomyTrendPoint[];
}

export const WeeklyTrendChart = ({ data }: Props) => {
  const { t } = useTranslation();

  if (!data.length) {
    return (
      <EmptyState
        size="sm"
        icon={BarChart3}
        title={t("admin.dashboard.coinEconomy.noTrendData")}
      />
    );
  }

  return (
    <CoinFlowTrendChart
      data={data}
      caption={t("admin.dashboard.last7Days")}
      earnedLabel={t("admin.dashboard.coinEconomy.earned")}
      deductedLabel={t("admin.dashboard.coinEconomy.deducted")}
      xTickFormatter={formatDayLabel}
      height={220}
    />
  );
};

const formatDayLabel = (date: string) => {
  try {
    return format(parseISO(date), "dd.MM");
  } catch {
    return date;
  }
};
