import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export interface TrendBarSeries {
  key: string;
  label: string;
  color: string;
}

type ChartRow = Record<string, string | number>;

interface TrendBarChartProps<T extends object> {
  data: T[];
  series: TrendBarSeries[];
  xKey: keyof T & string;
  xTickFormatter?: (value: string) => string;
  height?: number;
}

export const TrendBarChart = <T extends object>({
  data,
  series,
  xKey,
  xTickFormatter,
  height = 160,
}: TrendBarChartProps<T>) => {
  const chartData = data as unknown as ChartRow[];
  const xDataKey: keyof ChartRow = xKey;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} barGap={4} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey={xDataKey}
          tickFormatter={xTickFormatter}
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key as keyof ChartRow}
            name={s.label}
            fill={s.color}
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
