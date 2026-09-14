export interface AdminDashboardStats {
  groups: number;
  students: number;
  teachers: number;
  subjects: number;
  rewards: number;
}

export interface CoinEconomyTrendPoint {
  date: string;
  earned: number;
  deducted: number;
}

export interface AdminDashboardCoinEconomy {
  totalInCirculation: number;
  earnedThisMonth: number;
  deductedThisMonth: number;
  weeklyTrend: CoinEconomyTrendPoint[];
}

export interface AdminDashboardNeedsAttention {
  pendingPurchases: number;
  pendingAttendanceSessions: number;
}

export type DashboardActivitySourceType =
  | "attendance"
  | "homework"
  | "competition"
  | "manual"
  | "bonus"
  | "purchase";

export interface AdminDashboardActivity {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: DashboardActivitySourceType;
  note: string | null;
  createdAt: string;
  student: { id: string; fullName: string; avatarUrl: string | null };
  teacher: { id: string; fullName: string } | null;
}

export interface AdminDashboardLeaderboardEntry {
  student: { id: string; fullName: string; avatarUrl: string | null };
  balance: number;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  coinEconomy: AdminDashboardCoinEconomy;
  needsAttention: AdminDashboardNeedsAttention;
  todaySessionsCount: number;
  recentActivity: AdminDashboardActivity[];
  leaderboard: AdminDashboardLeaderboardEntry[];
}
