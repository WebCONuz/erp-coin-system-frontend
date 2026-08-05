export const AttendanceRing = ({ percent }: { percent: number }) => {
  const R = 16;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const filled = CIRCUMFERENCE * (Math.min(percent, 100) / 100);
  return (
    <div className="relative shrink-0 w-11 h-11">
      <svg width="44" height="44" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-zinc-200 dark:text-zinc-700"
        />
        <circle
          cx="20"
          cy="20"
          r={R}
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          transform="rotate(-90 20 20)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      </svg>
    </div>
  );
};
