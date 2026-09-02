import { request } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  CoinStatsResponse,
  LeaderboardEntry,
  MyCoinHistoryResponse,
  MyWallet,
} from "../types";

export const getMyWallet = async (): Promise<MyWallet> => {
  const res = await request.get<MyWallet>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/my-wallet`,
  );
  return res.data;
};

export const getMyCoinHistory = async (
  params?: Record<string, string | undefined>,
): Promise<MyCoinHistoryResponse> => {
  const res = await request.get<MyCoinHistoryResponse>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/my-history`,
    { params },
  );
  return res.data;
};

export const getMyCoinStats = async (params?: {
  period?: "week" | "month";
  count?: number;
}): Promise<CoinStatsResponse> => {
  const res = await request.get<CoinStatsResponse>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/my-stats`,
    { params },
  );
  return res.data;
};

export const getLeaderboard = async (
  limit = 10,
): Promise<LeaderboardEntry[]> => {
  const res = await request.get<LeaderboardEntry[]>(
    `${ENDPOINTS.COIN_TRANSACTIONS}/leaderboard`,
    { params: { limit } },
  );
  return res.data;
};
