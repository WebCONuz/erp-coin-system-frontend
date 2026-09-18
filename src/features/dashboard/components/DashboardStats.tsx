import { BookOpen, Gift, GraduationCap, Layers, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatsCard } from "./ui";
import type { AdminDashboardStats } from "../types";

interface Props {
  stats?: AdminDashboardStats;
  isLoading?: boolean;
}

export const DashboardStats = ({ stats, isLoading }: Props) => {
  const { t } = useTranslation();

  const items = [
    {
      title: t("admin.dashboard.stats.groups"),
      value: stats?.groups,
      icon: <Layers size={20} />,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: t("admin.dashboard.stats.students"),
      value: stats?.students,
      icon: <Users size={20} />,
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: t("admin.dashboard.stats.teachers"),
      value: stats?.teachers,
      icon: <GraduationCap size={20} />,
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: t("admin.dashboard.stats.subjects"),
      value: stats?.subjects,
      icon: <BookOpen size={20} />,
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: t("admin.dashboard.stats.rewards"),
      value: stats?.rewards,
      icon: <Gift size={20} />,
      iconBg: "bg-pink-50 dark:bg-pink-500/10",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <StatsCard
          key={item.title}
          title={item.title}
          value={isLoading ? undefined : (item.value ?? 0)}
          icon={item.icon}
          iconBg={item.iconBg}
          iconColor={item.iconColor}
        />
      ))}
    </div>
  );
};
