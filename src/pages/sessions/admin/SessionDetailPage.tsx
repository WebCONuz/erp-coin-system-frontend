import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import {
  SessionForm,
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
          <SessionForm session={session} />
          <SessionStatusPanel session={session} />
        </>
      )}
    </div>
  );
};

export default SessionDetailPage;
