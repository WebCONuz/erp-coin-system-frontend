import type { IOption } from "@/components/controls";

export const sessionKeys = {
  allSessions: (params?: Record<string, any>) => ["all-sessions", params ?? {}],
  oneSessionById: (id: string) => ["one-session-by-id", id],
  attendanceBySessionId: (id: string) => ["session-attendance", id],
} as const;

export const sessionTypeOptions: IOption[] = [
  { value: "lesson", label: "Dars" },
  { value: "exam", label: "Imtihon" },
  { value: "competition", label: "Musobaqa" },
  { value: "extra", label: "Qo'shimcha" },
];

export const sessionTypeLabels: Record<string, string> = {
  lesson: "Dars",
  exam: "Imtihon",
  competition: "Musobaqa",
  extra: "Qo'shimcha",
};

export const ALL_VALUE = "all";
