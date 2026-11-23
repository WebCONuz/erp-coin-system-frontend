// GET /api/audit-logs (faqat super_admin, creator; admin — 403) — kim, qachon,
// qanday amal bajargani. Yo'qlama/natija coinlari — `entityType: Session`,
// `changes.kind: attendance | results`.

export type AuditActionType =
  | "create"
  | "update"
  | "delete"
  | "archive"
  | "restore"
  | "assign"
  | "approve"
  | "reject"
  | "coin_transaction"
  | "sms_sent"
  | "email_sent";

/** Backend yozadigan entitet turlari (`entityType` filtri qiymatlari). */
export type AuditEntityType =
  | "CoinTransaction"
  | "CoinOperation"
  | "CoinRule"
  | "User"
  | "Purchase"
  | "Session"
  | "Tenant"
  | "SmsLog"
  | "EmailLog";

export interface AuditLog {
  id: string;
  actionType: AuditActionType;
  /** Odatda `AuditEntityType`, lekin backend yangi tur qo'shsa ham sinmasin. */
  entityType: string;
  entityId: string;
  /** Asosiy maydonlar (parol/token kabi maxfiy qiymatlar yozilmaydi). */
  changes: Record<string, unknown> | null;
  description: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  tenantId: string;
  createdBy: string;
  createdByUser: {
    id: string;
    fullName: string;
    phone: string;
  } | null;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuditLogsParams {
  actionType?: AuditActionType;
  entityType?: string;
  /** Bitta entitet tarixi (o'quvchi, xarid …). */
  entityId?: string;
  /** Amalni bajargan user. */
  userId?: string;
  /** `YYYY-MM-DD`, tenant kuni boshidan. */
  fromDate?: string;
  /** `YYYY-MM-DD`, tenant kuni oxirigacha (kiradi). */
  toDate?: string;
  page?: string;
  /** 1–100, standart 30. */
  limit?: string;
}
