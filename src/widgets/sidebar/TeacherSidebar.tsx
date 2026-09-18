import { NavLink } from "react-router-dom";
import {
  Home,
  ChevronRight,
  UsersRound,
  BookOpenCheck,
  GraduationCap,
  Coins,
  User,
} from "lucide-react";
import { useState } from "react";
import { Tooltip } from "./AdminSidebar";

const LOGO = "/logo.png";

const NAV_ITEMS = [
  { to: "/teacher", label: "Asosiy", icon: Home, end: true },
  { to: "/teacher/groups", label: "Guruhlar (Dars jadvali)", icon: UsersRound },
  { to: "/teacher/sessions", label: "Darslarim", icon: BookOpenCheck },
  { to: "/teacher/students", label: "O'quvchilarim", icon: GraduationCap },
  { to: "/teacher/coin-rules", label: "Tanga qoidalari", icon: Coins },
  { to: "/teacher/profile", label: "Shaxsiy profil", icon: User },
];

export const TeacherSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative hidden lg:flex border-r border-forest-light/60 bg-forest flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } min-h-screen`}
    >
      {/* Toggle button */}
      <div
        className="w-6 h-6 rounded-full bg-gold flex items-center justify-center absolute -right-3 top-4 z-10 text-forest-deep cursor-pointer shadow-sm"
        onClick={() => setCollapsed((c) => !c)}
      >
        <ChevronRight
          size={16}
          className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
        />
      </div>

      {/* Logo */}
      <div
        className={`flex gap-x-2 h-14.25 items-center px-3 overflow-hidden relative border-b border-forest-light/60 z-20 ${collapsed ? "justify-center" : "justify-start"}`}
      >
        <img
          src={LOGO}
          alt="bb-coin"
          className="transition-all duration-300 w-7 h-7 rounded-lg"
        />
        {!collapsed && (
          <div className="leading-tight overflow-hidden">
            <p className="font-display text-gold-soft font-semibold text-lg truncate">
              BB-Coin
            </p>
            <p className="text-[11px] text-paper/50 truncate">
              O'qituvchi kabineti
            </p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1 px-2 pt-4 pb-2 relative z-20">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <Tooltip key={to} label={label} show={collapsed}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold/15 text-gold-soft ring-1 ring-gold/40"
                    : "text-paper/65 hover:bg-white/5 hover:text-paper"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className="shrink-0"
                    style={{
                      color: isActive ? "var(--color-gold)" : undefined,
                    }}
                  />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          </Tooltip>
        ))}
      </nav>
    </aside>
  );
};
