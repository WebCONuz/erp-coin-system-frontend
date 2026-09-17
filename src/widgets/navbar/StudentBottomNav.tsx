import { NavLink } from "react-router-dom";
import { Home, UsersRound, Gift, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function StudentBottomNav() {
  const { t } = useTranslation();

  const navItems = [
    { to: "/student", label: t("admin.header.main"), icon: Home, end: true },
    {
      to: "/student/profile",
      label: t("students.header.profile"),
      icon: User,
    },
    {
      to: "/student/groups",
      label: t("admin.header.groups"),
      icon: UsersRound,
    },
    { to: "/student/market", label: t("admin.header.market"), icon: Gift },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-forest-light/60 bg-forest">
      <div className="flex items-center justify-around h-16 px-1 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[11px] font-medium",
                isActive ? "text-gold-soft" : "text-paper/65",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
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
