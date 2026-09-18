import { NavLink } from "react-router-dom";
import {
  Home,
  UsersRound,
  BookOpenCheck,
  GraduationCap,
  Coins,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/teacher", label: "Asosiy", icon: Home, end: true },
  { to: "/teacher/groups", label: "Guruhlar", icon: UsersRound },
  { to: "/teacher/sessions", label: "Darslar", icon: BookOpenCheck },
  { to: "/teacher/students", label: "O'quvchilar", icon: GraduationCap },
  { to: "/teacher/coin-rules", label: "Tanga", icon: Coins },
  { to: "/teacher/profile", label: "Profil", icon: User },
];

export function TeacherBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-forest-light/60 bg-forest">
      <div className="flex items-center justify-around h-16 px-0.5 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium px-0.5",
                isActive ? "text-gold-soft" : "text-paper/65",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  style={{ color: isActive ? "var(--color-gold)" : undefined }}
                />
                <span className="truncate max-w-full">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
