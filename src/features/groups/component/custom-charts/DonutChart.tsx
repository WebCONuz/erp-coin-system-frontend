const R = 38;
const CIRCUMFERENCE = 2 * Math.PI * R;

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
  const filled = CIRCUMFERENCE * (percent / 100);

  return (
    <div className="relative shrink-0 w-40 h-40">
      <svg width="160" height="160" viewBox="0 0 100 100">
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-zinc-200 dark:text-zinc-700"
        />
        {/* Fill */}
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {value} / {max}
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {percent}% to'lgan
        </span>
      </div>
    </div>
  );
};
