import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/widgets/sidebar";
import { AdminBottomNav, AdminNavbar } from "@/widgets/navbar";
import { StudentFormModal } from "@/features/students/components/modal";
import { GroupFormModal } from "@/features/groups/components/modals";
import { SessionFormModal } from "@/features/sessions/components";

type QuickAction = "student" | "group" | "session" | null;

export default function MainLayout() {
  const [quickAction, setQuickAction] = useState<QuickAction>(null);
  const closeQuickAction = () => setQuickAction(null);

  return (
    <div className="flex h-dvh bg-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar
          onQuickAction={(key) => setQuickAction(key as QuickAction)}
        />
        {/* `relative` — scroll konteyner absolute bolalar (masalan Radix
            Checkbox'ning <form> ichidagi yashirin inputi) uchun containing
            block bo'lishi kerak, aks holda ular body balandligini oshirib,
            ikkinchi scroll va pastda bo'sh joy hosil qiladi.
            `pb-24` — mobilda pastki navigatsiya kontentni yopmasin. */}
        <main className="relative min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pt-4 pb-24 sm:px-6 sm:pt-6 lg:pb-8">
          <div className="mx-auto w-full max-w-420">
            <Outlet />
          </div>
        </main>
      </div>
      <AdminBottomNav />

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
