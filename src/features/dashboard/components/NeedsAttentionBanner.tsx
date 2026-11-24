import { Link } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Gift,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminDashboardNeedsAttention } from "../types";

interface Props {
  needsAttention?: AdminDashboardNeedsAttention;
  isLoading?: boolean;
}

interface Task {
  key: string;
  to: string;
  label: string;
  icon: LucideIcon;
}

/** "Bajarilishi kerak" — adminning bugungi ishlari, dashboarddagi eng muhim blok. */
export const NeedsAttentionBanner = ({ needsAttention, isLoading }: Props) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        className="grid gap-2 rounded-2xl border bg-card p-4 sm:p-5 md:grid-cols-3"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!needsAttention) return null;

  const { pendingPurchases, approvedPurchases, pendingAttendanceSessions } =
    needsAttention;

  const tasks: Task[] = [
    !!pendingPurchases && {
      key: "pending",
      to: "/admin/purchases?status=pending",
      label: t("admin.dashboard.pendingPurchases", { count: pendingPurchases }),
      icon: Gift,
    },
    !!approvedPurchases && {
      key: "approved",
      to: "/admin/purchases?status=approved",
      label: t("admin.dashboard.approvedPurchases", {
        count: approvedPurchases,
      }),
      icon: PackageCheck,
    },
    !!pendingAttendanceSessions && {
      key: "attendance",
      to: "/admin/sessions",
      label: t("admin.dashboard.pendingAttendance", {
        count: pendingAttendanceSessions,
      }),
      icon: CalendarClock,
    },
  ].filter((x): x is Task => !!x);

  if (!tasks.length) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border bg-card px-4 py-3.5 sm:px-5">
        <CheckCircle2
          className="mt-0.5 size-5 shrink-0 text-success"
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-sm font-medium">{t("admin.dashboard.allClear")}</p>
          <p className="text-sm text-muted-foreground">
            {t("admin.dashboard.allClearHint")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="dashboard-tasks"
      className="rounded-2xl border border-warning/30 bg-card p-4 sm:p-5"
    >
      <h2
        id="dashboard-tasks"
        className="mb-3 flex items-center gap-2 font-heading text-base font-semibold"
      >
        <span className="size-2 rounded-full bg-warning" aria-hidden />
        {t("admin.dashboard.tasksTitle")}
      </h2>

      <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map(({ key, to, label, icon: Icon }) => (
          <li key={key}>
            <Link
              to={to}
              className="group flex min-h-14 items-center gap-3 rounded-xl bg-warning-soft px-3.5 py-2.5 transition-colors hover:bg-warning/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-warning">
                <Icon className="size-4.5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                {label}
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-warning transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
