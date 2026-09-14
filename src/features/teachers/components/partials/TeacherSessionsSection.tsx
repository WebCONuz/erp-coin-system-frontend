import { useTranslation } from "react-i18next";
import {
  SessionListCard,
  SessionsFilterBar,
} from "@/features/sessions/components";
import { PageLoading } from "@/components/loading";
import { NoDataBox } from "@/features/tenants/components/ui";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";
import { NoData } from "@/components/partials/no-data";
import { useSessions } from "@/features/sessions/hooks";

export const TeacherSessionsSection = () => {
  const { t } = useTranslation();
  const { data: sessions, isLoading } = useSessions();
  const pagination = usePagination({
    totalItems: sessions?.meta?.total || 0,
    initialPageSize: 20,
  });

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
          {t("teachers.sessionsSection.title")}
        </h2>
        <SessionsFilterBar hasAction={false} pageName="teacher" />
      </div>

      {isLoading ? (
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
                <SessionListCard data={item} key={item.id} hasAction={false} />
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
  );
};
