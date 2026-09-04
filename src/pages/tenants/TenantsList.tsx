import { useState } from "react";
import { ROLES } from "@/assets/constants";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { TenantDataFilter } from "@/features/tenants/components/TenantsFilter";
import { TenantsGrid } from "@/features/tenants/components/TenantsGrid";
import { TenantFormModal } from "@/features/tenants/components/TenantFormModal";
import { NoDataBox } from "@/features/tenants/components/ui";
import type { TenentType } from "@/features/tenants/types";
import { reloadPage } from "@/ustils";
import { useTranslation } from "react-i18next";

const TenantsList = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<TenentType | null>(null);

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

  return (
    <div className="space-y-6">
      {user?.role?.name === ROLES.SUPER_ADMIN ||
      user?.role?.name === ROLES.CREATOR ? (
        <>
          <TenantDataFilter
            addTenant={handleCreate}
            onSearch={(a) => console.log("search", a)}
          />
          <TenantsGrid onEdit={handleEdit} onAdd={handleCreate} />

          <TenantFormModal
            open={isModalOpen}
            onClose={handleClose}
            mode={editingTenant ? "edit" : "create"}
            tenant={editingTenant ?? undefined}
          />
        </>
      ) : (
        <NoDataBox
          title={t("no_loading")}
          btnText={t("re_try")}
          btnFn={reloadPage}
        />
      )}
    </div>
  );
};

export default TenantsList;
