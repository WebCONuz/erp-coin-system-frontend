import { useQuery } from "@tanstack/react-query";
import {
  getLeaderboard,
  getMyCoinHistory,
  getMyCoinStats,
  getMyWallet,
} from "../api";
import { studentSelfKeys } from "../constants";

export const useMyWallet = () => {
  return useQuery({
    queryKey: studentSelfKeys.myWallet(),
    queryFn: getMyWallet,
  });
};

export const useMyCoinHistory = (
  params?: Record<string, string | undefined>,
) => {
  return useQuery({
    queryKey: studentSelfKeys.myCoinHistory(params),
    queryFn: () => getMyCoinHistory(params),
  });
};

export const useMyCoinStats = (params?: {
  period?: "week" | "month";
  count?: number;
}) => {
  return useQuery({
    queryKey: studentSelfKeys.myCoinStats(params),
    queryFn: () => getMyCoinStats(params),
  });
};

export const useLeaderboard = (limit = 10) => {
  return useQuery({
    queryKey: studentSelfKeys.leaderboard(limit),
    queryFn: () => getLeaderboard(limit),
  });
};
