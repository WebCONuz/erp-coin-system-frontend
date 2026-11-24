import {
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Plus,
  UserPlus,
  BookOpen,
  CreditCard,
  User,
  Settings,
  LogOut,
  MonitorSmartphone,
  Building2,
  Check,
  Languages,
  type LucideIcon,
} from "lucide-react";
import { APP_LOGO, APP_NAME } from "@/assets/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { ROLES } from "@/assets/constants";
import { useAllTenants } from "@/features/tenants/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  setActiveTenantId,
  useActiveTenantId,
} from "@/features/tenants/lib";
import { MyProfileModal } from "@/features/profile/components";
import { LogoutAllModal } from "@/features/auth/components";

// Constants
const LANGUAGES = [
  { code: "uz", label: "O'zbekcha", short: "UZ" },
  { code: "uz_cr", label: "Кирилча", short: "ЎЗ" },
  { code: "ru", label: "Русский", short: "RU" },
];

// Props
interface AdminNavbarProps {
  onSidebarToggle?: () => void;
  onQuickAction?: (key: string) => void;
}

// Component
export function AdminNavbar({ onQuickAction }: AdminNavbarProps) {
  const { t, i18n } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();

  const quickActions: { key: string; label: string; icon: LucideIcon }[] = [
    { key: "student", label: t("admin.navbar.newStudent"), icon: UserPlus },
    { key: "group", label: t("admin.navbar.newGroup"), icon: BookOpen },
    { key: "session", label: t("admin.navbar.newSession"), icon: CreditCard },
  ];
  const { user, logout } = useAuth();
  const { data: tenants } = useAllTenants(
    user?.role?.name === ROLES.SUPER_ADMIN ||
      user?.role?.name === ROLES.CREATOR,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);
  const activeTenantId = useActiveTenantId();
  const navigate = useNavigate();

  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "A";

  const currentTenat = tenants?.find(
    (item) => item.id.toString() === activeTenantId,
  )?.name;

  // Tenantni almashtirish: store yangilanadi → AdminLayout `key` orqali qayta
  // mount bo'ladi va barcha query'lar yangi tenant hash'i bilan olinadi.
  const handleTenantChange = (id: string) => {
    setActiveTenantId(id);
    navigate(`/admin?tenantId=${id}`);
  };

  const isSystemUser =
    user?.role?.name === ROLES.SUPER_ADMIN ||
    user?.role?.name === ROLES.CREATOR;

  // Faol tenant URL'da ham ko'rinsin (havolani ulashish uchun). Tanlashning
  // o'zi `useEnsureActiveTenant` da (AdminLayout) bajariladi.
  const hasTenantInUrl = searchParams.has("tenantId");
  useEffect(() => {
    if (!isSystemUser || !activeTenantId || hasTenantInUrl) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tenantId", activeTenantId);
        return next;
      },
      { replace: true },
    );
  }, [isSystemUser, activeTenantId, hasTenantInUrl, setSearchParams]);

  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-20 w-full shrink-0 border-b bg-card">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Mobilda sidebar yo'q — logo shu yerda */}
        <div className="flex items-center gap-2 lg:hidden">
          <img src={APP_LOGO} alt="" className="size-7" />
          <span className="sr-only sm:not-sr-only font-heading text-base font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </div>

        {/* Quick add dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 gap-1.5 px-2.5"
              aria-label={t("admin.navbar.quickAdd")}
            >
              <Plus className="size-4" aria-hidden />
              <span className="hidden sm:inline">
                {t("admin.navbar.quickAdd")}
              </span>
              <ChevronDown
                className="hidden size-3.5 text-muted-foreground sm:block"
                aria-hidden
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {quickActions.map(({ key, label, icon: Icon }) => (
              <DropdownMenuItem
                key={key}
                className="cursor-pointer gap-2.5 text-sm"
                onClick={() => onQuickAction?.(key)}
              >
                <Icon size={15} className="text-muted-foreground" aria-hidden />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* select tenant */}
        {(user?.role?.name === ROLES.SUPER_ADMIN ||
          user?.role?.name === ROLES.CREATOR) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 min-w-0 gap-2 px-2.5"
                aria-label={t("admin.navbar.selectCenter")}
              >
                <Building2
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="max-w-28 truncate sm:max-w-48">
                  {currentTenat || t("admin.navbar.selectCenter")}
                </span>
                <ChevronDown
                  className="size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="max-h-80 w-56 overflow-y-auto"
            >
              {tenants?.map(({ id, name }) => (
                <DropdownMenuItem
                  key={id}
                  className={cn(
                    "cursor-pointer justify-between gap-2.5 text-sm",
                    name === currentTenat && "font-medium text-primary",
                  )}
                  onClick={() => handleTenantChange(id.toString())}
                >
                  <span className="truncate">{name}</span>
                  {name === currentTenat && (
                    <Check className="size-4" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-1.5 px-2.5"
                aria-label={t("shell.language")}
              >
                <Languages
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
                <span className="hidden md:inline">{currentLang.label}</span>
                <span className="md:hidden">{currentLang.short}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  lang={lang.code === "ru" ? "ru" : "uz"}
                  className={cn(
                    "cursor-pointer justify-between text-sm",
                    i18n.language === lang.code && "font-medium text-primary",
                  )}
                  onClick={() => i18n.changeLanguage(lang.code)}
                >
                  {lang.label}
                  {i18n.language === lang.code && (
                    <Check className="size-4" aria-hidden />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-9 text-muted-foreground hover:text-foreground sm:inline-flex"
            aria-label={t("shell.notifications")}
          >
            <Bell className="size-4.5" aria-hidden />
          </Button>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? t("shell.lightMode") : t("shell.darkMode")}
          >
            {isDark ? (
              <Sun className="size-4.5" aria-hidden />
            ) : (
              <Moon className="size-4.5" aria-hidden />
            )}
          </Button>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t("admin.navbar.profile")}
                className="ml-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="size-8 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <Avatar className="size-8 select-none">
                    <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {/* User info */}
              <div className="border-b px-3 py-2.5">
                <p className="truncate text-sm font-medium leading-none">
                  {user?.fullName ? user.fullName : t("admin.navbar.noName")}
                </p>
                {user?.username && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                )}
                {user?.role && (
                  <p className="mt-1.5 inline-flex rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
                    {user.role.displayName || user.role.name}
                  </p>
                )}
              </div>

              <DropdownMenuItem
                className="mt-1 cursor-pointer gap-2.5 text-sm"
                onClick={() => setIsProfileOpen(true)}
              >
                <User size={15} className="text-muted-foreground" aria-hidden />
                {t("admin.navbar.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 text-sm"
                onClick={() => navigate("/admin/control/reasons?direction=all")}
              >
                <Settings
                  size={15}
                  className="text-muted-foreground"
                  aria-hidden
                />
                {t("admin.navbar.settings")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer gap-2.5 text-sm text-destructive focus:text-destructive"
                onClick={() => logout()}
              >
                <LogOut size={15} aria-hidden />
                {t("admin.navbar.logout")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 text-sm text-destructive focus:text-destructive"
                onClick={() => setIsLogoutAllOpen(true)}
              >
                <MonitorSmartphone size={15} aria-hidden />
                {t("logoutAll.action")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <MyProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <LogoutAllModal
        open={isLogoutAllOpen}
        onClose={() => setIsLogoutAllOpen(false)}
      />
    </header>
  );
}
