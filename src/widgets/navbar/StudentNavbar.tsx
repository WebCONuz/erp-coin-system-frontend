import { NavLink } from "react-router-dom";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
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

export function StudentNavbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "O";

  return (
    <header className="w-full border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-8">
        <div className="ml-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground dark:border-yellow-600/40"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun size={17} className="text-yellow-500" />
            ) : (
              <Moon size={17} />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-x-2 cursor-pointer">
                <Avatar className="h-8 w-8 select-none">
                  {user?.avatarUrl && (
                    <AvatarImage
                      src={getFileUrl(user.avatarUrl)}
                      alt="avatar"
                    />
                  )}
                  <AvatarFallback className="bg-linear-to-br from-purple-500 to-purple-700 text-white text-xs font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName ?? "- -"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user?.phone ?? ""}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                asChild
                className="gap-2.5 mt-1 text-sm cursor-pointer"
              >
                <NavLink to="/student/profile">
                  <User size={14} className="text-muted-foreground" />
                  Profil
                </NavLink>
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
