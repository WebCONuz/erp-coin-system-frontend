type Props = {
  title: string;
  value: number;
  icon?: React.ReactNode;
};

export const StatsCard = ({ title, value, icon }: Props) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
      </div>
      <div className="text-primary">{icon}</div>
    </div>
  );
};
