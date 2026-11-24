import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { UserX } from "lucide-react";
import { BackListButton } from "@/components/shared/back";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: teacher, isLoading } = useTeacherById(id ?? "");

  const archiveTeacher = useArchiveTeacher();
  const restoreTeacher = useRestoreTeacher();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const onError = (error: any) =>
    toast.error(error?.data?.message || t("common.error"));

  const handleArchive = () => {
    if (!id || !teacher) return;
    if (
      !window.confirm(
        t("teachers.archiveConfirm", { name: teacher.fullName }),
      )
    )
      return;
    archiveTeacher.mutate(id, { onError });
  };

  const handleRestore = () => {
    if (!id) return;
    restoreTeacher.mutate(id, { onError });
  };

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-4 sm:space-y-5">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }
  if (!teacher) {
    return (
      <div className="space-y-4">
        <BackListButton title={t("admin.header.teachers")} />
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={UserX}
            title={t("teachers.notFound")}
            action={
              <Button variant="outline" onClick={() => navigate("/admin/teachers")}>
                {t("admin.header.teachers")}
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <BackListButton title={t("admin.header.teachers")} />

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
