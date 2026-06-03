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
  Receipt,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useLogin";

// Constants
const LANGUAGES = [
  { code: "uz", label: "O'zbekcha" },
  { code: "uz_cr", label: "Кирилча" },
  { code: "ru", label: "Русский" },
];

const QUICK_ACTIONS = [
  { key: "student", label: "Talaba qo'shish", icon: UserPlus },
  { key: "group", label: "Sinf qo'shish", icon: BookOpen },
  { key: "payment", label: "To'lov qo'shish", icon: CreditCard },
];

// Props
interface AdminNavbarProps {
  onSidebarToggle?: () => void;
  onQuickAction?: (key: string) => void;
}

// Component
export function AdminNavbar({ onQuickAction }: AdminNavbarProps) {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
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
    : "A";

  return (
    <header className="w-full border-b bg-background">
      <div className="flex h-14 items-center gap-2 pr-4 pl-8">
        {/* Quick add dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 gap-1 px-2.5 text-sm font-medium focus-visible:ring-0"
            >
              <Plus size={15} />
              <ChevronDown size={13} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {QUICK_ACTIONS.map(({ key, label, icon: Icon }) => (
              <DropdownMenuItem
                key={key}
                className="gap-2.5 text-sm cursor-pointer"
                onClick={() => onQuickAction?.(key)}
              >
                <Icon size={14} className="text-muted-foreground" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <div className="relative flex-1 max-w-72">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Qidirish..."
            className="h-9 pl-9 text-sm bg-muted/40 border-transparent focus-visible:border-input focus-visible:ring-0"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 gap-1.5 px-3 text-sm font-medium focus-visible:ring-0"
              >
                {currentLang.label}
                <ChevronDown size={13} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  className={cn(
                    "text-sm cursor-pointer justify-between",
                    i18n.language === lang.code && "text-primary font-medium",
                  )}
                  onClick={() => i18n.changeLanguage(lang.code)}
                >
                  {lang.label}
                  {i18n.language === lang.code && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bell */}
          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Bell size={17} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </Button>

          {/* Dark mode toggle */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </Button>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer select-none">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {/* User info */}
              <div className="px-3 py-2.5 border-b">
                <p className="text-sm font-medium leading-none">
                  {user?.fullName ? user.fullName : "- -"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.email ? user.email : ""}
                </p>
                <p className="text-xs mt-1 text-[10px] font-medium uppercase text-primary">
                  {user?.role?.name ? user?.role?.name : "student"}
                </p>
              </div>

              <DropdownMenuItem className="gap-2.5 mt-1 text-sm cursor-pointer">
                <User size={14} className="text-muted-foreground" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 text-sm cursor-pointer">
                <Settings size={14} className="text-muted-foreground" />
                Sozlamalar
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 text-sm cursor-pointer">
                <Receipt size={14} className="text-muted-foreground" />
                To'lov rejasi
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2.5 text-sm cursor-pointer text-destructive focus:text-destructive"
                onClick={() => logout()}
              >
                <LogOut size={14} />
                Chiqish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
