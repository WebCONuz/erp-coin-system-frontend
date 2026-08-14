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
  coinPrice: number;
  stock: number;
  rewardType: RewardType;
  categoryId?: string;
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
