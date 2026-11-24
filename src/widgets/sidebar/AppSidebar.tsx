import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_LOGO, APP_NAME } from "@/assets/constants";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface AppNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: number;
}

interface Props {
  items: AppNavItem[];
  /** Yig'ilgan holat saqlanadigan localStorage kaliti (rol bo'yicha alohida). */
  storageKey: string;
  /** Logo ostidagi kichik matn (masalan, "O'qituvchi kabineti"). */
  subtitle?: string;
  /** Navigatsiya ostidagi qo'shimcha blok (yig'ilmagan holatda). */
  footer?: ReactNode;
}

const readCollapsed = (key: string) => {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

/** Desktop (lg+) sidebar — barcha rollar uchun. Mobilda pastki navigatsiya. */
export function AppSidebar({ items, storageKey, subtitle, footer }: Props) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(() => readCollapsed(storageKey));

  const toggle = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(storageKey, c ? "0" : "1");
      } catch {
        /* saqlash shart emas */
      }
      return !c;
    });
  };

  return (
    <aside
      className={cn(
        "hidden h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex",
        collapsed ? "w-[68px]" : "w-60",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2.5 px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <img src={APP_LOGO} alt="" className="size-7 shrink-0" />
        {!collapsed && (
          <div className="min-w-0 leading-tight">
            <p className="truncate font-heading text-[17px] font-semibold tracking-tight text-white">
              {APP_NAME}
            </p>
            {subtitle && (
              <p className="truncate text-[11px] text-sidebar-muted">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <nav
        aria-label={t("shell.mainNav")}
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 py-3"
      >
        <TooltipProvider>
          {items.map((item) => (
            <SidebarLink key={item.to} item={item} collapsed={collapsed} />
          ))}
        </TooltipProvider>
      </nav>

      {footer && !collapsed && <div className="shrink-0 px-2.5 pb-2">{footer}</div>}

      <div className="shrink-0 border-t border-sidebar-border p-2.5">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-label={
            collapsed ? t("shell.expandSidebar") : t("shell.collapseSidebar")
          }
          className={cn(
            "flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-sidebar-ring",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-[18px]" aria-hidden />
          ) : (
            <>
              <PanelLeftClose className="size-[18px]" aria-hidden />
              <span>{t("shell.collapseSidebar")}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({
  item: { to, label, icon: Icon, end, badge },
  collapsed,
}: {
  item: AppNavItem;
  collapsed: boolean;
}) {
  const link = (
    <NavLink
      to={to}
      end={end}
      aria-label={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-sidebar-ring",
          isActive
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground before:absolute before:inset-y-2 before:-left-2.5 before:w-[3px] before:rounded-r-full before:bg-sidebar-primary"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          collapsed && "justify-center px-0",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative shrink-0">
            <Icon
              className={cn(
                "size-[18px]",
                isActive ? "text-sidebar-primary" : "text-sidebar-muted",
              )}
              aria-hidden
            />
            {!!badge && collapsed && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-warning ring-2 ring-sidebar" />
            )}
          </span>
          {!collapsed && <span className="flex-1 truncate">{label}</span>}
          {!!badge && !collapsed && (
            <span className="min-w-5 rounded-full bg-warning px-1.5 text-center text-[11px] font-semibold leading-5 text-background tabular-nums">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
