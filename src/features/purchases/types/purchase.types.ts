// pending → approved → delivered, yoki pending/approved → cancelled (coin qaytadi).
export type PurchaseStatus = "pending" | "approved" | "delivered" | "cancelled";

// Admin o'rnata oladigan statuslar — `pending` ga qaytarib bo'lmaydi.
export type PurchaseActionStatus = Exclude<PurchaseStatus, "pending">;

export interface PurchasePerson {
  id: string;
  fullName: string;
}

export interface Purchase {
  id: string;
  coinSpent: number;
  status: PurchaseStatus;
  // Adminning oxirgi izohi (tasdiqlashda — qayerdan olish, bekor qilishda — sabab).
  deliveryNote: string | null;
  purchasedAt: string;
  deliveredAt: string | null;
  updatedAt: string;
  studentId: string;
  rewardId: string;
  approvedById: string | null;
  deliveredById: string | null;
  student?: { id: string; fullName: string; phone: string };
  reward: {
    id: string;
    title: string;
    coinPrice: number;
    imageUrl: string | null;
  };
  approvedBy: PurchasePerson | null;
  deliveredBy: PurchasePerson | null;
}

export interface PurchasesResponse {
  data: Purchase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdatePurchaseStatusDto {
  status: PurchaseActionStatus;
  adminNote?: string;
}

export interface UpdatePurchaseStatusResponse {
  message: string;
  data: Purchase;
  refund?: { coins: number; currentBalance: number };
}
