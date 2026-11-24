import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarSearch, CalendarX2, Plus } from "lucide-react";
import {
  SessionsFilterBar,
  SessionsGrid,
  SessionsGridSkeleton,
  SessionFormModal,
  SessionDeleteModal,
} from "@/features/sessions/components";
import { useSessions } from "@/features/sessions/hooks";
import type { SessionItem } from "@/features/sessions/types";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { TablePagination } from "@/components/shared/table";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks";

const FILTER_KEYS = ["groupId", "teacherId", "sessionType", "date", "isChecked"];

const SessionsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const {
    data: sessions,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useSessions();
  const pagination = usePagination({
    totalItems: sessions?.meta?.total || 0,
    initialPageSize: 20,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingSession, setDeletingSession] = useState<SessionItem | null>(
    null,
  );

  const isFiltered = FILTER_KEYS.some((key) => searchParams.has(key));

  return (
    <div className="space-y-5">
      <SessionsFilterBar onAdd={() => setIsModalOpen(true)} />

      {isLoading ? (
        <SessionsGridSkeleton />
      ) : isError && !sessions ? (
        <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
      ) : !sessions?.data.length ? (
        <div className="rounded-2xl border bg-card">
          {isFiltered ? (
            <EmptyState
              icon={CalendarSearch}
              title={t("sessions.emptyFiltered.title")}
              description={t("sessions.emptyFiltered.description")}
            />
          ) : (
            <EmptyState
              icon={CalendarX2}
              title={t("sessions.noSessions")}
              description={t("sessions.noSessionsHint")}
              action={
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                  <Plus className="size-4" aria-hidden />
                  {t("sessions.filter.addSession")}
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <>
          <SessionsGrid
            sessions={sessions.data}
            onDelete={setDeletingSession}
          />

          {sessions.meta.total > 0 && (
            <TablePagination
              totalItems={sessions.meta.total}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
            />
          )}
        </>
      )}

      <SessionFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <SessionDeleteModal
        session={deletingSession}
        onClose={() => setDeletingSession(null)}
      />
    </div>
  );
};

export default SessionsPage;
