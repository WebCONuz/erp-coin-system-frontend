import { NavLink } from "react-router-dom";
import {
  Home,
  ChevronRight,
  UsersRound,
  School,
  GraduationCap,
  Gift,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

const LOGO = "/logo.png";

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: "/admin", label: "Asosiy", icon: Home, end: true },
    { to: "/admin/teachers", label: "O'qituvchilar", icon: UsersRound },
    { to: "/admin/groups", label: "Sinflar", icon: School },
    { to: "/admin/students", label: "Talabalar", icon: GraduationCap },
    { to: "/admin/market", label: "Sovg'alar", icon: Gift },
    { to: "/admin/control", label: "Boshqarish", icon: LayoutDashboard },
  ];

  return (
    <aside
      className={`relative border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } min-h-screen`}
    >
      {/* Toggle button */}
      <div
        className="w-6 h-6 rounded-md bg-primary flex items-center justify-center absolute -right-3.75 top-4 z-10 text-white cursor-pointer"
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
          <span className="text-primary font-bold text-lg ">BB-Coin</span>
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
                    ? "bg-primary text-white"
                    : "hover:bg-primary/10 hover:text-black text-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/20"
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
      </nav>
    </aside>
  );
}

// Tooltip wrapper
function Tooltip({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return <>{children}</>;
  return (
    <div className="group relative">
      {children}
      <div
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: "#001a70" }}
      >
        {label}
      </div>
    </div>
  );
}
