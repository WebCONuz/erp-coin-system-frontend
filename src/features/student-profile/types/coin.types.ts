export interface MyWallet {
  id: string;
  balance: number;
  updatedAt: string;
  userId: string;
}

export interface MyCoinTransaction {
  id: string;
  amount: number;
  direction: "earn" | "deduct";
  sourceType: string;
  note?: string | null;
  createdAt: string;
  teacher?: { id: string; fullName: string } | null;
  group?: { id: string; name: string } | null;
}

export interface MyCoinHistoryResponse {
  data: MyCoinTransaction[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CoinStatsBucket {
  from: string;
  to: string;
  earned: number;
  deducted: number;
}

export interface CoinStatsResponse {
  period: "week" | "month";
  buckets: CoinStatsBucket[];
  totalEarned: number;
  totalDeducted: number;
}

export interface LeaderboardEntry {
  id: string;
  balance: number;
  user: { id: string; fullName: string; avatarUrl: string | null };
}
