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
  itemName: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  adminNote: string | null;
  purchasedAt: string;
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
  amount: 5;
  direction: "earn" | "deduct";
  sourceType: "bonus" | "manual" | "attendance" | "homework";
  note: string;
  createdAt: string;
  teacher: {
    id: string;
    fullName: string;
  };
}

export interface StudentDetailFull extends StudentDetail {
  coinTransactions: CoinTransaction[];
  purchases: StudentPurchase[];
  stats: StudentStats;
  groupMemberships?: StudentGroupFull[];
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
