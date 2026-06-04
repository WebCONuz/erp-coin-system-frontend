import { ROLES } from "@/assets/constants";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { TenantDataFilter } from "@/features/tenants/components/TenantsFilter";
import { TenantsGrid } from "@/features/tenants/components/TenantsGrid";
import { NoDataBox } from "@/features/tenants/components/ui";
import { reloadPage } from "@/ustils";
import { useTranslation } from "react-i18next";

const TenantsList = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {user?.role?.name === ROLES.SUPER_ADMIN ||
      user?.role?.name === ROLES.CREATOR ? (
        <>
          <TenantDataFilter
            addTenant={() => console.log("add-tenant")}
            onSearch={(a) => console.log("search", a)}
          />
          <TenantsGrid />
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
