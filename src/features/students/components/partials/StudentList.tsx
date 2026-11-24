import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Pencil, Plus, SearchX, UsersRound } from "lucide-react";
import { CustomTable, TablePagination } from "@/components/shared/table";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { UserAvatar } from "@/components/shared/avatar";
import { CoinAmount } from "@/components/shared/coin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks";
import { useStudentTable } from "../../hooks/useStudentTable";
import type { StudentDetail, StudentsResponse } from "../../types";

interface Props {
  data?: StudentsResponse;
  isLoading: boolean;
  isError?: boolean;
  isRetrying?: boolean;
  onRetry?: () => void;
  /** Qidiruv/guruh filtri qo'yilganmi — bo'sh holat matni shunga qarab. */
  isFiltered?: boolean;
  onAdd?: () => void;
  handleEdit: (student: StudentDetail) => void;
}

export const StudentList = ({
  data,
  isLoading,
  isError,
  isRetrying,
  onRetry,
  isFiltered,
  onAdd,
  handleEdit,
}: Props) => {
  const { t } = useTranslation();
  const { columns } = useStudentTable({ handleEdit });
  const pagination = usePagination({
    totalItems: data?.meta?.total || 0,
    initialPageSize: 20,
  });

  if (isError && !data) {
    return <ErrorState onRetry={onRetry} isRetrying={isRetrying} />;
  }

  const list = data?.data ?? [];

  if (!isLoading && !list.length) {
    return (
      <div className="rounded-2xl border bg-card">
        {isFiltered ? (
          <EmptyState
            icon={SearchX}
            title={t("students.empty.filteredTitle")}
            description={t("students.empty.filteredHint")}
          />
        ) : (
          <EmptyState
            icon={UsersRound}
            title={t("admin.students.no_data")}
            description={t("students.empty.hint")}
            action={
              onAdd && (
                <Button onClick={onAdd} className="gap-2">
                  <Plus className="size-4" aria-hidden />
                  {t("students.filter.addStudent")}
                </Button>
              )
            }
          />
        )}
      </div>
    );
  }

  return (
    <>
      {/* Desktop/planshet: jadval */}
      <div className="hidden overflow-x-auto rounded-2xl border bg-card md:block">
        <CustomTable
          data={list}
          columns={columns}
          className="border-0"
          loading={isLoading}
        />
      </div>

      {/* Mobil: ixcham qatorlar */}
      <div className="md:hidden">
        {isLoading ? (
          <div aria-busy="true" className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : (
          <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
            {list.map((student) => (
              <li key={student.id} className="flex items-center gap-1 pr-2">
                <Link
                  to={`/admin/students/${student.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3 py-3 pl-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  <UserAvatar name={student.fullName} url={student.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {student.fullName}
                    </p>
                    <p className="truncate text-xs tabular-nums text-muted-foreground">
                      {student.phone}
                    </p>
                  </div>
                  <CoinAmount
                    value={student.wallet?.balance ?? 0}
                    variant="pill"
                    size="sm"
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0 text-muted-foreground"
                  onClick={() => handleEdit(student)}
                  aria-label={t("students.actions.edit", {
                    name: student.fullName,
                  })}
                >
                  <Pencil className="size-4" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!!data?.meta?.total && (
        <TablePagination
          totalItems={data.meta.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}
    </>
  );
};
