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

// Holat → semantik token (warning: admin harakati kerak; info: topshirish
// kutilmoqda; success: yakunlangan; muted: bekor qilingan — yakuniy, xato emas).
export const PURCHASE_STATUS_BADGE_CLASS: Record<PurchaseStatus, string> = {
  pending: "bg-warning-soft text-warning",
  approved: "bg-info-soft text-info",
  delivered: "bg-success-soft text-success",
  cancelled: "bg-muted text-muted-foreground",
};

export const PURCHASE_STATUS_DOT_CLASS: Record<PurchaseStatus, string> = {
  pending: "bg-warning",
  approved: "bg-info",
  delivered: "bg-success",
  cancelled: "bg-muted-foreground/60",
};

// Student ("bog'") palitrasi.
export const STUDENT_PURCHASE_STATUS_BADGE_CLASS: Record<
  PurchaseStatus,
  string
> = {
  pending: "bg-coin/15 text-coin",
  approved: "bg-primary text-primary-foreground",
  delivered: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/10 text-destructive",
};

export const STUDENT_PURCHASE_STATUS_DOT_CLASS: Record<PurchaseStatus, string> =
  {
    pending: "bg-coin",
    approved: "bg-primary",
    delivered: "bg-primary/40",
    cancelled: "bg-destructive",
  };
