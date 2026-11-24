import { TrendBarChart } from "./TrendBarChart";

interface CoinFlowPoint {
  date: string;
  earned: number;
  deducted: number;
}

interface CoinFlowTrendChartProps {
  data: CoinFlowPoint[];
  earnedLabel: string;
  deductedLabel: string;
  xTickFormatter?: (value: string) => string;
  height?: number;
  /** Legenda chap tomonida ko'rsatiladigan sarlavha (masalan, "So'nggi 7 kun"). */
  caption?: string;
}

export const CoinFlowTrendChart = ({
  data,
  earnedLabel,
  deductedLabel,
  xTickFormatter,
  height = 160,
  caption,
}: CoinFlowTrendChartProps) => (
  <div>
    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {caption && (
        <span className="mr-auto text-sm font-medium text-foreground">
          {caption}
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-chart-1" aria-hidden />
        {earnedLabel}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-chart-2" aria-hidden />
        {deductedLabel}
      </span>
    </div>

    <TrendBarChart
      data={data}
      xKey="date"
      xTickFormatter={xTickFormatter}
      height={height}
      series={[
        { key: "earned", label: earnedLabel, color: "var(--chart-1)" },
        { key: "deducted", label: deductedLabel, color: "var(--chart-2)" },
      ]}
    />
  </div>
);
