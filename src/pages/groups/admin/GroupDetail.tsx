import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGroup } from "@/features/groups/hooks";
import { GroupInfo, StudentTable } from "@/features/groups/component/section";
import { GroupFormModal } from "@/features/groups/component/modals";
import { AddStudentDrawer } from "@/features/groups/component/drawers";

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
    <div className="space-y-6">
      {/* Breadcrumb / Back */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => navigate(-1)}
          className="gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Guruhlar
        </Button>
      </div>

      {/* Guruh ma'lumotlari */}
      <GroupInfo group={group} onEdit={() => setIsEditModalOpen(true)} />

      {/* Studentlar bo'limi */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              O'quvchilar
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {group.students.length} ta o'quvchi
            </p>
          </div>
          <Button
            onClick={() => setIsAddStudentOpen(true)}
            disabled={isFull}
            size="default"
            className="gap-2 bg-primary/90 hover:bg-primary dark:bg-blue-500 text-white disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            {isFull ? "Guruh to'lgan" : "Student qo'shish"}
          </Button>
        </div>

        <StudentTable group={group} />
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
