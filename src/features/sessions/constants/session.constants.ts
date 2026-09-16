import type { IOption } from "@/components/controls";

export const sessionKeys = {
  allSessions: (params?: Record<string, any>) => ["all-sessions", params ?? {}],
  oneSessionById: (id: string) => ["one-session-by-id", id],
  attendanceBySessionId: (id: string) => ["session-attendance", id],
} as const;

export const getSessionTypeOptions = (t: (key: string) => string): IOption[] => [
  { value: "lesson", label: t("sessions.type.lesson") },
  { value: "exam", label: t("sessions.type.exam") },
  { value: "competition", label: t("sessions.type.competition") },
  { value: "extra", label: t("sessions.type.extra") },
];

export const getSessionTypeLabels = (
  t: (key: string) => string,
): Record<string, string> => ({
  lesson: t("sessions.type.lesson"),
  exam: t("sessions.type.exam"),
  competition: t("sessions.type.competition"),
  extra: t("sessions.type.extra"),
});

export const getIsCheckedOptions = (t: (key: string) => string): IOption[] => [
  { value: "true", label: t("sessions.filter.checked") },
  { value: "false", label: t("sessions.filter.unchecked") },
];

export const ALL_VALUE = "all";
