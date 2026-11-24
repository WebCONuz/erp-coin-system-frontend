import { Link } from "react-router-dom";
import {
  BookOpen,
  Gift,
  GraduationCap,
  School,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrentTenant } from "@/features/tenants/hooks";
import type { AdminDashboardStats } from "../types";

interface Props {
  stats?: AdminDashboardStats;
  isLoading?: boolean;
}

interface StatItem {
  key: string;
  label: string;
  value?: number;
  icon: LucideIcon;
  to?: string;
}

/**
 * Ko'rsatkichlar qatori: 5 ta alohida karta o'rniga bitta yaxlit blok.
 * Har katak tegishli bo'limga havola.
 */
export const DashboardStats = ({ stats, isLoading }: Props) => {
  const { t } = useTranslation();
  const { isLearningCenter } = useCurrentTenant();

  const items: StatItem[] = [
    {
      key: "groups",
      label: t("admin.dashboard.stats.groups"),
      value: stats?.groups,
      icon: School,
      to: "/admin/groups",
    },
    {
      key: "students",
      label: t("admin.dashboard.stats.students"),
      value: stats?.students,
      icon: UsersRound,
      to: "/admin/students",
    },
    {
      key: "teachers",
      label: t("admin.dashboard.stats.teachers"),
      value: stats?.teachers,
      icon: GraduationCap,
      to: "/admin/teachers",
    },
    {
      key: "subjects",
      label: t("admin.dashboard.stats.subjects"),
      value: stats?.subjects,
      icon: BookOpen,
      // O'quv markazlarda "Fanlar" bo'limi yo'q (sidebar'da ham yashirin).
      to: isLearningCenter ? undefined : "/admin/subjects",
    },
    {
      key: "rewards",
      label: t("admin.dashboard.stats.rewards"),
      value: stats?.rewards,
      icon: Gift,
      to: "/admin/market",
    },
  ];

  return (
    <section aria-label={t("admin.dashboard.overview")}>
      <ul
        aria-busy={isLoading || undefined}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-5"
      >
        {items.map((item, idx) => (
          <li
            key={item.key}
            className={cn(
              "bg-card",
              // Mobilda 2 ustun: oxirgi (5-) katak butun qatorni egallaydi.
              idx === items.length - 1 && "col-span-2 sm:col-span-1",
            )}
          >
            <StatCell item={item} isLoading={isLoading} />
          </li>
        ))}
      </ul>
    </section>
  );
};

const StatCell = ({
  item: { label, value, icon: Icon, to },
  isLoading,
}: {
  item: StatItem;
  isLoading?: boolean;
}) => {
  const content = (
    <>
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{label}</span>
      </span>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-14" />
      ) : (
        <span className="mt-1 block font-heading text-[28px] font-semibold leading-tight tabular-nums text-foreground">
          {value ?? 0}
        </span>
      )}
    </>
  );

  const base = "block h-full px-4 py-4 sm:px-5";

  if (!to) return <div className={base}>{content}</div>;

  return (
    <Link
      to={to}
      className={cn(
        base,
        "transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
      )}
    >
      {content}
    </Link>
  );
};
