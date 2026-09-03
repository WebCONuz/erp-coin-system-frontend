import { NavLink } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
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

export function TeacherNavbar() {
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
    <header className="w-full border-b border-ink/10 bg-paper">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-8">
        <div className="ml-auto flex items-center gap-3">
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
                    {user?.role?.displayName ?? "O'qituvchi"}
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
