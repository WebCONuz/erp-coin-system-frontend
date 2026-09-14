import { useState } from "react";

import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  EmployeeDataFilter,
  EmployeeFormModal,
  ChangePasswordModal,
  EmployeeCard,
} from "@/features/employees/components";
import {
  useEmployees,
  useArchiveEmployee,
  useRestoreEmployee,
} from "@/features/employees/hooks";
import type { Employee } from "@/features/employees/types";
import { PageLoading } from "@/components/loading";
import { NoData } from "@/components/partials/no-data";
import { NoDataBox } from "@/features/tenants/components/ui";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";

const EmployeesPage = () => {
  const { t } = useTranslation();
  const { data: employees, isLoading } = useEmployees();
  const pagination = usePagination({ totalItems: employees?.meta?.total || 0 });

  const archiveEmployee = useArchiveEmployee();
  const restoreEmployee = useRestoreEmployee();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [passwordEmployee, setPasswordEmployee] = useState<Employee | null>(
    null,
  );

  const handleCreate = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleArchive = (employee: Employee) => {
    if (
      !window.confirm(t("employees.archiveConfirm", { name: employee.fullName }))
    )
      return;

    archiveEmployee.mutate(employee.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  const handleRestore = (employee: Employee) => {
    restoreEmployee.mutate(employee.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || t("common.error")),
    });
  };

  return (
    <div className="space-y-6">
      <EmployeeDataFilter onAdd={handleCreate} />

      {isLoading ? (
        <PageLoading />
      ) : employees?.data ? (
        <>
          {employees.data.length === 0 ? (
            <NoDataBox
              title={t("employees.noData")}
              btnText={t("employees.addEmployee")}
              btnFn={handleCreate}
              hasAction={false}
            />
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {employees.data.map((item) => (
                <EmployeeCard
                  data={item}
                  key={item.id}
                  onEdit={handleEdit}
                  onChangePassword={setPasswordEmployee}
                  onArchive={handleArchive}
                  onRestore={handleRestore}
                />
              ))}
            </div>
          )}

          {employees.meta.total > 0 && (
            <TablePagination
              totalItems={employees.meta.total}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              onPageChange={pagination.setPage}
            />
          )}
        </>
      ) : (
        <NoData text={t("common.noData")} />
      )}

      <EmployeeFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingEmployee ? "edit" : "create"}
        employee={editingEmployee ?? undefined}
      />

      <ChangePasswordModal
        open={!!passwordEmployee}
        onClose={() => setPasswordEmployee(null)}
        employeeId={passwordEmployee?.id ?? ""}
      />
    </div>
  );
};

export default EmployeesPage;
