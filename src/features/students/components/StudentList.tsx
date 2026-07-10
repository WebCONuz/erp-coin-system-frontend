import { CustomTable, TablePagination } from "@/components/shared/table";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import { PageLoading } from "@/components/loading";
import { useTranslation } from "react-i18next";
import { usePagination } from "@/hooks";
import { useStudentTable } from "../hooks/useStudentTable";
import type { StudentDetail, StudentsResponse } from "../types";

interface Props {
  data?: StudentsResponse;
  isLoading: boolean;
  handleCreate: () => void;
  handleEdit: (student: StudentDetail) => void;
}

export const StudentList = ({ data, isLoading, handleCreate, handleEdit }: Props) => {
  const { t } = useTranslation();
  const { columns } = useStudentTable({ handleEdit });
  const pagination = usePagination({ totalItems: data?.meta?.total || 0 });

  if (isLoading) return <PageLoading />;

  if (!data?.data) return <NoData text={t("no_loading")} />;

  if (data.data.length === 0) {
    return (
      <NoDataBox
        title={t("groups.no_data")}
        btnText={t("groups.btn.create")}
        btnFn={handleCreate}
      />
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-900">
        <CustomTable
          data={data.data}
          columns={columns}
          bodyClass="px-4 py-6"
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
