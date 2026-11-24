import { useAuth } from "@/features/auth/hooks/useLogin";
import { useTeacherDashboard } from "@/features/teacher-profile/hooks";
import {
  TeacherHeroCard,
  PendingAttendanceBanner,
  TeacherSessionsCard,
  TeacherActivityFeed,
  TeacherGroupsPreview,
} from "@/features/teacher-profile/components/dashboard";
import { ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch, isFetching } =
    useTeacherDashboard();

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-4 sm:space-y-5">
        <Skeleton className="h-14 w-72" />
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <TeacherHeroCard
        fullName={user?.fullName ?? data.teacher.fullName}
        totalActiveGroups={data.groups.totalActive}
        totalStudents={data.groups.totalStudents}
        todaySessionsCount={data.todaySessions.length}
      />

      <PendingAttendanceBanner sessions={data.pendingAttendanceSessions} />

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <TeacherSessionsCard
          todaySessions={data.todaySessions}
          upcomingSessions={data.upcomingSessions}
        />
        <TeacherActivityFeed transactions={data.recentCoinTransactions} />
      </div>

      <TeacherGroupsPreview groups={data.groups.list} />
    </div>
  );
};

export default Dashboard;
