export const getControlsHeader = (t: (key: string) => string) => [
  { name: t("reasons.title"), link: "/admin/control/reasons" },
  { name: t("rooms.title"), link: "/admin/control/rooms" },
  { name: t("employees.title"), link: "/admin/control/employees" },
  { name: t("roles.title"), link: "/admin/control/roles" },
  // { name: t("controls.sendMessage"), link: "/admin/control/send-message" },
];
