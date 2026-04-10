import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/widgets/sidebar";
import { AdminNavbar } from "@/widgets/navbar";
export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar />
        <main className="p-6 bg-bg-primary dark:bg-black h-[calc(100vh-56px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
