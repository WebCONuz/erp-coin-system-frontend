import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TrendLineSeries {
  key: string;
  label: string;
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
      <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
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
              <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis
          dataKey={xDataKey}
          tickFormatter={xTickFormatter}
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide domain={["auto", "auto"]} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
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
