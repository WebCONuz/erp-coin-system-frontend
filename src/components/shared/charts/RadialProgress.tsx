import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { cn } from "@/lib/utils";

interface RadialProgressProps {
  /** 0-100 oralig'ida progress qiymati */
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  className?: string;
  /** Halqa markaziga chiqariladigan kontent (qiymat, foiz va h.k.) */
  children?: React.ReactNode;
}

export const RadialProgress = ({
  percent,
  size = 56,
  strokeWidth = 5,
  color = "#10b981",
  trackColor = "#e4e4e7",
  className,
  children,
}: RadialProgressProps) => {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const data = [{ value: clamped, fill: color }];

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <RadialBarChart
        width={size}
        height={size}
        cx="50%"
        cy="50%"
        innerRadius={size / 2 - strokeWidth}
        outerRadius={size / 2}
        barSize={strokeWidth}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          dataKey="value"
          background={{ fill: trackColor }}
          cornerRadius={strokeWidth / 2}
          isAnimationActive
        />
      </RadialBarChart>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};
