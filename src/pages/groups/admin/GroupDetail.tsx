import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGroup } from "@/features/groups/hooks";
import {
  GroupInfo,
  StudentBalance,
  StudentsSection,
} from "@/features/groups/components/section";
import { GroupFormModal } from "@/features/groups/components/modals";
import { AddStudentDrawer } from "@/features/groups/components/drawers";
import { BackListButton } from "@/components/shared/back";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const { data: group, isLoading, isError } = useGroup(id!);

  if (isLoading) {
    return <GroupDetailSkeleton />;
  }

  if (isError || !group) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-zinc-500 dark:text-zinc-400">
          Guruh ma'lumotlari topilmadi
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Orqaga
        </Button>
      </div>
    );
  }

  const isFull = group.students.length >= group.maxStudents;

  return (
    <div className="space-y-3">
      {/* Breadcrumb / Back */}
      <BackListButton title="Guruhlar" />

      {/* Guruh ma'lumotlari */}
      <div className="grid grid-cols-2 items-start gap-6">
        <div>
          <StudentBalance />
          <GroupInfo group={group} onEdit={() => setIsEditModalOpen(true)} />
        </div>
        <StudentsSection
          group={group}
          isFull={isFull}
          setIsAddStudentOpen={setIsAddStudentOpen}
        />
      </div>

      {/* Edit modal */}
      <GroupFormModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        group={group}
      />

      {/* Add student drawer */}
      <AddStudentDrawer
        open={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        group={group}
      />
    </div>
  );
};

const GroupDetailSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-pulse">
    <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
    <div className="h-44 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
    <div className="h-64 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
  </div>
);

export default GroupDetail;
