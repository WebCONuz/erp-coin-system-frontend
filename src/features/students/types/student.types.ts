// ─── List item (GET /api/students) ──────────────────────────────────────────
export interface StudentDetail {
  id: string;
  phone: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  parentPhone?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
    displayName: string;
  };
  wallet: {
    id: string;
    balance: number;
    updatedAt: string;
    userId: string;
  };
}

// ─── Full profile (GET /api/students/:id) ───────────────────────────────────
export interface StudentGroup {
  id: string;
  name: string;
  course: string;
  teacher: string;
  joinedAt: string;
}

export interface CoinTransaction {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: "bonus" | "manual" | "attendance" | "homework";
  note: string | null;
  createdAt: string;
}

export interface StudentPurchase {
  id: string;
  coinSpent: number;
  status: "pending" | "approved" | "delivered" | "cancelled" | "rejected";
  adminNote?: string | null;
  purchasedAt: string;
  reward: {
    id: string;
    title: string;
    imageUrl?: string | null;
  };
}

export interface StudentStats {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  homeworkDoneCount: number;
  totalCoinsEarned: number;
  totalCoinsDeducted: number;
  totalPurchases: number;
}

export interface StudentGroupFull {
  id: string;
  joinedAt: string;
  isActive: boolean;
  group: {
    id: string;
    name: string;
    isActive: boolean;
    course: {
      id: string;
      title: string;
    };
    teacher: {
      id: string;
      fullName: string;
      phone: string;
    };
  };
}

export interface CoinRecieved {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: "bonus" | "manual" | "attendance" | "homework";
  note: string | null;
  createdAt: string;
  teacher: {
    id: string;
    fullName: string;
  };
}

export interface AttendanceRecord {
  id: string;
  isPresent: boolean;
  homeworkDone: boolean;
  recordedAt: string;
  session: {
    id: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    sessionType: string;
    topic: string | null;
    group: {
      id: string;
      name: string;
    };
    subject?: {
      id: string;
      name: string;
    } | null;
  };
}

export interface StudentDetailFull extends StudentDetail {
  purchases: StudentPurchase[];
  stats: StudentStats;
  groupMemberships?: StudentGroupFull[];
  attendanceAsStudent?: AttendanceRecord[];
  coinTransactionsReceived?: CoinRecieved[];
}

// ─── List response ────────────────────────────────────────────────────────────
export interface StudentsResponse {
  status: string;
  data: StudentDetail[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface CreateStudentDto {
  phone: string;
  fullName: string;
  password: string;
  roleId: string;
  email?: string;
  parentPhone?: string;
  avatarUrl?: string;
}

export interface UpdateStudentDto {
  phone?: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  parentPhone?: string;
}

export interface DeactivateStudentDto {
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface ChangePasswordDto {
  oldPassword?: string;
  newPassword: string;
}

export interface CoinTransactionManualDto {
  studentId: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: "bonus" | "manual" | "attendance" | "homework";
  note?: string;
  ruleId?: string;
  groupId?: string;
  sessionId?: string;
}

// ─── Bulk coin transactions ───────────────────────────────────────────────────
export type BulkCoinSourceType =
  | "attendance"
  | "homework"
  | "competition"
  | "manual"
  | "bonus"
  | "purchase";

export interface BulkManualCoinDto {
  studentIds: string[];
  amount: number;
  direction: "earn" | "deduct";
  sourceType: BulkCoinSourceType;
  note?: string;
  groupId?: string;
  sessionId?: string;
}

export interface ApplyCoinRuleDto {
  ruleId: string;
  studentIds: string[];
  note?: string;
  sessionId?: string;
}

export interface BulkCoinResult {
  studentId: string;
  success: boolean;
  transactionId?: string;
  newBalance?: number;
  error?: string;
}

export interface BulkCoinResponse {
  totalRequested: number;
  successCount: number;
  failedCount: number;
  results: BulkCoinResult[];
}

export interface ApplyCoinRuleResponse extends BulkCoinResponse {
  rule: {
    id: string;
    name: string;
    coinAmount: number;
    direction: "earn" | "deduct";
  };
}

export interface SendMessageDto {
  recipientPhone?: string;
  recipientEmail?: string;
  message: string;
  channels: ("sms" | "email")[];
}

export interface UpdatePurchaseStatusDto {
  status: "approved" | "rejected";
  adminNote?: string;
}

export type ConfirmAction = "archive" | "delete" | "restore" | null;
