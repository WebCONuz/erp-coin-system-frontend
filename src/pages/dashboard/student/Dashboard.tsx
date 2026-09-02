import { CalendarCheck, ClipboardCheck } from "lucide-react";
import { DashboardTitle } from "@/components/shared/title";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { StatCard } from "@/features/students/components/partials/StatCard";
import { useDashboard } from "@/features/student-profile/hooks";
import {
  WalletCard,
  SessionListCard,
  RecentTransactionsFeed,
  PendingPurchasesBanner,
} from "@/features/student-profile/components/dashboard";

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) return <PageLoading />;
  if (isError || !data) {
    return <NoData text="Dashboard ma'lumotlari topilmadi" />;
  }

  return (
    <div className="space-y-4">
      <div className="pb-2">
        <DashboardTitle
          title={`Xush kelibsiz, ${user?.fullName ?? data.student.fullName}`}
          description="Farzandingiz | Sizning bugungi natijalaringiz"
        />
      </div>

      <PendingPurchasesBanner purchases={data.purchases} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <WalletCard
          balance={data.wallet.balance}
          weekDelta={data.wallet.weekDelta}
          monthDelta={data.wallet.monthDelta}
        />
        <StatCard
          icon={<CalendarCheck size={20} className="text-green-600" />}
          label="Davomat (30 kun)"
          value={`${data.attendance.last30Days.presentCount}/${data.attendance.last30Days.totalSessions}`}
          iconBg="bg-green-100 dark:bg-green-900/40"
          ring={data.attendance.last30Days.attendanceRate}
        />
        <StatCard
          icon={<ClipboardCheck size={20} className="text-blue-600" />}
          label="Uy vazifa (30 kun)"
          value={`${data.attendance.last30Days.homeworkDoneCount}`}
          iconBg="bg-blue-100 dark:bg-blue-900/40"
          ring={data.attendance.last30Days.homeworkRate}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SessionListCard
          title="Bugungi darslar"
          sessions={data.todaySessions}
          emptyText="Bugun darsingiz yo'q"
        />
        <SessionListCard
          title="Yaqin darslar"
          sessions={data.upcomingSessions}
          emptyText="Rejalashtirilgan dars yo'q"
          showDate
        />
      </div>

      <RecentTransactionsFeed transactions={data.recentTransactions} />
    </div>
  );
};

export default Dashboard;
