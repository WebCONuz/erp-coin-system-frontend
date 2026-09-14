import { useParams } from "react-router-dom";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { BackListButton } from "@/components/shared/back";
import { useSession } from "@/features/sessions/hooks";
import {
  TeacherSessionInfoCard,
  TeacherAttendanceTable,
  TeacherLockPanel,
} from "@/features/teacher-profile/components/sessions";

const SessionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading } = useSession(id ?? "");

  return (
    <div className="space-y-4">
      <BackListButton title="Darslarim" />

      {isLoading ? (
        <PageLoading />
      ) : !session ? (
        <NoData text="Dars topilmadi!" />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TeacherSessionInfoCard session={session} />
            <div className="rounded-2xl border border-ink/10 bg-white p-5 space-y-4">
              <h3 className="font-display text-sm font-semibold text-ink">
                Yo'qlama
              </h3>
              <TeacherAttendanceTable
                sessionId={session.id}
                groupId={session.group.id}
                isLocked={session.isLocked}
              />
            </div>
          </div>

          <TeacherLockPanel session={session} />
        </>
      )}
    </div>
  );
};

export default SessionDetailPage;
