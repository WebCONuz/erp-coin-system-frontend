import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { ScheduleGrid } from "@/features/dashboard/components/ScheduleGrid";
import { DashboardTitle } from "@/components/shared/title";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <DashboardTitle
        title={t("admin.dashboard.title", {
          name: user?.fullName || "Hurmatli foydalanuvchi",
        })}
        description={t("admin.dashboard.description")}
      />
      <DashboardStats />
      <ScheduleGrid />
    </div>
  );
}
