import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getAllGroups } from "@/features/groups/api";
import { coinRuleKeys } from "../constants";
import {
  createCoinRule,
  deleteCoinRule,
  getAllCoinRules,
  getCoinRuleById,
  updateCoinRule,
} from "../api";
import type { CreateCoinRuleDto, UpdateCoinRuleDto } from "../types";

// Coin-rule sahifasidagi qidiruv/filtr URL parametrlaridan mustaqil holda
// guruhlar ro'yxatini oladi (select uchun ishlatiladi).
export const useActiveGroups = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["coin-rule-form-groups"],
    queryFn: () => getAllGroups({ isActive: "true" }),
    enabled,
  });
};

export const useCoinRules = () => {
  const [searchParams] = useSearchParams();
  const params = {
    search: searchParams.get("search") || undefined,
    direction:
      searchParams.get("direction") === "all"
        ? undefined
        : searchParams.get("direction") || undefined,
    triggerType: searchParams.get("triggerType") || undefined,
    page: searchParams.get("page") || undefined,
  };

  return useQuery({
    queryKey: coinRuleKeys.allCoinRules(params),
    queryFn: () => getAllCoinRules(params),
  });
};

// Bulk tanga berish formasi uchun â sahifa URL filtrlaridan mustaqil,
// barcha faol qoidalarni oladi (select uchun ishlatiladi).
export const useActiveCoinRulesList = (enabled: boolean = true) => {
  const params = { isActive: "true", limit: "100" };
  return useQuery({
    queryKey: coinRuleKeys.allCoinRules(params),
    queryFn: () => getAllCoinRules(params),
    enabled,
  });
};

export const useCoinRule = (id: string) => {
  return useQuery({
    queryKey: coinRuleKeys.oneCoinRuleById(id),
    queryFn: () => getCoinRuleById(id),
    enabled: !!id,
  });
};

export const useCreateCoinRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCoinRuleDto) => createCoinRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coinRuleKeys.allCoinRules() });
    },
  });
};

export const useUpdateCoinRule = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCoinRuleDto) => updateCoinRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coinRuleKeys.allCoinRules() });
      queryClient.invalidateQueries({
        queryKey: coinRuleKeys.oneCoinRuleById(id),
      });
    },
  });
};

export const useDeleteCoinRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCoinRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coinRuleKeys.allCoinRules() });
    },
  });
};
