import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TrendLineSeries {
  key: string;
  label: string;
  /** Rang — iloji boricha token: `var(--chart-1)`. */
  color: string;
}

type ChartRow = Record<string, string | number>;

interface TrendLineChartProps<T extends object> {
  data: T[];
  series: TrendLineSeries[];
  xKey: keyof T & string;
  xTickFormatter?: (value: string) => string;
  height?: number;
}

const AXIS_TICK = { fontSize: 11, fill: "var(--muted-foreground)" };

export const TrendLineChart = <T extends object>({
  data,
  series,
  xKey,
  xTickFormatter,
  height = 160,
}: TrendLineChartProps<T>) => {
  const chartData = data as unknown as ChartRow[];
  const xDataKey: keyof ChartRow = xKey;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.key}
              id={`trend-line-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey={xDataKey}
          tickFormatter={xTickFormatter}
          tick={AXIS_TICK}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          minTickGap={16}
        />
        <YAxis
          domain={["auto", "auto"]}
          allowDecimals={false}
          tick={AXIS_TICK}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          labelFormatter={(label) =>
            xTickFormatter ? xTickFormatter(String(label)) : String(label)
          }
          contentStyle={{
            fontSize: 12,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            boxShadow: "0 4px 16px rgb(0 0 0 / 0.08)",
          }}
          labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }}
        />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key as keyof ChartRow}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#trend-line-${s.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};
