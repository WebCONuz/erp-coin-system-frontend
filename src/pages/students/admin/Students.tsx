import { useState } from "react";
import { useStudents } from "@/features/students/hooks";
import type { StudentDetail } from "@/features/students/types";
import {
  StudentDataFilter,
  StudentList,
} from "@/features/students/components/partials";
import { StudentFormModal } from "@/features/students/components/modal";

const Students = () => {
  const { data: students, isLoading } = useStudents();

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
      />
    </div>
  );
};

export default Students;
