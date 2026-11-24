import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { BookText, Plus, SearchX } from "lucide-react";
import {
  SubjectDataFilter,
  SubjectCard,
  SubjectFormModal,
} from "@/features/subjects/components";
import { useSubjects, useDeleteSubject } from "@/features/subjects/hooks";
import type { Subject } from "@/features/subjects/types";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { TablePagination } from "@/components/shared/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks";

const GRID =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

const SubjectsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const {
    data: subjects,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useSubjects();
  const pagination = usePagination({
    totalItems: subjects?.meta?.total || 0,
    initialPageSize: 50,
  });

  const deleteSubject = useDeleteSubject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleCreate = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleDelete = (subject: Subject) => {
    if (!window.confirm(t("subjects.deleteConfirm", { name: subject.name })))
      return;

    deleteSubject.mutate(subject.id, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  const list = subjects?.data ?? [];
  const isFiltered =
    !!searchParams.get("search") || searchParams.get("status") === "archive";

  const renderContent = () => {
    if (isLoading) {
      return (
        <div aria-busy="true" className={GRID}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      );
    }
    if (isError && !subjects) {
      return <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />;
    }
    if (!list.length) {
      return (
        <div className="rounded-2xl border bg-card">
          {isFiltered ? (
            <EmptyState
              icon={SearchX}
              title={t("subjects.empty.filteredTitle")}
              description={t("subjects.empty.filteredHint")}
            />
          ) : (
            <EmptyState
              icon={BookText}
              title={t("subjects.noData")}
              description={t("subjects.empty.hint")}
              action={
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="size-4" aria-hidden />
                  {t("subjects.addSubject")}
                </Button>
              }
            />
          )}
        </div>
      );
    }

    return (
      <>
        <ul className={GRID}>
          {list.map((item) => (
            <li key={item.id}>
              <SubjectCard
                data={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>

        {!!subjects?.meta.total && (
          <TablePagination
            totalItems={subjects.meta.total}
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
      <SubjectDataFilter onAdd={handleCreate} />

      {renderContent()}

      <SubjectFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingSubject ? "edit" : "create"}
        subject={editingSubject ?? undefined}
      />
    </div>
  );
};

export default SubjectsPage;
