import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useSession(id ?? "");

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft size={16} />
        {t("sessions.backToList")}
      </Button>

      {isLoading ? (
        <PageLoading />
      ) : !session ? (
        <NoData text={t("sessions.notFound")} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6">
            <SessionInfoCard session={session} />
            <div className="rounded-2xl bg-background p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-semibold">
                {t("sessions.attendance.title")}
              </h3>
              <AttendanceTable
                sessionId={session.id}
                groupId={session.group.id}
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
