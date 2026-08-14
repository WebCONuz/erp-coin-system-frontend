import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseKeys, rewardKeys } from "../constants";
import { createReward, getAllRewards, getMyPurchases, purchaseReward } from "../api";
import type { CreatePurchaseDto, CreateRewardDto } from "../types";

// REWARDS
export const useRewards = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: rewardKeys.allRewards(params),
    queryFn: () => getAllRewards(params),
  });
};

export const useCreateReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRewardDto) => createReward(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.allRewards() });
    },
  });
};

// PURCHASES
export const useMyPurchases = (params?: Record<string, string | undefined>) => {
  return useQuery({
    queryKey: purchaseKeys.allPurchases(params),
    queryFn: () => getMyPurchases(params),
  });
};

export const usePurchaseReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchaseDto) => purchaseReward(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.allRewards() });
      queryClient.invalidateQueries({ queryKey: purchaseKeys.allPurchases() });
    },
  });
};
