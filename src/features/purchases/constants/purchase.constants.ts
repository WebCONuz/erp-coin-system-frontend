import type { PurchaseActionStatus, PurchaseStatus } from "../types";

export const purchaseKeys = {
  allPurchases: (params?: Record<string, unknown>) => [
    "all-purchases",
    params ?? {},
  ],
} as const;

export const PURCHASE_STATUSES: PurchaseStatus[] = [
  "pending",
  "approved",
  "delivered",
  "cancelled",
];

// Backend ruxsat bergan o'tishlar — boshqasi 400 qaytaradi.
export const PURCHASE_NEXT_STATUSES: Record<
  PurchaseStatus,
  PurchaseActionStatus[]
> = {
  pending: ["approved", "cancelled"],
  approved: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export const getPurchaseStatusLabels = (
  t: (key: string) => string,
): Record<PurchaseStatus, string> => ({
  pending: t("purchases.status.pending"),
  approved: t("purchases.status.approved"),
  delivered: t("purchases.status.delivered"),
  cancelled: t("purchases.status.cancelled"),
});

// Student panelida statuslar do'stonaroq matn bilan ko'rsatiladi.
export const getStudentPurchaseStatusLabels = (
  t: (key: string) => string,
): Record<PurchaseStatus, string> => ({
  pending: t("purchases.studentStatus.pending"),
  approved: t("purchases.studentStatus.approved"),
  delivered: t("purchases.studentStatus.delivered"),
  cancelled: t("purchases.studentStatus.cancelled"),
});

export const PURCHASE_STATUS_BADGE_CLASS: Record<PurchaseStatus, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  approved: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
};

// Student ("bog'") palitrasi.
export const STUDENT_PURCHASE_STATUS_BADGE_CLASS: Record<
  PurchaseStatus,
  string
> = {
  pending: "bg-gold/15 text-gold",
  approved: "bg-forest text-paper",
  delivered: "bg-forest/10 text-forest",
  cancelled: "bg-bloom/10 text-bloom",
};

export const STUDENT_PURCHASE_STATUS_DOT_CLASS: Record<PurchaseStatus, string> =
  {
    pending: "bg-gold",
    approved: "bg-forest",
    delivered: "bg-forest/40",
    cancelled: "bg-bloom",
  };
