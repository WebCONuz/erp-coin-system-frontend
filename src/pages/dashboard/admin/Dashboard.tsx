import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { ScheduleGrid } from "@/features/dashboard/components/ScheduleGrid";
import { DashboardTitle } from "@/components/shared/title";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardTitle
        title="Salom, Abdusaid Jumakulov!"
        description="EduCoin platformasiga xush kelibsiz!"
      />
      <DashboardStats />
      <ScheduleGrid />
    </div>
  );
}
