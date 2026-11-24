import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarX2 } from "lucide-react";
import { BackListButton } from "@/components/shared/back";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SessionForm,
  SessionHeader,
  SessionStatusPanel,
} from "@/features/sessions/components";
import { useSession } from "@/features/sessions/hooks";

const SessionDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const {
    data: session,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useSession(id ?? "");

  return (
    <div className="space-y-4 sm:space-y-5">
      <BackListButton title={t("sessions.backToList")} />

      {isLoading ? (
        <div aria-busy="true" className="space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      ) : isError && !session ? (
        <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
      ) : !session ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState icon={CalendarX2} title={t("sessions.notFound")} />
        </div>
      ) : (
        <>
          <SessionHeader
            session={session}
            actions={<SessionStatusPanel session={session} />}
          />
          <SessionForm session={session} />
        </>
      )}
    </div>
  );
};

export default SessionDetailPage;
