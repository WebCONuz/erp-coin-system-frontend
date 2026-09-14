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
  return isDeleted
    ? {
        label: t("students.status.deleted"),
        cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
      }
    : isActive
      ? {
          label: t("common.active"),
          cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        }
      : {
          label: t("students.status.archived"),
          cls: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        };
};

export const getStudentTabOptions = (t: TFn) => [
  { value: "info", label: t("students.tabs.info") },
  { value: "groups", label: t("students.tabs.groups") },
  { value: "coins", label: t("students.tabs.coins") },
  { value: "gifts", label: t("students.tabs.gifts") },
  { value: "security", label: t("students.tabs.security") },
];
