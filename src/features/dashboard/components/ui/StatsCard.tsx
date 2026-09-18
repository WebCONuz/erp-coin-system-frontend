import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  value?: number;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
};

export const StatsCard = ({
  title,
  value,
  icon,
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
}: Props) => {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{title}</p>
          {value === undefined ? (
            <div className="mt-1.5 h-6 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          ) : (
            <p className="text-xl font-bold leading-tight text-zinc-900 dark:text-zinc-50">
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
