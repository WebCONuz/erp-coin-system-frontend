import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import {
  AttendanceTable,
  SessionInfoCard,
  SessionStatusPanel,
} from "@/features/sessions/components";
import { useSession } from "@/features/sessions/hooks";

const SessionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useSession(id ?? "");

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft size={16} />
        Darslarga qaytish
      </Button>

      {isLoading ? (
        <PageLoading />
      ) : !session ? (
        <NoData text="Dars topilmadi!" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6">
            <SessionInfoCard session={session} />
            <div className="rounded-2xl bg-background p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold">Yo'qlama</h3>
              <AttendanceTable
                sessionId={session.id}
                groupId={session.groupId ?? session.group.id}
                isLocked={session.isLocked}
              />
            </div>
          </div>

          <SessionStatusPanel session={session} />
        </>
      )}
    </div>
  );
};

export default SessionDetailPage;
