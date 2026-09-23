import { CustomTable, TablePagination } from "@/components/shared/table";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import { PageLoading } from "@/components/loading";
import { useTranslation } from "react-i18next";
import { usePagination } from "@/hooks";
import { useStudentTable } from "../../hooks/useStudentTable";
import type { StudentDetail, StudentsResponse } from "../../types";

interface Props {
  data?: StudentsResponse;
  isLoading: boolean;
  handleEdit: (student: StudentDetail) => void;
}

export const StudentList = ({ data, isLoading, handleEdit }: Props) => {
  const { t } = useTranslation();
  const { columns } = useStudentTable({ handleEdit });
  const pagination = usePagination({
    totalItems: data?.meta?.total || 0,
    initialPageSize: 20,
  });

  if (isLoading) return <PageLoading />;

  if (!data?.data) return <NoData text={t("no_loading")} />;

  if (data.data.length === 0) {
    return (
      <NoDataBox
        title={t("admin.students.no_data")}
        btnText={t("admin.students.create_btn")}
        hasAction={false}
      />
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-900">
        <CustomTable
          data={data.data}
          columns={columns}
          className="border-0"
          loading={isLoading}
        />
      </div>

      {data.meta?.total > 0 && (
        <TablePagination
          totalItems={data.meta.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}
    </>
  );
};
