import { useMemo, useState } from "react";
import { useStudents } from "@/features/students/hooks";
import type { StudentDetail } from "@/features/students/types";
import {
  StudentDataFilter,
  StudentList,
} from "@/features/students/components/partials";
import {
  StudentFormModal,
  BulkGiveCoinModal,
} from "@/features/students/components/modal";

const Students = () => {
  const { data: students, isLoading } = useStudents();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail>();
  const [bulkCoinOpen, setBulkCoinOpen] = useState(false);

  const bulkCoinStudents = useMemo(
    () =>
      (students?.data ?? []).map((s) => ({
        id: s.id,
        fullName: s.fullName,
        phone: s.phone,
        balance: s.wallet?.balance ?? 0,
      })),
    [students],
  );

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
      <StudentDataFilter
        onAddStudent={handleCreate}
        onBulkGiveCoin={() => setBulkCoinOpen(true)}
      />

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

      <BulkGiveCoinModal
        open={bulkCoinOpen}
        onClose={() => setBulkCoinOpen(false)}
        students={bulkCoinStudents}
      />
    </div>
  );
};

export default Students;
