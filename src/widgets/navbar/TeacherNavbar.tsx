import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut, MonitorSmartphone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_LOGO, APP_NAME } from "@/assets/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/avatar";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { LogoutAllModal } from "@/features/auth/components";
import { LanguageMenu, ThemeToggle } from "./NavbarControls";

export function TeacherNavbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full shrink-0 border-b bg-card">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Mobilda sidebar yo'q — logo shu yerda */}
        <div className="flex items-center gap-2 lg:hidden">
          <img src={APP_LOGO} alt="" className="size-7" />
          <span className="font-heading text-base font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <LanguageMenu />
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t("common.profile")}
                className="ml-1 flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:rounded-lg sm:pr-1"
              >
                <UserAvatar
                  name={user?.fullName ?? "O"}
                  url={user?.avatarUrl}
                  className="size-8"
                />
                <span className="hidden text-left sm:block">
                  <span className="block max-w-40 truncate text-sm font-medium leading-none">
                    {user?.fullName ?? "—"}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {user?.role?.displayName ?? t("common.teacher")}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild className="mt-1 cursor-pointer gap-2.5 text-sm">
                <NavLink to="/teacher/profile">
                  <User size={15} className="text-muted-foreground" aria-hidden />
                  {t("common.profile")}
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer gap-2.5 text-sm text-destructive focus:text-destructive"
                onClick={() => logout()}
              >
                <LogOut size={15} aria-hidden />
                {t("common.logoutAction")}
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

      <LogoutAllModal
        open={isLogoutAllOpen}
        onClose={() => setIsLogoutAllOpen(false)}
      />
    </header>
  );
}
