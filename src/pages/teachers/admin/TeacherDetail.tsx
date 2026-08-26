import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { BackListButton } from "@/components/shared/back";
import {
  TeacherDetailHeader,
  TeacherGroupsSection,
  TeacherSessionsSection,
} from "@/features/teachers/components/partials";
import {
  ChangePasswordModal,
  TeacherFormModal,
} from "@/features/teachers/components/modal";
import {
  useArchiveTeacher,
  useRestoreTeacher,
  useTeacherById,
} from "@/features/teachers/hooks";

const TeacherDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: teacher, isLoading } = useTeacherById(id ?? "");

  const archiveTeacher = useArchiveTeacher();
  const restoreTeacher = useRestoreTeacher();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const onError = (error: any) =>
    toast.error(error?.data?.message || "Xatolik yuz berdi");

  const handleArchive = () => {
    if (!id || !teacher) return;
    if (!window.confirm(`"${teacher.fullName}" ni arxivlashni tasdiqlaysizmi?`))
      return;
    archiveTeacher.mutate(id, { onError });
  };

  const handleRestore = () => {
    if (!id) return;
    restoreTeacher.mutate(id, { onError });
  };

  if (isLoading) return <PageLoading />;
  if (!teacher) return <NoData text="O'qituvchi topilmadi!" />;

  return (
    <div className="space-y-6">
      <BackListButton title="O'qituvchilar" />

      <TeacherDetailHeader
        teacher={teacher}
        onEdit={() => setIsEditOpen(true)}
        onChangePassword={() => setIsPasswordOpen(true)}
        onArchive={handleArchive}
        onRestore={handleRestore}
      />

      <TeacherGroupsSection groups={teacher.taughtGroups} />
      <TeacherSessionsSection />

      <TeacherFormModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        mode="edit"
        teacher={teacher}
      />

      <ChangePasswordModal
        open={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        teacherId={teacher.id}
      />
    </div>
  );
};

export default TeacherDetail;
