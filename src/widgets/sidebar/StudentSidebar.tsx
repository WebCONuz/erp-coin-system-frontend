import { NavLink } from "react-router-dom";
import {
  Home,
  ChevronRight,
  UsersRound,
  Gift,
  Building2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useTranslation } from "react-i18next";
import { ROLES } from "@/assets/constants";
import { Tooltip } from "./AdminSidebar";

const LOGO = "/logo.png";

export const StudentSidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

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
    <aside
      className={`relative border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } min-h-screen`}
    >
      {/* Toggle button */}
      <div
        className="w-6 h-6 rounded-md bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center absolute -right-3.75 top-4 z-10 text-white cursor-pointer"
        onClick={() => setCollapsed((c) => !c)}
      >
        <ChevronRight
          size={16}
          className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
        />
      </div>

      {/* Logo */}
      <div
        className={`flex gap-x-2 h-14.25 items-center px-3 overflow-hidden relative border-b z-20 ${collapsed ? "justify-center" : "justify-start"}`}
      >
        <img
          src={LOGO}
          alt="bb-coin"
          className="transition-all duration-300 w-6 h-6"
        />
        {!collapsed && (
          <span className="text-purple-600 dark:text-yellow-400 font-bold text-lg ">
            BB-Coin
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1 px-2 pt-4 pb-2 relative z-20">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <Tooltip key={to} label={label} show={collapsed}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-linear-to-br from-purple-500 to-purple-700 text-white"
                    : "hover:bg-purple-600/10 hover:text-black text-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/20"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className="shrink-0"
                    style={{ color: isActive ? "#fff" : undefined }}
                  />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          </Tooltip>
        ))}

        {(user?.role?.name === ROLES.SUPER_ADMIN ||
          user?.role?.name === ROLES.CREATOR) && (
          <NavLink
            to="/admin/tenants"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-linear-to-br from-purple-500 to-purple-700 text-white"
                  : "hover:bg-purple-600/10 hover:text-black text-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/20"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <Building2
                  size={18}
                  className="shrink-0"
                  style={{ color: isActive ? "#fff" : undefined }}
                />
                {!collapsed && <span>{t("admin.header.tenants")}</span>}
              </>
            )}
          </NavLink>
        )}
      </nav>
    </aside>
  );
};
