type Props = {
  title: string;
  value?: number;
  icon?: React.ReactNode;
  bgColor?: string;
};

export const StatsCard = ({
  title,
  value,
  icon,
  bgColor = "bg-white dark:bg-zinc-900",
}: Props) => {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm flex items-center justify-between ${bgColor}`}
    >
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        {value === undefined ? (
          <div className="mt-1.5 h-7 w-10 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        ) : (
          <h3 className="text-2xl font-semibold">{value}</h3>
        )}
      </div>
      <div className="text-primary">{icon}</div>
    </div>
  );
};
