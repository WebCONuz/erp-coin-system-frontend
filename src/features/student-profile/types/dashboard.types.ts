export interface DashboardSession {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  topic?: string | null;
  group: { id: string; name: string };
  room?: { id: string; name: string };
  subject?: { id: string; name: string } | null;
}

export interface DashboardTransaction {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: string;
  note?: string | null;
  createdAt: string;
}

export interface DashboardPendingPurchase {
  id: string;
  coinSpent: number;
  status: string;
  purchasedAt: string;
  reward: { id: string; title: string; imageUrl: string | null };
}

export interface DashboardResponse {
  student: { id: string; fullName: string; avatarUrl: string | null };
  wallet: { balance: number; weekDelta: number; monthDelta: number };
  attendance: {
    last30Days: {
      totalSessions: number;
      presentCount: number;
      absentCount: number;
      attendanceRate: number;
      homeworkDoneCount: number;
      homeworkRate: number;
    };
  };
  todaySessions: DashboardSession[];
  upcomingSessions: DashboardSession[];
  recentTransactions: DashboardTransaction[];
  purchases: {
    pendingCount: number;
    recent: DashboardPendingPurchase[];
  };
}
