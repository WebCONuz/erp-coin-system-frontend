import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { CustomTable, TablePagination } from "@/components/shared/table";
import {
  ChangePasswordModal,
  TeacherDataFilter,
  TeacherFormModal,
} from "@/features/teachers/components";
import {
  useArchiveTeacher,
  useRestoreTeacher,
  useTeachers,
  useTable,
} from "@/features/teachers/hooks";
import type { Teacher } from "@/features/teachers/types";
import { usePagination } from "@/hooks";

const Teachers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: teachers, isLoading } = useTeachers();
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
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  const handleRestore = (teacher: Teacher) => {
    restoreTeacher.mutate(teacher.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  const { columns } = useTable({
    onView: (teacher) =>
      navigate(`/admin/teachers/${teacher.id}?teacherId=${teacher.id}`),
    onEdit: handleEdit,
    onChangePassword: setPasswordTeacher,
    onArchive: handleArchive,
    onRestore: handleRestore,
  });

  const pagination = usePagination({
    totalItems: teachers?.meta?.total || 0,
  });

  return (
    <>
      <TeacherDataFilter onAdd={handleCreate} />

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-900">
        <CustomTable
          data={teachers?.data ?? []}
          columns={columns}
          bodyClass="px-4 py-6"
          className="border-0"
          loading={isLoading}
        />
      </div>

      {teachers?.meta?.total && teachers?.meta?.total > 0 && (
        <TablePagination
          totalItems={teachers?.meta?.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}

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
    </>
  );
};

export default Teachers;
