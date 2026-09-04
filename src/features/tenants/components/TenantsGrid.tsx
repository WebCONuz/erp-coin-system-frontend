import { PageLoading } from "@/components/loading";
import { useTranslation } from "react-i18next";
import { reloadPage } from "@/ustils";
import { NoDataBox, TenantCard } from "./ui";
import { useAllTenants } from "../hooks";
import type { TenentType } from "../types";

interface Props {
  onEdit: (tenant: TenentType) => void;
  onAdd: () => void;
}

export const TenantsGrid = ({ onEdit, onAdd }: Props) => {
  const { data, isLoading } = useAllTenants(true);
  const { t } = useTranslation();

  return (
    <div className="">
      {isLoading ? (
        <PageLoading />
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {data.map((item) => (
            <TenantCard data={item} key={item.id} onEdit={onEdit} />
          ))}
        </div>
      ) : data && data.length === 0 ? (
        <NoDataBox
          title={t("admin.tenants.no_data")}
          btnText={t("admin.tenants.create")}
          btnFn={onAdd}
        />
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
