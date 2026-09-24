import { useTranslation } from "react-i18next";
import { CustomTable, TablePagination } from "@/components/shared/table";
import { DashboardTitle } from "@/components/shared/title";
import { useRoles, useRoleTable } from "@/features/roles/hooks";
import { usePagination } from "@/hooks";

// Rollar backend tomonidan boshqariladi — bu sahifa faqat ko'rish uchun.
const RolesPage = () => {
  const { t } = useTranslation();
  const { data: roles, isLoading } = useRoles();
  const pagination = usePagination({ totalItems: roles?.meta?.total || 0 });
  const { columns } = useRoleTable();

  return (
    <div className="flex flex-col gap-4">
      <DashboardTitle title={t("roles.title")} />

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10">
        <CustomTable
          data={roles?.data ?? []}
          columns={columns}
          bodyClass="px-4 py-6"
          className="border-0 bg-background"
          loading={isLoading}
        />
      </div>

      {roles?.meta?.total && roles.meta.total > 0 && (
        <TablePagination
          totalItems={roles.meta.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
      )}
    </div>
  );
};

export default RolesPage;
