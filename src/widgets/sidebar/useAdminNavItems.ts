import {
  BookOpen,
  BookText,
  Building2,
  CalendarDays,
  GraduationCap,
  Gift,
  Home,
  School,
  Settings,
  ShoppingBag,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ROLES } from "@/assets/constants";
import { useAuth } from "@/features/auth/hooks/useLogin";
import { useAdminDashboard } from "@/features/dashboard/hooks";
import { useCurrentTenant } from "@/features/tenants/hooks";

export interface AdminNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  badge?: number;
}

/** Admin navigatsiyasi — sidebar va mobil menyu uchun yagona ro'yxat. */
export const useAdminNavItems = (): AdminNavItem[] => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isLearningCenter } = useCurrentTenant();
  const { data: dashboard } = useAdminDashboard();

  // Admin harakatini kutayotgan xaridlar: tasdiqlash + topshirish.
  const purchasesToHandle =
    (dashboard?.needsAttention?.pendingPurchases ?? 0) +
    (dashboard?.needsAttention?.approvedPurchases ?? 0);

  const isMultiTenant =
    user?.role?.name === ROLES.SUPER_ADMIN ||
    user?.role?.name === ROLES.CREATOR;

  return [
    { to: "/admin", label: t("admin.header.main"), icon: Home, end: true },
    { to: "/admin/groups", label: t("admin.header.groups"), icon: School },
    {
      to: "/admin/students",
      label: t("admin.header.students"),
      icon: UsersRound,
    },
    {
      to: "/admin/teachers",
      label: t("admin.header.teachers"),
      icon: GraduationCap,
    },
    { to: "/admin/plans", label: t("admin.header.plans"), icon: CalendarDays },
    ...(isLearningCenter
      ? []
      : [
          {
            to: "/admin/subjects",
            label: t("admin.header.subjects"),
            icon: BookText,
          },
        ]),
    { to: "/admin/market", label: t("admin.header.market"), icon: Gift },
    {
      to: "/admin/purchases",
      label: t("admin.header.purchases"),
      icon: ShoppingBag,
      badge: purchasesToHandle,
    },
    { to: "/admin/sessions", label: t("admin.header.sessions"), icon: BookOpen },
    { to: "/admin/control", label: t("admin.header.control"), icon: Settings },
    ...(isMultiTenant
      ? [
          {
            to: "/admin/tenants",
            label: t("admin.header.tenants"),
            icon: Building2,
          },
        ]
      : []),
  ];
};
