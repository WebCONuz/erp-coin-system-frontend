import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading, isError } = useDashboard();
  const balance = user?.wallet?.balance ?? data?.wallet.balance ?? 0;
  const { progress } = useStudentLevel(balance);

  if (isLoading) return <PageLoading />;
  if (isError || !data) {
    return <NoData text={t("dashboard.notFound")} />;
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
          label={t("studentProfile.dashboard.attendanceLabel")}
          sublabel={
            data.attendance.last30Days.attendanceRate >= 100
              ? t("studentProfile.dashboard.attendanceFull")
              : t("studentProfile.dashboard.attendanceLast30")
          }
          value={t("studentProfile.dashboard.attendanceValue", {
            present: data.attendance.last30Days.presentCount,
            total: data.attendance.last30Days.totalSessions,
          })}
          percent={data.attendance.last30Days.attendanceRate}
          accent="forest"
        />
        <RingStatCard
          label={t("studentProfile.dashboard.homeworkLabel")}
          sublabel={t("studentProfile.dashboard.homeworkLast30")}
          value={t("studentProfile.dashboard.homeworkValue", {
            count: data.attendance.last30Days.homeworkDoneCount,
          })}
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
