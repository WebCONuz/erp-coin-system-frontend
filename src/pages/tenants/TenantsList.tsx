import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";
import { ROLES } from "@/assets/constants";
import { useAuth } from "@/features/auth/hooks/useLogin";
import {
  TenantDataFilter,
  type TenantStatusFilter,
} from "@/features/tenants/components/TenantsFilter";
import { TenantsGrid } from "@/features/tenants/components/TenantsGrid";
import { TenantFormModal } from "@/features/tenants/components/TenantFormModal";
import { EmptyState } from "@/components/shared/states";
import type { TenentType } from "@/features/tenants/types";

const TenantsList = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenentType | null>(null);
  const [status, setStatus] = useState<TenantStatusFilter>("active");
  const [search, setSearch] = useState("");

  const handleCreate = () => {
    setEditingTenant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tenant: TenentType) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  const canManageTenants =
    user?.role?.name === ROLES.SUPER_ADMIN ||
    user?.role?.name === ROLES.CREATOR;

  if (!canManageTenants) {
    return (
      <div className="rounded-2xl border bg-card">
        <EmptyState icon={ShieldAlert} title={t("tenants.noAccess")} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <TenantDataFilter
        status={status}
        onStatusChange={setStatus}
        search={search}
        onSearch={setSearch}
        addTenant={handleCreate}
      />
      <TenantsGrid
        onEdit={handleEdit}
        onAdd={handleCreate}
        status={status}
        search={search}
      />

      <TenantFormModal
        open={isModalOpen}
        onClose={handleClose}
        mode={editingTenant ? "edit" : "create"}
        tenant={editingTenant ?? undefined}
      />
    </div>
  );
};

export default TenantsList;
