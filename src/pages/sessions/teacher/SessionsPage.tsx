import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarCheck2, CalendarX2 } from "lucide-react";
import { DashboardTitle } from "@/components/shared/title";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";
import { useSessions } from "@/features/sessions/hooks";
import {
  SessionsGrid,
  SessionsGridSkeleton,
} from "@/features/sessions/components";
import { TeacherSessionsFilterBar } from "@/features/teacher-profile/components/sessions";

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

  // Dashboard'dagi "barchasi" havolasidan — faqat qulflanmagan darslar.
  const pendingOnly = searchParams.get("pending") === "true";
  const list = pendingOnly
    ? (sessions?.data ?? []).filter((s) => !s.isLocked)
    : (sessions?.data ?? []);

  return (
    <div className="space-y-4 sm:space-y-5">
      <DashboardTitle
        title={t("teacherNav.sessions")}
        description={t("teacherProfile.sessions.subtitle")}
      />

      <TeacherSessionsFilterBar />

      {isLoading ? (
        <SessionsGridSkeleton />
      ) : isError && !sessions ? (
        <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
      ) : !list.length ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={pendingOnly ? CalendarCheck2 : CalendarX2}
            title={
              pendingOnly
                ? t("teacherProfile.sessions.noPending")
                : t("teacherProfile.sessions.empty")
            }
          />
        </div>
      ) : (
        <>
          <SessionsGrid
            sessions={list}
            hasAction={false}
            hideTeacher
            basePath="/teacher/sessions"
          />

          {!!sessions?.meta.total && sessions.meta.totalPages > 1 && (
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
    </div>
  );
};

export default SessionsPage;
