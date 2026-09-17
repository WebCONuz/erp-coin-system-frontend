import { Outlet } from "react-router-dom";
import { StudentNavbar, StudentBottomNav } from "@/widgets/navbar";
import { StudentSidebar } from "@/widgets/sidebar";

export default function StudentLayout() {
  return (
    <div className="flex h-screen font-body">
      <StudentSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <StudentNavbar />
        <main className="min-w-0 p-4 sm:p-6 pb-20 lg:pb-6 bg-paper h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <StudentBottomNav />
    </div>
  );
}
