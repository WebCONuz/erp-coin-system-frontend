interface ControlsHeaderOptions {
  /** Audit log faqat super_admin / creator uchun (`canViewAuditLogs`). */
  canViewAuditLogs?: boolean;
}

export const getControlsHeader = (
  t: (key: string) => string,
  { canViewAuditLogs = false }: ControlsHeaderOptions = {},
) => [
  { name: t("reasons.title"), link: "/admin/control/reasons" },
  { name: t("roles.title"), link: "/admin/control/roles" },
  { name: t("employees.title"), link: "/admin/control/employees" },
  { name: t("rooms.title"), link: "/admin/control/rooms" },
  { name: t("holidays.title"), link: "/admin/control/holidays" },
  { name: t("tenantSettings.title"), link: "/admin/control/settings" },
  ...(canViewAuditLogs
    ? [{ name: t("auditLogs.title"), link: "/admin/control/audit-logs" }]
    : []),
  // { name: t("controls.sendMessage"), link: "/admin/control/send-message" },
];
