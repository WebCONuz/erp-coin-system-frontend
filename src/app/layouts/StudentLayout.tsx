import { Outlet } from "react-router-dom";
import { StudentNavbar } from "@/widgets/navbar";
import { StudentSidebar } from "@/widgets/sidebar";

export default function StudentLayout() {
  return (
    <div className="flex h-screen font-body">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
        <StudentNavbar />
        <main className="p-6 bg-paper h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
