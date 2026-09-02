import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { purchaseKeys, rewardCategoryKeys, rewardKeys } from "../constants";
import {
  createReward,
  createRewardCategory,
  deleteReward,
  deleteRewardCategory,
  getAllRewardCategories,
  getAllRewards,
  getMyPurchases,
  purchaseReward,
  updateReward,
  updateRewardCategory,
} from "../api";
import type {
  CreateRewardCategoryDto,
  CreateRewardDto,
  UpdateRewardCategoryDto,
  UpdateRewardDto,
} from "../types";
import { useSearchParams } from "react-router-dom";

// REWARDS
export const useRewards = () => {
  const [searchParams] = useSearchParams();
  const params = {
    search: searchParams.get("search") || undefined,
    categoryId:
      searchParams.get("category") == "all"
        ? undefined
        : searchParams.get("category") || undefined,
    isActive:
      searchParams.get("status") === "archive"
        ? "false"
        : searchParams.get("status") === "active"
          ? "true"
          : undefined,
  };

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
      queryClient.invalidateQueries({
        queryKey: rewardCategoryKeys.allRewardCategories(),
      });
    },
  });
};

export const useUpdateReward = (rewardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRewardDto) => updateReward(rewardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.allRewards() });
      queryClient.invalidateQueries({
        queryKey: rewardCategoryKeys.allRewardCategories(),
      });
    },
  });
};

export const useDeleteReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: string) => deleteReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.allRewards() });
      queryClient.invalidateQueries({
        queryKey: rewardCategoryKeys.allRewardCategories(),
      });
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
    mutationFn: (rewardId: string) => purchaseReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rewardKeys.allRewards() });
      queryClient.invalidateQueries({ queryKey: purchaseKeys.allPurchases() });
    },
  });
};

// REWARD CATEGORIES
export const useRewardCategories = () => {
  return useQuery({
    queryKey: rewardCategoryKeys.allRewardCategories(),
    queryFn: () => getAllRewardCategories(),
  });
};

export const useCreateRewardCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRewardCategoryDto) => createRewardCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rewardCategoryKeys.allRewardCategories(),
      });
    },
  });
};

export const useUpdateRewardCategory = (categoryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRewardCategoryDto) =>
      updateRewardCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rewardCategoryKeys.allRewardCategories(),
      });
    },
  });
};

export const useDeleteRewardCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteRewardCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: rewardCategoryKeys.allRewardCategories(),
      });
    },
  });
};
