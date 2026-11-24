import type { ConfirmAction, StudentDetailFull } from "../types";

type TFn = (key: string, options?: Record<string, unknown>) => string;

export const StudentActions = (
  student: StudentDetailFull | undefined,
  t: TFn,
) => {
  const confirmContent: Record<
    NonNullable<ConfirmAction>,
    {
      title: string;
      description: string;
      label: string;
      variant: "danger" | "warning";
    }
  > = {
    archive: {
      title: t("students.actions.archiveTitle"),
      description: t("students.actions.archiveDescription", {
        name: student?.fullName,
      }),
      label: t("students.actions.archiveLabel"),
      variant: "warning",
    },
    restore: {
      title: t("students.actions.restoreTitle"),
      description: t("students.actions.restoreDescription", {
        name: student?.fullName,
      }),
      label: t("students.actions.restoreLabel"),
      variant: "warning",
    },
    delete: {
      title: t("students.actions.deleteTitle"),
      description: t("students.actions.deleteDescription", {
        name: student?.fullName,
      }),
      label: t("students.actions.deleteLabel"),
      variant: "danger",
    },
  };

  return { confirmContent };
};

export const StudentStatusBadge = (
  isActive: boolean,
  isDeleted: boolean,
  t: TFn,
) => {
  // `variant` — Badge komponentining semantik varianti.
  return isDeleted
    ? { label: t("students.status.deleted"), variant: "danger" as const }
    : isActive
      ? { label: t("common.active"), variant: "success" as const }
      : { label: t("students.status.archived"), variant: "secondary" as const };
};

// "Tarix" (audit log) — faqat super_admin / creator (`canViewAuditLogs`).
export const getStudentTabOptions = (
  t: TFn,
  { withHistory = false }: { withHistory?: boolean } = {},
) => [
  { value: "info", label: t("students.tabs.info") },
  { value: "groups", label: t("students.tabs.groups") },
  { value: "coins", label: t("students.tabs.coins") },
  { value: "gifts", label: t("students.tabs.gifts") },
  { value: "security", label: t("students.tabs.security") },
  ...(withHistory
    ? [{ value: "history", label: t("students.tabs.history") }]
    : []),
];
