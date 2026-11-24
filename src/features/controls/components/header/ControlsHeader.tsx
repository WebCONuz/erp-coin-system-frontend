import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { canViewAuditLogs } from "@/ustils";
import { cn } from "@/lib/utils";
import { getControlsHeader } from "../../constants";

/**
 * Sozlamalar bo'limlari navigatsiyasi: lg+ — chap vertikal menyu;
 * kichik ekranlarda — gorizontal suriladigan tablar.
 */
export const ControlsHeader = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const items = getControlsHeader(t, {
    canViewAuditLogs: canViewAuditLogs(user?.role),
  });

  return (
    <nav aria-label={t("admin.header.control")} className="min-w-0">
      {/* Kichik ekranlar */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:hidden">
        <ul className="flex w-max gap-1 rounded-xl border bg-card p-1">
          {items.map(({ name, link, icon: Icon }) => (
            <li key={link}>
              <NavLink
                to={link}
                className={({ isActive }) =>
                  cn(
                    "flex h-9 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                <Icon className="size-4" aria-hidden />
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* lg+ */}
      <ul className="hidden space-y-0.5 rounded-2xl border bg-card p-2 lg:block">
        {items.map(({ name, link, icon: Icon }) => (
          <li key={link}>
            <NavLink
              to={link}
              className={({ isActive }) =>
                cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                  isActive
                    ? "bg-primary-soft font-medium text-primary"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{name}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
