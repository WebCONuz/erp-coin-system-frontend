import { RadialProgress } from "@/components/shared/charts";

interface DonutChartProps {
  value: number;
  max: number;
  percent: number;
  isFull: boolean;
}

export const DonutChart = ({
  value,
  max,
  percent,
  isFull,
}: DonutChartProps) => {
  const color = isFull ? "#dc2626" : percent >= 80 ? "#d97706" : "#10b981";

  return (
    <RadialProgress percent={percent} size={160} strokeWidth={8} color={color}>
      <div className="flex flex-col items-center justify-center leading-tight">
        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {value} / {max}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {percent}% to'lgan
        </span>
      </div>
    </RadialProgress>
  );
};
