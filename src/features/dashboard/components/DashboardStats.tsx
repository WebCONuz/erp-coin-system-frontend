import { BookOpen, Gift, GraduationCap, Layers, Users } from "lucide-react";
import { StatsCard } from "./ui";
import type { AdminDashboardStats } from "../types";

interface Props {
  stats?: AdminDashboardStats;
  isLoading?: boolean;
}

export const DashboardStats = ({ stats, isLoading }: Props) => {
  const items = [
    { title: "Guruhlar", value: stats?.groups, icon: <Layers size={20} /> },
    { title: "Talabalar", value: stats?.students, icon: <Users size={20} /> },
    {
      title: "O‘qituvchilar",
      value: stats?.teachers,
      icon: <GraduationCap size={20} />,
    },
    { title: "Fanlar", value: stats?.subjects, icon: <BookOpen size={20} /> },
    { title: "Sovg'alar", value: stats?.rewards, icon: <Gift size={20} /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <StatsCard
          key={item.title}
          title={item.title}
          value={isLoading ? undefined : (item.value ?? 0)}
          icon={item.icon}
        />
      ))}
    </div>
  );
};
