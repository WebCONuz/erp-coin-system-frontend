import { Outlet } from "react-router-dom";
import { TeacherNavbar, TeacherBottomNav } from "@/widgets/navbar";
import { TeacherSidebar } from "@/widgets/sidebar";

export default function TeacherLayout() {
  return (
    <div className="flex h-screen font-body">
      <TeacherSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TeacherNavbar />
        <main className="min-w-0 p-4 sm:p-6 pb-20 lg:pb-6 bg-paper h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <TeacherBottomNav />
    </div>
  );
}
