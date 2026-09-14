import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  SessionsFilterBar,
  SessionListCard,
  SessionFormModal,
} from "@/features/sessions/components";
import { useSessions, useDeleteSession } from "@/features/sessions/hooks";
import type { SessionItem } from "@/features/sessions/types";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";

const SessionsPage = () => {
  const { t } = useTranslation();
  const { data: sessions, isLoading } = useSessions();
  const pagination = usePagination({
    totalItems: sessions?.meta?.total || 0,
    initialPageSize: 20,
  });
  const deleteSession = useDeleteSession();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (session: SessionItem) => {
    if (
      !window.confirm(
        t("sessions.deleteConfirm", {
          group: session.group.name,
          time: session.startTime,
        }),
      )
    )
      return;

    deleteSession.mutate(session.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  return (
    <div className="space-y-4">
      <SessionsFilterBar onAdd={() => setIsModalOpen(true)} />

      {isLoading ? (
        <PageLoading />
      ) : sessions?.data ? (
        <>
          {sessions.data.length === 0 ? (
            <NoDataBox
              title={t("sessions.noSessions")}
              btnText={t("sessions.filter.addSession")}
              btnFn={() => setIsModalOpen(true)}
              hasAction={false}
            />
          ) : (
            <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xl:gap-4">
              {sessions.data.map((item) => (
                <SessionListCard
                  data={item}
                  key={item.id}
                  onDelete={handleDelete}
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

      <SessionFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SessionsPage;
