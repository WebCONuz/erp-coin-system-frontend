import type { AuditActionType, AuditEntityType } from "../types";

type TFn = (key: string, options?: Record<string, unknown>) => string;

export const auditLogKeys = {
  allAuditLogs: (params?: Record<string, unknown>) => [
    "all-audit-logs",
    params ?? {},
  ],
} as const;

export const ALL_VALUE = "all";
export const AUDIT_LOGS_PAGE_SIZE = 20;

export const AUDIT_ACTION_TYPES: AuditActionType[] = [
  "create",
  "update",
  "delete",
  "archive",
  "restore",
  "assign",
  "approve",
  "reject",
  "coin_transaction",
  "sms_sent",
  "email_sent",
];

export const AUDIT_ENTITY_TYPES: AuditEntityType[] = [
  "CoinTransaction",
  "CoinOperation",
  "CoinRule",
  "User",
  "Purchase",
  "Session",
  "Tenant",
  "SmsLog",
  "EmailLog",
];

export const getAuditActionLabel = (t: TFn, action: string) =>
  t(`auditLogs.action.${action}`, { defaultValue: action });

export const getAuditEntityLabel = (t: TFn, entity: string) =>
  t(`auditLogs.entity.${entity}`, { defaultValue: entity });

export const getAuditActionOptions = (t: TFn) =>
  AUDIT_ACTION_TYPES.map((value) => ({
    value,
    label: getAuditActionLabel(t, value),
  }));

export const getAuditEntityOptions = (t: TFn) =>
  AUDIT_ENTITY_TYPES.map((value) => ({
    value,
    label: getAuditEntityLabel(t, value),
  }));

const NEUTRAL_BADGE = "bg-muted text-muted-foreground";

// Amal turi -> semantik token (yaratish/tasdiq: success, o'zgartirish: info,
// o'chirish/rad: destructive, arxiv: warning, tanga: coin).
export const AUDIT_ACTION_BADGE_CLASS: Record<AuditActionType, string> = {
  create: "bg-success-soft text-success",
  update: "bg-info-soft text-info",
  delete: "bg-destructive-soft text-destructive",
  archive: "bg-warning-soft text-warning",
  restore: "bg-success-soft text-success",
  assign: "bg-primary-soft text-primary",
  approve: "bg-success-soft text-success",
  reject: "bg-destructive-soft text-destructive",
  coin_transaction: "bg-coin-soft text-coin-ink",
  sms_sent: NEUTRAL_BADGE,
  email_sent: NEUTRAL_BADGE,
};

export const getAuditActionBadgeClass = (action: string) =>
  AUDIT_ACTION_BADGE_CLASS[action as AuditActionType] ?? NEUTRAL_BADGE;
