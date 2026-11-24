import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useAdminNavItems,
  type AdminNavItem,
} from "@/widgets/sidebar/useAdminNavItems";

/** Pastki panelda doim ko'rinadigan bo'limlar; qolganlari "Yana" ichida. */
const PRIMARY_PATHS = [
  "/admin",
  "/admin/groups",
  "/admin/sessions",
  "/admin/purchases",
];

/** Mobil/planshet (< lg) uchun admin navigatsiyasi. */
export function AdminBottomNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const items = useAdminNavItems();

  const primary = PRIMARY_PATHS.map((p) => items.find((i) => i.to === p)).filter(
    (i): i is AdminNavItem => !!i,
  );
  const secondary = items.filter((i) => !PRIMARY_PATHS.includes(i.to));
  const isSecondaryActive = secondary.some((i) => pathname.startsWith(i.to));

  return (
    <>
      <nav
        aria-label={t("shell.mainNav")}
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur lg:hidden"
      >
        <div className="mx-auto flex h-16 max-w-xl items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
          {primary.map((item) => (
            <BottomLink key={item.to} item={item} />
          ))}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
              isSecondaryActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            {isSecondaryActive && <ActiveMark />}
            <LayoutGrid className="size-5" aria-hidden />
            {t("shell.more")}
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
          <SheetHeader>
            <SheetTitle className="font-heading">{t("shell.allSections")}</SheetTitle>
            <SheetDescription className="sr-only">
              {t("shell.allSections")}
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-2 px-4 pb-5 sm:grid-cols-4">
            {items.map(({ to, label, icon: Icon, end, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "relative flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 text-center text-xs font-medium transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary-soft text-primary"
                      : "bg-card text-foreground hover:bg-muted",
                  )
                }
              >
                <Icon className="size-5" aria-hidden />
                <span className="line-clamp-2">{label}</span>
                {!!badge && (
                  <span className="absolute top-2 right-2 min-w-5 rounded-full bg-warning px-1.5 text-[11px] font-semibold leading-5 text-background tabular-nums">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function BottomLink({ item: { to, label, icon: Icon, end, badge } }: { item: AdminNavItem }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <ActiveMark />}
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
  );
}

const ActiveMark = () => (
  <span
    aria-hidden
    className="absolute top-0 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-b-full bg-primary"
  />
);
