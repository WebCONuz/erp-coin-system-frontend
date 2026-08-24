import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CustomTable, TablePagination } from "@/components/shared/table";
import { DashboardTitle } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { RoleFormModal } from "@/features/roles/components";
import { useRoles, useDeleteRole, useRoleTable } from "@/features/roles/hooks";
import type { Role } from "@/features/roles/types";
import { usePagination } from "@/hooks";

const RolesPage = () => {
  const { data: roles, isLoading } = useRoles();
  const pagination = usePagination({ totalItems: roles?.meta?.total || 0 });
  const deleteRole = useDeleteRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleDelete = (role: Role) => {
    if (!window.confirm(`"${role.displayName}" rolini o'chirishni tasdiqlaysizmi?`))
      return;

    deleteRole.mutate(role.id, {
      onError: (error: any) =>
        toast.error(error?.data?.message || "Xatolik yuz berdi"),
    });
  };

  const { columns } = useRoleTable({ handleEdit, handleDelete });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <DashboardTitle title="Rollar" />
        <Button
          onClick={handleCreate}
          className="bg-linear-to-br from-purple-500 to-purple-700 text-white rounded-lg px-4 h-9 gap-2 shadow-sm"
        >
          <Plus size={18} />
          Rol qo'shish
        </Button>
      </div>

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

      <RoleFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingRole ? "edit" : "create"}
        role={editingRole ?? undefined}
      />
    </div>
  );
};

export default RolesPage;
