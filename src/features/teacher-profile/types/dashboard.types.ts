export interface TeacherDashboardSession {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  topic?: string | null;
  isLocked: boolean;
  isChecked: boolean;
  group: { id: string; name: string };
  room?: { id: string; name: string };
  subject?: { id: string; name: string } | null;
}

export interface TeacherDashboardPendingSession {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  isChecked: boolean;
  group: { id: string; name: string };
  subject?: { id: string; name: string } | null;
}

export interface TeacherDashboardTransaction {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: string;
  note?: string | null;
  createdAt: string;
  student: { id: string; fullName: string };
}

export interface TeacherDashboardGroup {
  id: string;
  name: string;
  course: { id: string; title: string };
  _count: { students: number };
}

export interface TeacherDashboardResponse {
  teacher: { id: string; fullName: string; avatarUrl: string | null };
  groups: {
    totalActive: number;
    totalStudents: number;
    list: TeacherDashboardGroup[];
  };
  todaySessions: TeacherDashboardSession[];
  upcomingSessions: TeacherDashboardSession[];
  pendingAttendanceSessions: TeacherDashboardPendingSession[];
  recentCoinTransactions: TeacherDashboardTransaction[];
}
