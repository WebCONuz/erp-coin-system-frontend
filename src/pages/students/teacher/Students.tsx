import { useSearchParams } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";
import { useStudents } from "@/features/students/hooks";
import {
  TeacherStudentsFilterBar,
  TeacherStudentCard,
} from "@/features/teacher-profile/components/students";

const Students = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const groupId = searchParams.get("groupId") || undefined;
  const page = searchParams.get("page") || undefined;

  const { data, isLoading } = useStudents({ search, groupId, page, limit: "20" });
  const pagination = usePagination({
    totalItems: data?.meta?.total || 0,
    initialPageSize: 20,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          O'quvchilarim
        </h1>
        <p className="text-sm text-ink-soft mt-1">
          Dars beradigan guruhlaringizdagi barcha o'quvchilar
        </p>
      </div>

      <TeacherStudentsFilterBar />

      {isLoading ? (
        <PageLoading />
      ) : !data?.data ? (
        <NoData text="Ma'lumotlar yuklanmadi!" />
      ) : !data.data.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-ink/10 bg-white">
          <GraduationCap size={22} className="text-ink-soft/50 mb-2" />
          <p className="text-sm font-medium text-ink">O'quvchilar topilmadi</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.data.map((student) => (
              <TeacherStudentCard
                key={student.id}
                student={student}
                groupId={groupId}
              />
            ))}
          </div>

          {data.meta.totalPages > 1 && (
            <TablePagination
              totalItems={data.meta.total}
              currentPage={pagination.currentPage}
              totalPages={data.meta.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Students;
