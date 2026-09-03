import { useSearchParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";
import { useSessions } from "@/features/sessions/hooks";
import {
  TeacherSessionsFilterBar,
  TeacherSessionCard,
} from "@/features/teacher-profile/components/sessions";

const SessionsPage = () => {
  const [searchParams] = useSearchParams();
  const { data: sessions, isLoading } = useSessions();
  const pagination = usePagination({
    totalItems: sessions?.meta?.total || 0,
    initialPageSize: 20,
  });

  const pendingOnly = searchParams.get("pending") === "true";
  const list = pendingOnly
    ? (sessions?.data ?? []).filter((s) => !s.isLocked)
    : (sessions?.data ?? []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Darslarim
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Barcha darslaringiz va yo'qlama holati
        </p>
      </div>

      <TeacherSessionsFilterBar />

      {isLoading ? (
        <PageLoading />
      ) : !sessions?.data ? (
        <NoData text="Ma'lumotlar yuklanmadi!" />
      ) : !list.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-ink/10 bg-white">
          <CalendarDays size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">
            {pendingOnly
              ? "Yo'qlama kutilayotgan dars yo'q"
              : "Darslar mavjud emas"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {list.map((session) => (
              <TeacherSessionCard key={session.id} data={session} />
            ))}
          </div>

          {sessions.meta.totalPages > 1 && (
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
