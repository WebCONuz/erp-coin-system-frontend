import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CoinRule,
  CoinRulesResponse,
  CreateCoinRuleDto,
  UpdateCoinRuleDto,
} from "../types";

export const getAllCoinRules = async (
  params?: Record<string, string | undefined>,
): Promise<CoinRulesResponse> => {
  const res = await request.get<CoinRulesResponse>(ENDPOINTS.COIN_RULES, {
    params,
  });
  return res.data;
};

export const getCoinRuleById = async (id: string): Promise<CoinRule> => {
  const res = await request.get<CoinRule>(`${ENDPOINTS.COIN_RULES}/${id}`);
  return res.data;
};

export const createCoinRule = async (
  data: CreateCoinRuleDto,
): Promise<CoinRule> => {
  const res = await request.post<CoinRule>(ENDPOINTS.COIN_RULES, data);
  return res.data;
};

export const updateCoinRule = async (
  id: string,
  data: UpdateCoinRuleDto,
): Promise<CoinRule> => {
  const res = await request.patch<CoinRule>(
    `${ENDPOINTS.COIN_RULES}/${id}`,
    data,
  );
  return res.data;
};

export const deleteCoinRule = async (
  id: string,
): Promise<{ message: string }> => {
  const res = await request.delete<{ message: string }>(
    `${ENDPOINTS.COIN_RULES}/${id}`,
  );
  return res.data;
};
