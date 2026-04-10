import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-bg-primary">
      <Outlet />
    </div>
  );
}
