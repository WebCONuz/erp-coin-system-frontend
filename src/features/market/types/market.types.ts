export type RewardType = "physical" | "digital" | "privilege";

// ─── List item / detail (GET /api/rewards) ──────────────────────────────────
export interface Reward {
  id: string;
  title: string;
  description?: string | null;
  coinPrice: number;
  // Yana nechta sotish mumkin (omborda jismonan turgan son emas); -1 — cheksiz.
  stock: number;
  // Sotilgan, lekin hali topshirilmagan (pending + approved) donalar.
  // Omborda jismonan: stock + reservedCount.
  reservedCount: number;
  rewardType: RewardType;
  imageUrl: string | null;
  isActive?: boolean;
  categoryId: string;
}

export interface RewardsResponse {
  status: string;
  data: Reward[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateRewardDto {
  title: string;
  description?: string;
  imageUrl?: string;
  coinPrice: number;
  // Doim yuboriladi (yuborilmasa backend 0 qo'yadi); -1 — cheksiz.
  stock: number;
  rewardType: RewardType;
  categoryId: string;
}

// `stock` va `stockDelta` birga yuborilmaydi (400). Faqat o'zgargan maydonlar
// yuboriladi — eski `stock` ni qayta yuborish shu orada sotilgan donani o'chiradi.
export interface UpdateRewardDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  coinPrice?: number;
  stock?: number;
  // Nisbiy o'zgarish (+5 / −2), ≠ 0; cheksiz sovg'aga yuborilmaydi.
  stockDelta?: number;
  rewardType?: RewardType;
  categoryId?: string;
}

// ─── Reward categories (GET/POST/PATCH/DELETE /api/reward-category) ─────────
export interface RewardCategory {
  id: string;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  tenantId: string;
  createdById: string;
  createdAt: string;
  deletedAt: string | null;
  _count: {
    rewards: number;
  };
}

export interface CreateRewardCategoryDto {
  name: string;
}

export interface UpdateRewardCategoryDto {
  name: string;
}

// ─── Purchase (student "buy") — xaridlar ro'yxati `features/purchases` da ─────
export interface PurchaseRewardResponse {
  message: string;
  purchaseId: string;
  remainingCoins: number;
}
