import { Outlet } from "react-router-dom";
import { TeacherNavbar, TeacherBottomNav } from "@/widgets/navbar";
import { TeacherSidebar } from "@/widgets/sidebar";

export default function TeacherLayout() {
  return (
    <div className="flex h-dvh bg-background">
      <TeacherSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TeacherNavbar />
        {/* `pb-24` — mobilda pastki navigatsiya kontentni yopmasin. */}
        <main className="relative min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pt-4 pb-24 sm:px-6 sm:pt-6 lg:pb-8">
          <div className="mx-auto w-full max-w-420">
            <Outlet />
          </div>
        </main>
      </div>
      <TeacherBottomNav />
    </div>
  );
}
