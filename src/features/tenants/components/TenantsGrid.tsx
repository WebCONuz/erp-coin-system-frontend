import { PageLoading } from "@/components/loading";
import { useTranslation } from "react-i18next";
import { reloadPage } from "@/ustils";
import { NoDataBox, TenantCard } from "./ui";
import { useAllTenants } from "../hooks";

export const TenantsGrid = () => {
  const { data, isLoading } = useAllTenants();
  const { t } = useTranslation();

  return (
    <div className="">
      {isLoading ? (
        <PageLoading />
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-4 gap-8">
          {data.map((item) => (
            <TenantCard data={item} key={item.id} />
          ))}
        </div>
      ) : data && data.length === 0 ? (
        <NoDataBox
          title={t("admin.tenants.no_data")}
          btnText={t("admin.tenants.create")}
          btnFn={() => console.log("create")}
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
