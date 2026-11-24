import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
import { CoinAmount } from "@/components/shared/coin";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { LogoutAllModal } from "@/features/auth/components";
import { LanguageMenu, ThemeToggle } from "./NavbarControls";

export function StudentNavbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full shrink-0 border-b bg-card">
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Mobilda sidebar yo'q — logo shu yerda */}
        <div className="flex items-center gap-2 lg:hidden">
          <img src={APP_LOGO} alt="" className="size-7" />
          <span className="hidden font-heading text-base font-semibold tracking-tight min-[380px]:inline">
            {APP_NAME}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Tanga balansi — o'quvchi uchun eng muhim raqam; do'konga olib boradi */}
          <Link
            to="/student/market"
            aria-label={`${t("students.detail.coinBalance")}: ${user?.wallet?.balance ?? 0}`}
            className="mr-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <CoinAmount
              value={user?.wallet?.balance ?? 0}
              variant="pill"
              className="px-2.5 py-1 text-sm"
            />
          </Link>

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
                <span className="hidden text-left md:block">
                  <span className="block max-w-40 truncate text-sm font-medium leading-none">
                    {user?.fullName ?? "—"}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {user?.role?.displayName ?? t("common.student")}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild className="mt-1 cursor-pointer gap-2.5 text-sm">
                <NavLink to="/student/profile">
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
