export const rewardKeys = {
  allRewards: (params?: Record<string, any>) => ["all-rewards", params ?? {}],
} as const;

export const rewardCategoryKeys = {
  allRewardCategories: () => ["all-reward-categories"],
} as const;

// `stock: -1` — cheksiz sovg'a, zaxira hisoblanmaydi.
export const UNLIMITED_STOCK = -1;
