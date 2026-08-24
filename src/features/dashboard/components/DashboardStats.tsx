import { StatsCard } from "./ui";

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-5 gap-4">
      <StatsCard title="Guruhlar" value={5} />
      <StatsCard title="Talabalar" value={3} />
      <StatsCard title="O‘qituvchilar" value={1} />
      <StatsCard title="Fanlar" value={0} />
      <StatsCard title="Sovg'alar" value={8} />
    </div>
  );
};
