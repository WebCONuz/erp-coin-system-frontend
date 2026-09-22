import { useParams } from "react-router-dom";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { BackListButton } from "@/components/shared/back";
import { useSession } from "@/features/sessions/hooks";
import { TeacherSessionForm } from "@/features/teacher-profile/components/sessions";

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
        <TeacherSessionForm session={session} />
      )}
    </div>
  );
};

export default SessionDetailPage;
