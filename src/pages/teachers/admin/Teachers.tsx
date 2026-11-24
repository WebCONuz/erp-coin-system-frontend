import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { GraduationCap, Plus, SearchX } from "lucide-react";
import { CustomTable, TablePagination } from "@/components/shared/table";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { UserAvatar } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChangePasswordModal,
  TeacherDataFilter,
  TeacherFormModal,
  TeacherGroupChips,
  TeacherRowActions,
} from "@/features/teachers/components";
import {
  useArchiveTeacher,
  useRestoreTeacher,
  useTeachers,
  useTable,
} from "@/features/teachers/hooks";
import { teacherProfilePath } from "@/features/teachers/constants";
import type { Teacher } from "@/features/teachers/types";
import { usePagination } from "@/hooks";

const Teachers = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const {
    data: teachers,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useTeachers();
  const archiveTeacher = useArchiveTeacher();
  const restoreTeacher = useRestoreTeacher();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [passwordTeacher, setPasswordTeacher] = useState<Teacher | null>(null);

  const handleCreate = () => {
    setEditingTeacher(null);
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
  };

  const handleArchive = (teacher: Teacher) => {
    if (!window.confirm(t("teachers.archiveConfirm", { name: teacher.fullName })))
      return;

    archiveTeacher.mutate(teacher.id, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  const handleRestore = (teacher: Teacher) => {
    restoreTeacher.mutate(teacher.id, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  const handlers = {
    onEdit: handleEdit,
    onChangePassword: setPasswordTeacher,
    onArchive: handleArchive,
    onRestore: handleRestore,
  };

  const { columns } = useTable(handlers);

  const pagination = usePagination({
    totalItems: teachers?.meta?.total || 0,
  });

  const list = teachers?.data ?? [];
  const isFiltered = !!searchParams.get("search");

  const renderContent = () => {
    if (isError && !teachers) {
      return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
    }

    if (!isLoading && !list.length) {
      return (
        <div className="rounded-2xl border bg-card">
          {isFiltered ? (
            <EmptyState
              icon={SearchX}
              title={t("teachers.empty.filteredTitle")}
              description={t("teachers.empty.filteredHint")}
            />
          ) : (
            <EmptyState
              icon={GraduationCap}
              title={t("teachers.empty.title")}
              description={t("teachers.empty.hint")}
              action={
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="size-4" aria-hidden />
                  {t("teachers.filter.addTeacher")}
                </Button>
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

        {/* Mobil: kartalar */}
        <div className="md:hidden">
          {isLoading ? (
            <div aria-busy="true" className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {list.map((teacher) => (
                <li
                  key={teacher.id}
                  className="flex items-start gap-2 rounded-2xl border bg-card p-3 pr-2"
                >
                  <Link
                    to={teacherProfilePath(teacher.id)}
                    className="flex min-w-0 flex-1 items-start gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <UserAvatar name={teacher.fullName} url={teacher.avatarUrl} />
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div>
                        <p className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {teacher.fullName}
                          </span>
                          {!teacher.isActive && (
                            <Badge variant="secondary">
                              {t("students.status.archived")}
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs tabular-nums text-muted-foreground">
                          {teacher.phone}
                        </p>
                      </div>
                      <TeacherGroupChips groups={teacher.taughtGroups ?? []} />
                    </div>
                  </Link>
                  <TeacherRowActions teacher={teacher} {...handlers} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {!!teachers?.meta?.total && (
          <TablePagination
            totalItems={teachers.meta.total}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <TeacherDataFilter onAdd={handleCreate} total={teachers?.meta?.total} />

      {renderContent()}

      <TeacherFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingTeacher ? "edit" : "create"}
        teacher={editingTeacher ?? undefined}
      />

      <ChangePasswordModal
        open={!!passwordTeacher}
        onClose={() => setPasswordTeacher(null)}
        teacherId={passwordTeacher?.id ?? ""}
      />
    </div>
  );
};

export default Teachers;
