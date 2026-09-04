import { useState } from "react";
import { toast } from "sonner";
import {
  SubjectDataFilter,
  SubjectCard,
  SubjectFormModal,
} from "@/features/subjects/components";
import { useSubjects, useDeleteSubject } from "@/features/subjects/hooks";
import type { Subject } from "@/features/subjects/types";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";

const SubjectsPage = () => {
  const { data: subjects, isLoading } = useSubjects();
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
    if (!window.confirm(`"${subject.name}" fanini o'chirishni tasdiqlaysizmi?`))
      return;

    deleteSubject.mutate(subject.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  return (
    <div className="space-y-4">
      <SubjectDataFilter onAdd={handleCreate} />

      {isLoading ? (
        <PageLoading />
      ) : subjects?.data ? (
        <>
          {subjects.data.length === 0 ? (
            <NoDataBox
              title="Hali fanlar mavjud emas!"
              btnText="Fan qo'shish"
              btnFn={handleCreate}
              hasAction={false}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {subjects.data.map((item) => (
                <SubjectCard
                  data={item}
                  key={item.id}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {subjects.meta.total > 0 && (
            <TablePagination
              totalItems={subjects.meta.total}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
            />
          )}
        </>
      ) : (
        <NoData text="Ma'lumotlar yuklanmadi!" />
      )}

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
