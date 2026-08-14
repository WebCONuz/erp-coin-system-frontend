import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CreatePurchaseDto,
  CreateRewardDto,
  Purchase,
  PurchasesResponse,
  Reward,
  RewardsResponse,
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

export const purchaseReward = async (
  data: CreatePurchaseDto,
): Promise<Purchase> => {
  const res = await request.post<Purchase>(ENDPOINTS.PURCHASES, data);
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
