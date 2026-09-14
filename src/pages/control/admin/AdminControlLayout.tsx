import { useTranslation } from "react-i18next";
import { DashboardTitle } from "@/components/shared/title";
import { ControlsHeader } from "@/features/controls/components/header";
import { Outlet } from "react-router-dom";

const AdminControlLayput = () => {
  const { t } = useTranslation();
  return (
    <div>
      <DashboardTitle title={t("controls.title")} />
      <ControlsHeader />
      <div className="bg-background p-6 rounded-xl min-h-[calc(100vh-210px)] mt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminControlLayput;
