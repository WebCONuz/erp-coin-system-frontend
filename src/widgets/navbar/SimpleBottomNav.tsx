import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { AppNavItem } from "@/widgets/sidebar/AppSidebar";

/** Mobil/planshet (< lg) pastki navigatsiya — barcha bo'limlar bitta qatorda. */
export function SimpleBottomNav({ items }: { items: AppNavItem[] }) {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("shell.mainNav")}
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-2xl items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute top-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-b-full bg-primary"
                  />
                )}
                <span className="relative">
                  <Icon className="size-5" aria-hidden />
                  {!!badge && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-4 rounded-full bg-warning px-1 text-center text-[10px] font-semibold leading-4 text-background tabular-nums">
                      {badge}
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate px-0.5">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
