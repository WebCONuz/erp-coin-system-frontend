import { NavLink } from "react-router-dom";
import {
  Home,
  ChevronRight,
  UsersRound,
  Gift,
  Building2,
  User,
  Sprout,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useTranslation } from "react-i18next";
import { ROLES } from "@/assets/constants";
import { useStudentLevel } from "@/features/student-profile/hooks";
import { Tooltip } from "./AdminSidebar";

const LOGO = "/logo.png";

export const StudentSidebar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const { progress } = useStudentLevel(user?.wallet?.balance ?? 0);

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
          className={`transition-transform duration-300 ${
            collapsed ? "" : "rotate-180"
          }`}
        />
      </div>

      {/* Logo */}
      <div
        className={`flex gap-x-2 h-14.25 items-center px-3 overflow-hidden relative border-b border-forest-light/60 z-20 ${
          collapsed ? "justify-center" : "justify-start"
        }`}
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
            <p className="text-[11px] text-paper/50 truncate">Bilim bog'i</p>
          </div>
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

        {(user?.role?.name === ROLES.SUPER_ADMIN ||
          user?.role?.name === ROLES.CREATOR) && (
          <NavLink
            to="/admin/tenants"
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
                <Building2
                  size={18}
                  className="shrink-0"
                  style={{ color: isActive ? "var(--color-gold)" : undefined }}
                />
                {!collapsed && <span>{t("admin.header.tenants")}</span>}
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* Level footer — do'konda faol sovg'a bo'lmasa daraja ko'rsatilmaydi */}
      {progress && (
        <div className={`relative z-20 p-2 ${collapsed ? "px-2" : ""}`}>
          <Tooltip
            label={t("garden.levelWithName", {
              level: progress.level.daraja,
              name: t(`garden.levels.${progress.level.nameKey}`),
            })}
            show={collapsed}
          >
            <div
              className={`rounded-2xl border border-gold/25 bg-forest-light p-3 ${
                collapsed ? "flex justify-center" : ""
              }`}
            >
              <div
                className={`flex items-center gap-2 ${collapsed ? "" : "mb-2"}`}
              >
                <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                  <Sprout size={15} className="text-gold" />
                </div>
                {!collapsed && (
                  <p className="font-display text-sm text-paper font-semibold truncate">
                    {t("garden.levelLabel", { level: progress.level.daraja })}
                  </p>
                )}
              </div>
              {!collapsed && (
                <>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-500"
                      style={{ width: `${progress.bandProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-paper/50 mt-1.5">
                    {progress.nextLevel
                      ? t("garden.coinsToNextShort", {
                          amount: progress.coinsToNext,
                        })
                      : t("garden.maxLevelShort")}
                  </p>
                </>
              )}
            </div>
          </Tooltip>
        </div>
      )}
    </aside>
  );
};
