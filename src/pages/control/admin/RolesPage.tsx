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
    <div className="flex flex-col gap-4 sm:gap-5">
      <DashboardTitle
        title={t("roles.title")}
        description={t("roles.readOnlyHint")}
        as="h2"
      />

      <div className="w-full overflow-x-auto rounded-2xl border bg-card">
        <CustomTable
          data={roles?.data ?? []}
          columns={columns}
          className="border-0"
          loading={isLoading}
        />
      </div>

      {!!roles?.meta?.total && (
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
