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

const NEUTRAL_BADGE =
  "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

export const AUDIT_ACTION_BADGE_CLASS: Record<AuditActionType, string> = {
  create:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  update: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  delete: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  archive:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  restore: "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400",
  assign:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400",
  approve:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  reject: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  coin_transaction:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-400",
  sms_sent:
    "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
  email_sent:
    "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
};

export const getAuditActionBadgeClass = (action: string) =>
  AUDIT_ACTION_BADGE_CLASS[action as AuditActionType] ?? NEUTRAL_BADGE;
