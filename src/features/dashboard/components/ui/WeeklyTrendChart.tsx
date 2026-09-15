import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { CoinFlowTrendChart } from "@/components/shared/charts";
import type { CoinEconomyTrendPoint } from "../../types";

interface Props {
  data: CoinEconomyTrendPoint[];
}

export const WeeklyTrendChart = ({ data }: Props) => {
  const { t } = useTranslation();

  if (!data.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        {t("admin.dashboard.coinEconomy.noTrendData")}
      </div>
    );
  }

  return (
    <CoinFlowTrendChart
      data={data}
      earnedLabel={t("admin.dashboard.coinEconomy.earned")}
      deductedLabel={t("admin.dashboard.coinEconomy.deducted")}
      xTickFormatter={formatDayLabel}
      height={200}
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
