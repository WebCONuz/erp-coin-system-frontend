export const rewardKeys = {
  allRewards: (params?: Record<string, any>) => ["all-rewards", params ?? {}],
} as const;

export const purchaseKeys = {
  allPurchases: (params?: Record<string, any>) => [
    "all-purchases",
    params ?? {},
  ],
} as const;
