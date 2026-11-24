import { useTranslation } from "react-i18next";
import { CalendarX2 } from "lucide-react";
import {
  SessionsGrid,
  SessionsGridSkeleton,
  SessionsFilterBar,
} from "@/features/sessions/components";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";
import { useSessions } from "@/features/sessions/hooks";

export const TeacherSessionsSection = () => {
  const { t } = useTranslation();
  const { data: sessions, isLoading, isError, refetch, isFetching } =
    useSessions();
  const pagination = usePagination({
    totalItems: sessions?.meta?.total || 0,
    initialPageSize: 20,
  });

  return (
    <section aria-labelledby="teacher-sessions-title" className="space-y-4 pt-2">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2
          id="teacher-sessions-title"
          className="font-heading text-lg font-semibold"
        >
          {t("teachers.sessionsSection.title")}
        </h2>
        <SessionsFilterBar hasAction={false} pageName="teacher" />
      </div>

      {isLoading ? (
        <SessionsGridSkeleton count={4} />
      ) : isError && !sessions ? (
        <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
      ) : !sessions?.data.length ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState icon={CalendarX2} title={t("groups.detail.noSessions")} />
        </div>
      ) : (
        <>
          <SessionsGrid
            sessions={sessions.data}
            hasAction={false}
            hideTeacher
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
    </section>
  );
};
