import { NavLink } from "react-router-dom";
import {
  Home,
  UsersRound,
  BookOpenCheck,
  GraduationCap,
  Coins,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/teacher", labelKey: "teacherNav.short.main", icon: Home, end: true },
  { to: "/teacher/groups", labelKey: "teacherNav.short.groups", icon: UsersRound },
  { to: "/teacher/sessions", labelKey: "teacherNav.short.sessions", icon: BookOpenCheck },
  { to: "/teacher/students", labelKey: "teacherNav.short.students", icon: GraduationCap },
  { to: "/teacher/coin-rules", labelKey: "teacherNav.short.coinRules", icon: Coins },
  { to: "/teacher/profile", labelKey: "teacherNav.short.profile", icon: User },
];

export function TeacherBottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-forest-light/60 bg-forest">
      <div className="flex items-center justify-around h-16 px-0.5 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ to, labelKey, icon: Icon, end }) => (
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
                <span className="truncate max-w-full">{t(labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
