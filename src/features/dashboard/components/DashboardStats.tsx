import { StatsCard } from "./ui";

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-5 gap-4">
      <StatsCard title="Sinflar" value={7} />
      <StatsCard title="Talabalar" value={39} />
      <StatsCard title="O‘qituvchilar" value={16} />
      <StatsCard title="Fanlar" value={20} />
      <StatsCard title="Sovg'alar" value={15} />
    </div>
  );
};
