import { Card, CardContent } from "@/components/ui/card";
import { AttendanceRing } from "../ui";

export const StatCard = ({
  icon,
  label,
  value,
  iconBg,
  ring,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
  ring?: number;
}) => (
  <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
    <CardContent className="flex items-center gap-4 p-5">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
          {value}
        </p>
      </div>
      {ring !== undefined && <AttendanceRing percent={ring} />}
    </CardContent>
  </Card>
);
