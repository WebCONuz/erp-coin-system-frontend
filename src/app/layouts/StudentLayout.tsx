import { Outlet } from "react-router-dom";
import { StudentNavbar } from "@/widgets/navbar";
import { StudentSidebar } from "@/widgets/sidebar";

export default function StudentLayout() {
  return (
    <div className="flex h-screen">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
        <StudentNavbar />
        <main className="p-6 bg-bg-primary dark:bg-black h-[calc(100vh-56px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
