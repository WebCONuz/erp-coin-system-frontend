import { translateApiError } from "@/ustils";
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
import { useSearchParams } from "react-router-dom";
import { Plus, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardGrid } from "@/components/shared/card-grid";
import { TablePagination } from "@/components/shared/table";
import { usePagination } from "@/hooks";

const EmployeesPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { data: employees, isLoading, isError, refetch, isFetching } =
    useEmployees();
  const isFiltered =
    !!searchParams.get("search") ||
    !!searchParams.get("roleId") ||
    searchParams.get("status") === "archive";
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
      !window.confirm(
        t("employees.archiveConfirm", { name: employee.fullName }),
      )
    )
      return;

    archiveEmployee.mutate(employee.id, {
      onError: (error: unknown) =>
        toast.error(translateApiError(error, t)),
    });
  };

  const handleRestore = (employee: Employee) => {
    restoreEmployee.mutate(employee.id, {
      onError: (error: unknown) =>
        toast.error(translateApiError(error, t)),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <EmployeeDataFilter onAdd={handleCreate} />

      <CardGrid
        items={employees?.data}
        getKey={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        isRetrying={isFetching}
        isFiltered={isFiltered}
        emptyIcon={UsersRound}
        emptyTitle={t("employees.noData")}
        emptyHint={t("employees.emptyHint")}
        emptyAction={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="size-4" aria-hidden />
            {t("employees.addEmployee")}
          </Button>
        }
        renderItem={(item) => (
          <EmployeeCard
            data={item}
            onEdit={handleEdit}
            onChangePassword={setPasswordEmployee}
            onArchive={handleArchive}
            onRestore={handleRestore}
          />
        )}
      />

      {!!employees?.meta.total && (
        <TablePagination
          totalItems={employees.meta.total}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          onPageChange={pagination.setPage}
        />
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
