import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CreateRewardCategoryDto,
  CreateRewardDto,
  PurchaseRewardResponse,
  PurchasesResponse,
  Reward,
  RewardCategory,
  RewardsResponse,
  UpdateRewardCategoryDto,
  UpdateRewardDto,
} from "../types";

export const getAllRewards = async (
  params?: Record<string, string | undefined>,
): Promise<RewardsResponse> => {
  const res = await request.get<RewardsResponse>(ENDPOINTS.REWARDS, {
    params,
  });
  return res.data;
};

export const createReward = async (data: CreateRewardDto): Promise<Reward> => {
  const res = await request.post<Reward>(ENDPOINTS.REWARDS, data);
  return res.data;
};

export const updateReward = async (
  rewardId: string,
  data: UpdateRewardDto,
): Promise<Reward> => {
  const res = await request.patch<Reward>(
    `${ENDPOINTS.REWARDS}/${rewardId}`,
    data,
  );
  return res.data;
};

export const deleteReward = async (rewardId: string): Promise<void> => {
  await request.delete(`${ENDPOINTS.REWARDS}/${rewardId}`);
};

export const purchaseReward = async (
  rewardId: string,
): Promise<PurchaseRewardResponse> => {
  const res = await request.post<PurchaseRewardResponse>(
    `${ENDPOINTS.REWARDS}/${rewardId}/purchase`,
  );
  return res.data;
};

export const getMyPurchases = async (
  params?: Record<string, string | undefined>,
): Promise<PurchasesResponse> => {
  const res = await request.get<PurchasesResponse>(ENDPOINTS.PURCHASES, {
    params,
  });
  return res.data;
};

// ─── Reward categories ────────────────────────────────────────────────────────
export const getAllRewardCategories = async (): Promise<RewardCategory[]> => {
  const res = await request.get<RewardCategory[]>(
    ENDPOINTS.REWARD_CATEGORIES,
  );
  return res.data;
};

export const createRewardCategory = async (
  data: CreateRewardCategoryDto,
): Promise<RewardCategory> => {
  const res = await request.post<RewardCategory>(
    ENDPOINTS.REWARD_CATEGORIES,
    data,
  );
  return res.data;
};

export const updateRewardCategory = async (
  categoryId: string,
  data: UpdateRewardCategoryDto,
): Promise<RewardCategory> => {
  const res = await request.patch<RewardCategory>(
    `${ENDPOINTS.REWARD_CATEGORIES}/${categoryId}`,
    data,
  );
  return res.data;
};

export const deleteRewardCategory = async (
  categoryId: string,
): Promise<void> => {
  await request.delete(`${ENDPOINTS.REWARD_CATEGORIES}/${categoryId}`);
};
