import { NavLink } from "react-router-dom";
import { Bell, ChevronDown, Languages, LogOut, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { getFileUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

const LOGO = "/logo.png";

const LANGUAGES = [
  { code: "uz", label: "O'zbekcha" },
  { code: "uz_cr", label: "Кирилча" },
  { code: "ru", label: "Русский" },
];

export function TeacherNavbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const currentLang =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "O";

  return (
    <header className="w-full border-b border-ink/10 bg-paper">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-8">
        {/* logo */}
        <div className="flex gap-x-2 items-center lg:hidden">
          <img
            src={LOGO}
            alt="bb-coin"
            className="transition-all duration-300 w-7 h-7 rounded-lg"
          />

          <div className="leading-tight overflow-hidden">
            <p className="font-display text-forest font-semibold text-lg truncate">
              BB-Coin
            </p>
            <p className="text-[11px] text-forest/50 truncate">Bilim bog'i</p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 gap-1.5 px-2.5 sm:px-3 text-sm font-medium border-ink/15 text-ink-soft hover:text-ink hover:bg-paper-soft focus-visible:ring-0"
              >
                <Languages size={16} className="sm:hidden" />
                <span className="hidden sm:inline">{currentLang.label}</span>
                <ChevronDown
                  size={13}
                  className="hidden sm:inline text-muted-foreground"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className={cn(
                    "text-sm cursor-pointer justify-between",
                    i18n.language === lang.code &&
                      "text-purple-600 font-medium",
                  )}
                  onClick={() => i18n.changeLanguage(lang.code)}
                >
                  {lang.label}
                  {i18n.language === lang.code && (
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 border-ink/15 text-ink-soft hover:text-ink hover:bg-paper-soft"
          >
            <Bell size={17} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-x-2 cursor-pointer">
                <Avatar className="h-9 w-9 select-none ring-2 ring-gold/30">
                  {user?.avatarUrl && (
                    <AvatarImage
                      src={getFileUrl(user.avatarUrl)}
                      alt="avatar"
                    />
                  )}
                  <AvatarFallback className="bg-forest text-gold-soft text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium leading-none text-ink">
                    {user?.fullName ?? "- -"}
                  </p>
                  <p className="text-xs text-ink-soft mt-1">
                    {user?.role?.displayName ?? t("common.teacher")}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                asChild
                className="gap-2.5 mt-1 text-sm cursor-pointer"
              >
                <NavLink to="/teacher/profile">
                  <User size={14} className="text-muted-foreground" />
                  {t("common.profile")}
                </NavLink>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2.5 text-sm cursor-pointer text-destructive focus:text-destructive"
                onClick={() => logout()}
              >
                <LogOut size={14} />
                {t("common.logoutAction")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
