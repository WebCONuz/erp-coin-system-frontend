import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { useAuth } from "@/features/auth/hooks/useLogin";
import {
  useDashboard,
  useStudentLevel,
} from "@/features/student-profile/hooks";
import { computeAttendanceStreak } from "@/features/student-profile/lib/streak";
import {
  HeroProgressCard,
  RingStatCard,
  WeeklyOfferCard,
  UpcomingLessonsCard,
  RecentTransactionsFeed,
  PendingPurchasesBanner,
} from "@/features/student-profile/components/dashboard";

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useDashboard();
  const balance = user?.wallet?.balance ?? data?.wallet.balance ?? 0;
  const { progress } = useStudentLevel(balance);

  if (isLoading) return <PageLoading />;
  if (isError || !data) {
    return <NoData text="Dashboard ma'lumotlari topilmadi" />;
  }

  const streak = computeAttendanceStreak(data.recentTransactions);

  return (
    <div className="space-y-4">
      <HeroProgressCard
        fullName={user?.fullName ?? data.student.fullName}
        balance={balance}
        streak={streak}
        progress={progress}
      />

      <PendingPurchasesBanner purchases={data.purchases} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RingStatCard
          label="Bugungi davomat"
          sublabel={
            data.attendance.last30Days.attendanceRate >= 100
              ? "Barcha darslarga qatnashdingiz"
              : "So'nggi 30 kunlik davomat"
          }
          value={`${data.attendance.last30Days.presentCount} / ${data.attendance.last30Days.totalSessions} dars`}
          percent={data.attendance.last30Days.attendanceRate}
          accent="forest"
        />
        <RingStatCard
          label="Uy vazifalari"
          sublabel="30 kunlik davrda bajarilgan"
          value={`${data.attendance.last30Days.homeworkDoneCount} topshiriq`}
          percent={data.attendance.last30Days.homeworkRate}
          accent="gold"
        />
        <WeeklyOfferCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UpcomingLessonsCard
          todaySessions={data.todaySessions}
          upcomingSessions={data.upcomingSessions}
        />
        <RecentTransactionsFeed transactions={data.recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
