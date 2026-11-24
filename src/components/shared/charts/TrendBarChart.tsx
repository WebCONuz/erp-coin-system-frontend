import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface TrendBarSeries {
  key: string;
  label: string;
  /** Rang — iloji boricha token: `var(--chart-1)`. */
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

const AXIS_TICK = { fontSize: 11, fill: "var(--muted-foreground)" };

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
      <BarChart
        data={chartData}
        barGap={3}
        margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
      >
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
        />
        <YAxis
          allowDecimals={false}
          tick={AXIS_TICK}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)", opacity: 0.6 }}
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
          <Bar
            key={s.key}
            dataKey={s.key as keyof ChartRow}
            name={s.label}
            fill={s.color}
            radius={[4, 4, 0, 0]}
            maxBarSize={22}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
