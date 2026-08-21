export type RewardType = "physical" | "digital" | "privilege";

// ─── List item / detail (GET /api/rewards) ──────────────────────────────────
export interface Reward {
  id: string;
  title: string;
  description?: string | null;
  coinPrice: number;
  stock: number;
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
  stock: number;
  rewardType: RewardType;
  categoryId: string;
}

export interface UpdateRewardDto {
  title?: string;
  description?: string;
  imageUrl?: string;
  coinPrice?: number;
  stock?: number;
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

// ─── Purchases (student "buy") ───────────────────────────────────────────────
export type PurchaseStatus =
  | "pending"
  | "approved"
  | "delivered"
  | "cancelled"
  | "rejected";

export interface Purchase {
  id: string;
  reward: Pick<Reward, "id" | "title" | "coinPrice" | "imageUrl">;
  status: PurchaseStatus;
  adminNote?: string | null;
  createdAt: string;
}

export interface PurchasesResponse {
  data: Purchase[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreatePurchaseDto {
  rewardId: string;
}
