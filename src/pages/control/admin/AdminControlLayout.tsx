import { DashboardTitle } from "@/components/shared/title";
import { ControlsHeader } from "@/features/controls/components/header";
import { Outlet } from "react-router-dom";

const AdminControlLayput = () => {
  return (
    <div>
      <DashboardTitle title="Boshqaruv" />
      <ControlsHeader />
      <div className="bg-background p-6 rounded-xl min-h-[calc(100vh-210px)] mt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminControlLayput;
