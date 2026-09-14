import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useGroup } from "@/features/groups/hooks";
import {
  GroupInfo,
  StudentBalance,
  StudentsSection,
} from "@/features/groups/components/section";
import { GroupFormModal } from "@/features/groups/components/modals";
import { AddStudentDrawer } from "@/features/groups/components/drawers";
import { BackListButton } from "@/components/shared/back";
import { useSessions } from "@/features/sessions/hooks";
import { usePagination } from "@/hooks";
import { PageLoading } from "@/components/loading";
import { NoDataBox } from "@/features/tenants/components/ui";
import {
  SessionListCard,
  SessionsFilterBar,
} from "@/features/sessions/components";
import { TablePagination } from "@/components/shared/table";
import { NoData } from "@/components/partials/no-data";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const { data: group, isLoading, isError } = useGroup(id!);
  const { data: sessions, isLoading: isSessionLoading } = useSessions();
  const pagination = usePagination({
    totalItems: sessions?.meta?.total || 0,
    initialPageSize: 20,
  });

  if (isLoading) {
    return <GroupDetailSkeleton />;
  }

  if (isError || !group) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-zinc-500 dark:text-zinc-400">
          {t("groups.detail.notFound")}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          {t("groups.detail.back")}
        </Button>
      </div>
    );
  }

  const isFull = group.students.length >= group.maxStudents;

  return (
    <div className="space-y-3">
      {/* Breadcrumb / Back */}
      <BackListButton title={t("groups.detail.breadcrumb")} />

      {/* Guruh ma'lumotlari */}
      <div className="grid grid-cols-2 items-start gap-6">
        <div>
          <StudentBalance />
          <GroupInfo group={group} onEdit={() => setIsEditModalOpen(true)} />
        </div>
        <StudentsSection
          group={group}
          isFull={isFull}
          setIsAddStudentOpen={setIsAddStudentOpen}
        />
      </div>

      {/* Bu guruh uchun yaratilgan sessiyalar */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            {t("groups.detail.sessionsTitle")}
          </h2>
          <SessionsFilterBar hasAction={false} pageName="group" />
        </div>

        {isLoading || isSessionLoading ? (
          <PageLoading />
        ) : sessions?.data ? (
          <>
            {sessions.data.length === 0 ? (
              <NoDataBox
                title={t("groups.detail.noSessions")}
                btnText={t("groups.detail.addSession")}
                hasAction={false}
              />
            ) : (
              <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xl:gap-4">
                {sessions.data.map((item) => (
                  <SessionListCard
                    data={item}
                    key={item.id}
                    hasAction={false}
                  />
                ))}
              </div>
            )}

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
        ) : (
          <NoData text={t("common.noData")} />
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
  <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-pulse">
    <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
    <div className="h-44 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
    <div className="h-64 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
  </div>
);

export default GroupDetail;
