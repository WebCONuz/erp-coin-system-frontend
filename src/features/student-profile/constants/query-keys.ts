import type { MyAttendanceParams } from "../types";

export const studentSelfKeys = {
  dashboard: () => ["my-dashboard"],
  myGroups: () => ["my-groups"],
  myCalendar: (params?: Record<string, unknown>) => ["my-calendar", params ?? {}],
  myAttendance: (params?: MyAttendanceParams) => ["my-attendance", params ?? {}],
  myWallet: () => ["my-wallet"],
  myCoinHistory: (params?: Record<string, unknown>) => ["my-coin-history", params ?? {}],
  myCoinStats: (params?: Record<string, unknown>) => ["my-coin-stats", params ?? {}],
  leaderboard: (limit?: number) => ["leaderboard", limit ?? 10],
} as const;
