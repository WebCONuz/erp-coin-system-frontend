import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/states";
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
  const { data, isLoading, isError, refetch, isFetching } = useDashboard();
  const balance = user?.wallet?.balance ?? data?.wallet.balance ?? 0;
  const { progress } = useStudentLevel(balance);

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-4 sm:space-y-5">
        <Skeleton className="h-72 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
  }

  const streak = computeAttendanceStreak(data.recentTransactions);

  return (
    <div className="space-y-4 sm:space-y-5">
      <HeroProgressCard
        fullName={user?.fullName ?? data.student.fullName}
        balance={balance}
        streak={streak}
        progress={progress}
      />

      <PendingPurchasesBanner purchases={data.purchases} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
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
