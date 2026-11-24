import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CalendarX2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroup } from "@/features/groups/hooks";
import {
  GroupInfo,
  StudentBalance,
  StudentsSection,
} from "@/features/groups/components/section";
import { GroupFormModal } from "@/features/groups/components/modals";
import { AddStudentDrawer } from "@/features/groups/components/drawers";
import { BackListButton } from "@/components/shared/back";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { useSessions } from "@/features/sessions/hooks";
import { usePagination } from "@/hooks";
import {
  SessionsGrid,
  SessionsGridSkeleton,
  SessionsFilterBar,
} from "@/features/sessions/components";
import { TablePagination } from "@/components/shared/table";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const { data: group, isLoading, isError } = useGroup(id!);
  const {
    data: sessions,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSessions,
    isFetching: isSessionFetching,
  } = useSessions();
  const pagination = usePagination({
    totalItems: sessions?.meta?.total || 0,
    initialPageSize: 20,
  });

  if (isLoading) {
    return <GroupDetailSkeleton />;
  }

  if (isError || !group) {
    return (
      <div className="space-y-4">
        <BackListButton title={t("groups.detail.breadcrumb")} />
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={SearchX}
            title={t("groups.detail.notFound")}
            action={
              <Button variant="outline" onClick={() => navigate("/admin/groups")}>
                {t("groups.detail.breadcrumb")}
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const isFull = group.students.length >= group.maxStudents;

  return (
    <div className="space-y-4 sm:space-y-5">
      <BackListButton title={t("groups.detail.breadcrumb")} />

      <GroupInfo group={group} onEdit={() => setIsEditModalOpen(true)} />

      {/* O'quvchilar — asosiy ish maydoni; statistika yon ustunda */}
      <div className="grid grid-cols-1 items-start gap-4 sm:gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <StudentsSection
          group={group}
          isFull={isFull}
          setIsAddStudentOpen={setIsAddStudentOpen}
        />
        <StudentBalance groupId={group.id} />
      </div>

      {/* Bu guruh uchun yaratilgan sessiyalar */}
      <section
        aria-labelledby="group-sessions-title"
        className="space-y-4 pt-2"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2
            id="group-sessions-title"
            className="font-heading text-lg font-semibold"
          >
            {t("groups.detail.sessionsTitle")}
          </h2>
          <SessionsFilterBar hasAction={false} pageName="group" />
        </div>

        {isSessionLoading ? (
          <SessionsGridSkeleton count={4} />
        ) : isSessionError && !sessions ? (
          <ErrorState
            onRetry={() => refetchSessions()}
            isRetrying={isSessionFetching}
          />
        ) : !sessions?.data.length ? (
          <div className="rounded-2xl border bg-card">
            <EmptyState
              icon={CalendarX2}
              title={t("groups.detail.noSessions")}
            />
          </div>
        ) : (
          <>
            <SessionsGrid
              sessions={sessions.data}
              hasAction={false}
              hideGroup
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

      {/* Edit modal */}
      <GroupFormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        group={group}
      />

      {/* Add student drawer */}
      <AddStudentDrawer
        open={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        group={group}
      />
    </div>
  );
};

const GroupDetailSkeleton = () => (
  <div aria-busy="true" className="space-y-4 sm:space-y-5">
    <Skeleton className="h-9 w-32" />
    <Skeleton className="h-32 rounded-2xl" />
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[3fr_2fr]">
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  </div>
);

export default GroupDetail;
