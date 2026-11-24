import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { DashboardTitle } from "@/components/shared/title";
import { ControlsHeader } from "@/features/controls/components/header";

/** Sozlamalar qobig'i: chapda bo'limlar, o'ngda tanlangan bo'lim sahifasi. */
const AdminControlLayput = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4 sm:space-y-5">
      <DashboardTitle
        title={t("admin.header.control")}
        description={t("controls.description")}
      />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-5">
        <div className="min-w-0 lg:sticky lg:top-0">
          <ControlsHeader />
        </div>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminControlLayput;
