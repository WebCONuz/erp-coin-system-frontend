import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/widgets/sidebar";
import { AdminNavbar } from "@/widgets/navbar";
import { StudentFormModal } from "@/features/students/components/modal";
import { GroupFormModal } from "@/features/groups/components/modals";
import { SessionFormModal } from "@/features/sessions/components";

type QuickAction = "student" | "group" | "session" | null;

export default function MainLayout() {
  const [quickAction, setQuickAction] = useState<QuickAction>(null);
  const closeQuickAction = () => setQuickAction(null);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminNavbar
          onQuickAction={(key) => setQuickAction(key as QuickAction)}
        />
        {/* `relative` — scroll konteyner absolute bolalar (masalan Radix
            Checkbox'ning <form> ichidagi yashirin inputi) uchun containing
            block bo'lishi kerak, aks holda ular body balandligini oshirib,
            ikkinchi scroll va pastda bo'sh joy hosil qiladi. */}
        <main className="relative p-6 bg-bg-primary dark:bg-black h-[calc(100vh-56px)] overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <StudentFormModal
        open={quickAction === "student"}
        onClose={closeQuickAction}
        mode="create"
      />
      <GroupFormModal
        open={quickAction === "group"}
        onClose={closeQuickAction}
        mode="create"
      />
      <SessionFormModal
        open={quickAction === "session"}
        onClose={closeQuickAction}
      />
    </div>
  );
}
