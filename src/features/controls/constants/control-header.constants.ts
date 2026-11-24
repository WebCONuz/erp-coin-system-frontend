import {
  CalendarOff,
  DoorOpen,
  History,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

interface ControlsHeaderOptions {
  /** Audit log faqat super_admin / creator uchun (`canViewAuditLogs`). */
  canViewAuditLogs?: boolean;
}

export interface ControlsNavItem {
  name: string;
  link: string;
  icon: LucideIcon;
}

export const getControlsHeader = (
  t: (key: string) => string,
  { canViewAuditLogs = false }: ControlsHeaderOptions = {},
): ControlsNavItem[] => [
  { name: t("reasons.title"), link: "/admin/control/reasons", icon: Scale },
  { name: t("roles.title"), link: "/admin/control/roles", icon: ShieldCheck },
  {
    name: t("employees.title"),
    link: "/admin/control/employees",
    icon: UsersRound,
  },
  { name: t("rooms.title"), link: "/admin/control/rooms", icon: DoorOpen },
  {
    name: t("holidays.title"),
    link: "/admin/control/holidays",
    icon: CalendarOff,
  },
  {
    name: t("tenantSettings.title"),
    link: "/admin/control/settings",
    icon: SlidersHorizontal,
  },
  ...(canViewAuditLogs
    ? [
        {
          name: t("auditLogs.title"),
          link: "/admin/control/audit-logs",
          icon: History,
        },
      ]
    : []),
  // { name: t("controls.sendMessage"), link: "/admin/control/send-message" },
];
