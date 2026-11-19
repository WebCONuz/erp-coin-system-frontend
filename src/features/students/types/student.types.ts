import type { CoinReversalFields, CoinSourceType } from "@/types";
import type { AttendanceStatus } from "@/features/sessions/types";

// ─── List item (GET /api/students) ──────────────────────────────────────────
export interface StudentDetail {
  id: string;
  username: string;
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

// GET /coin-transactions/history — teskari yozuv maydonlari bilan.
export interface CoinTransaction extends CoinReversalFields {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: CoinSourceType;
  note: string | null;
  createdAt: string;
  student?: { fullName: string; phone: string } | null;
  teacher?: { id?: string; fullName: string } | null;
  rule?: { name: string } | null;
  group?: { id: string; name: string } | null;
}

// GET /coin-transactions/history — sahifalash maydonlari `meta` ichida emas, ildizda.
// Teacher faqat o'zi bergan tranzaksiyalarni ko'radi (teacherId majburan o'zi).
export interface CoinTransactionHistoryResponse {
  data: CoinTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// DELETE /coin-transactions/:id/cancel
export interface CancelCoinTransactionResponse {
  message: string;
  reversalTransactionId: string;
  newBalance: number;
}

export interface StudentPurchase {
  id: string;
  coinSpent: number;
  status: "pending" | "approved" | "delivered" | "cancelled";
  deliveryNote?: string | null;
  deliveredAt?: string | null;
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

// GET /students/:id → coinTransactionsReceived (oxirgi 20 ta, kim berganidan
// qat'i nazar) — `reversalOfId`/`reversal` bilan.
export interface CoinRecieved extends CoinReversalFields {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: CoinSourceType;
  note: string | null;
  createdAt: string;
  teacher: {
    id: string;
    fullName: string;
  };
}

export interface AttendanceRecord {
  id: string;
  /** present / late / excused / absent — `isPresent` bilan sinxron. */
  status?: AttendanceStatus;
  isPresent: boolean;
  homeworkDone: boolean;
  /** Imtihon/musobaqa natijasi (`scored` rejim). */
  score?: number | null;
  note?: string | null;
  recordedAt: string;
  session: {
    id: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    sessionType: string;
    evaluationMode?: "attendance" | "scored";
    maxScore?: number | null;
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
  username: string;
  phone: string;
  fullName: string;
  password: string;
  roleId: string;
  email?: string;
  parentPhone?: string;
  avatarUrl?: string;
}

export interface UpdateStudentDto {
  username?: string;
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
  /** Admin → past darajadagi user: `oldPassword` kerak emas (backend e'tiborsiz qoldiradi). */
  newPassword: string;
}

/**
 * Qo'lda coin faqat `manual`/`bonus` bo'ladi. Davomat/imtihon coinlari sessiya
 * tekshiruvi orqali, xarid — xarid moduli orqali yoziladi (boshqasi → 400).
 */
export type ManualCoinSourceType = "manual" | "bonus";

export interface CoinTransactionManualDto {
  studentId: string;
  /** 1 … 100 000; teacher uchun qo'shimcha `teacherCoinLimit`. */
  amount: number;
  direction: "earn" | "deduct";
  sourceType: ManualCoinSourceType;
  /** Ko'pi bilan 500 belgi. */
  note?: string;
  ruleId?: string;
  groupId?: string;
  sessionId?: string;
}

// ─── Bulk coin transactions ───────────────────────────────────────────────────
export type BulkCoinSourceType = ManualCoinSourceType;

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
  direction: "earn" | "deduct";
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

export type ConfirmAction = "archive" | "delete" | "restore" | null;
