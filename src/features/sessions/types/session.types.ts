/**
 * Backend yangi tur qo'shishi mumkin (GET /sessions/types) — shuning uchun
 * ma'lum turlar bilan birga ixtiyoriy string ham qabul qilinadi.
 */
export type SessionType =
  | "lesson"
  | "exam"
  | "competition"
  | "extra"
  | (string & {});

/** Tekshirish ekrani `sessionType` emas, shu rejim bo'yicha tanlanadi. */
export type EvaluationMode = "attendance" | "scored";

export interface SessionTypeConfig {
  type: SessionType;
  defaultMode: EvaluationMode;
  allowedModes: EvaluationMode[];
  scoredSourceType: string;
}

export interface SessionGroupRef {
  id?: string;
  name: string;
}

export interface SessionRoomRef {
  id?: string;
  name: string;
}

export interface SessionTeacherRef {
  id?: string;
  fullName: string;
}

export interface SessionSubjectRef {
  id: string;
  name: string;
}

export interface SessionItem {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: SessionType;
  evaluationMode: EvaluationMode;
  /** Faqat `scored` rejimda; `null` — ball yuqoridan cheklanmagan. */
  maxScore?: number | null;
  topic?: string | null;
  isLocked: boolean;
  lockedAt?: string | null;
  /** Shu sessionda yo'qlama kiritilganmi (isLocked'dan farqli — tahrirlanish mumkinligiga aloqasi yo'q). */
  isChecked: boolean;
  group: SessionGroupRef;
  room: SessionRoomRef;
  teacher: SessionTeacherRef;
  subject?: SessionSubjectRef | null;
}

export interface SessionsResponse {
  data: SessionItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateSessionDto {
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: SessionType;
  evaluationMode?: EvaluationMode;
  maxScore?: number;
  groupId: string;
  roomId: string;
  teacherId: string;
  topic?: string;
  subjectId?: string;
}

export interface UpdateSessionDto {
  topic?: string;
  startTime?: string;
  endTime?: string;
  roomId?: string;
  teacherId?: string;
  subjectId?: string | null;
  evaluationMode?: EvaluationMode;
  /** `null` — chegara olib tashlanadi. */
  maxScore?: number | null;
}

export interface DeleteSessionParams {
  id: string;
  /** `true` — sessiya coinlari qaytarilmaydi, faqat sessiya o'chiriladi. */
  keepCoins?: boolean;
}

export interface DeleteSessionResponse {
  message: string;
  reversedTransactions?: number;
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export interface AttendanceRecordInput {
  studentId: string;
  isPresent: boolean;
  homeworkDone: boolean;
}

export interface SaveAttendanceDto {
  records: AttendanceRecordInput[];
}

export type CoinSkippedCode =
  | "COINS_ALREADY_SPENT"
  | "INSUFFICIENT_BALANCE_FOR_PENALTY"
  | (string & {});

export interface CoinSkippedInfo {
  studentId: string;
  code?: CoinSkippedCode;
  /** O'zbekcha tayyor matn — `code` tarjimasi topilmasa zaxira sifatida. */
  reason: string;
  sourceType?: string;
  direction?: "earn" | "deduct";
  amount?: number;
}

export interface SaveAttendanceResponse {
  success: boolean;
  message: string;
  processedRecordsCount: number;
  coinsSkippedFor: CoinSkippedInfo[];
}

// ─── Results (scored) ─────────────────────────────────────────────────────────
export interface ResultRecordInput {
  studentId: string;
  isPresent: boolean;
  score?: number | null;
  coinAmount: number;
  note?: string;
}

export interface SaveResultsDto {
  records: ResultRecordInput[];
}

export type SaveResultsResponse = SaveAttendanceResponse;

export interface AttendanceRecord {
  id: string;
  isPresent: boolean;
  homeworkDone: boolean;
  /** Faqat `scored` rejimda; `attendance` da doim `null`. */
  score?: number | null;
  note?: string | null;
  /** Shu sessiya tekshiruvi orqali berilgan sof coin (berilgan − jarima). */
  coinAwarded?: number;
  student: {
    id: string;
    fullName: string;
    phone: string;
  };
}

// ─── Lock / unlock ────────────────────────────────────────────────────────────
export interface LockSessionResponse {
  id: string;
  isLocked: boolean;
  lockedAt: string;
}

export interface UnlockSessionResponse {
  id: string;
  isLocked: boolean;
}
