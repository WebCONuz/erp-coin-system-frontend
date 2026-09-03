import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useTeacherDashboard } from "@/features/teacher-profile/hooks";
import {
  TeacherHeroCard,
  PendingAttendanceBanner,
  TeacherSessionsCard,
  TeacherActivityFeed,
  TeacherGroupsPreview,
} from "@/features/teacher-profile/components/dashboard";

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useTeacherDashboard();

  if (isLoading) return <PageLoading />;
  if (isError || !data) {
    return <NoData text="Dashboard ma'lumotlari topilmadi" />;
  }

  return (
    <div className="space-y-4">
      <TeacherHeroCard
        fullName={user?.fullName ?? data.teacher.fullName}
        totalActiveGroups={data.groups.totalActive}
        totalStudents={data.groups.totalStudents}
      />

      <PendingAttendanceBanner sessions={data.pendingAttendanceSessions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
