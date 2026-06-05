import { CustomTable, TablePagination } from "@/components/shared/table";
import { TeacherDataFilter } from "@/features/teachers/components";
import { useTeachers, useTable } from "@/features/teachers/hooks";
import type { Teacher } from "@/features/teachers/types";
import { usePagination } from "@/hooks";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Teachers = () => {
  const [searchParams] = useSearchParams();
  const { data: teachers, isLoading } = useTeachers({
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
  });
  const [selectedId, setSelectedId] = useState<string>();

  const handleRowClick = (teacher: Teacher) => {
    console.log(selectedId);
    setSelectedId(teacher.id);
  };

  const { columns } = useTable({
    handleRowClick,
  });
  const pagination = usePagination({
    totalItems: teachers?.meta?.total || 0,
  });

  return (
    <>
      <TeacherDataFilter />

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
    </>
  );
};

export default Teachers;
