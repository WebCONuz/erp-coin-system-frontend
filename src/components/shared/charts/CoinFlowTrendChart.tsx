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
}

export const CoinFlowTrendChart = ({
  data,
  earnedLabel,
  deductedLabel,
  xTickFormatter,
  height = 160,
}: CoinFlowTrendChartProps) => (
  <div>
    <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500" /> {earnedLabel}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-500" /> {deductedLabel}
      </span>
    </div>

    <TrendBarChart
      data={data}
      xKey="date"
      xTickFormatter={xTickFormatter}
      height={height}
      series={[
        { key: "earned", label: earnedLabel, color: "#10b981" },
        { key: "deducted", label: deductedLabel, color: "#ef4444" },
      ]}
    />
  </div>
);
