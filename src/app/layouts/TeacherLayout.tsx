import { Outlet } from "react-router-dom";
import { TeacherNavbar } from "@/widgets/navbar";
import { TeacherSidebar } from "@/widgets/sidebar";

export default function TeacherLayout() {
  return (
    <div className="flex h-screen font-body">
      <TeacherSidebar />
      <div className="flex flex-1 flex-col">
        <TeacherNavbar />
        <main className="p-6 bg-paper h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
