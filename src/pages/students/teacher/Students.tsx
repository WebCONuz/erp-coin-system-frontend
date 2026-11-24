import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";
import { DashboardTitle } from "@/components/shared/title";
import { CardGrid } from "@/components/shared/card-grid";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";
import { useStudents } from "@/features/students/hooks";
import {
  TeacherStudentsFilterBar,
  TeacherStudentCard,
} from "@/features/teacher-profile/components/students";

const Students = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId") || undefined;
  const isFiltered = !!groupId || !!searchParams.get("search");

  const { data, isLoading, isError, refetch, isFetching } = useStudents(30);
  const pagination = usePagination({
    totalItems: data?.meta?.total || 0,
    initialPageSize: 30,
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <DashboardTitle
          title={t("teacherProfile.students.backToList")}
          description={t("teacherProfile.students.subtitle")}
        />
        <TeacherStudentsFilterBar />
      </div>

      <CardGrid
        items={data?.data}
        getKey={(student) => student.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        isFiltered={isFiltered}
        skeletonClassName="h-32"
        emptyIcon={GraduationCap}
        emptyTitle={t("teacherProfile.students.empty")}
        renderItem={(student) => (
          <TeacherStudentCard student={student} groupId={groupId} />
        )}
      />

      {!!data && data.meta.totalPages > 1 && (
        <TablePagination
          totalItems={data.meta.total}
          currentPage={pagination.currentPage}
          totalPages={data.meta.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}
    </div>
  );
};

export default Students;
