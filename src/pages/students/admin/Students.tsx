import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStudents } from "@/features/students/hooks";
import type { StudentDetail } from "@/features/students/types";
import {
  StudentDataFilter,
  StudentList,
} from "@/features/students/components/partials";
import { StudentFormModal } from "@/features/students/components/modal";

const Students = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const isActiveParam =
    status === "archive" ? "false" : status === "active" ? "true" : undefined;

  const { data: students, isLoading } = useStudents({
    search: searchParams.get("search") || undefined,
    groupId: searchParams.get("group_id") || undefined,
    isActive: isActiveParam,
    page: searchParams.get("page") || undefined,
    limit: "20",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail>();

  const handleCreate = () => {
    setModalMode("create");
    setSelectedStudent(undefined);
    setModalOpen(true);
  };

  const handleEdit = (student: StudentDetail) => {
    setModalMode("edit");
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const defaultRoleId = students?.data?.[0]?.role?.id ?? "";

  return (
    <div className="flex flex-col gap-y-6">
      <StudentDataFilter onAddStudent={handleCreate} />

      <StudentList
        data={students}
        isLoading={isLoading}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
      />

      <StudentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        student={selectedStudent}
        defaultRoleId={defaultRoleId}
      />
    </div>
  );
};

export default Students;
