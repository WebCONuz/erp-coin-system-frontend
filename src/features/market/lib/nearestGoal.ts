import type { Reward } from "../types";

/**
 * The cheapest reward the student can't yet afford — used to give the
 * "next goal" a concrete, real target instead of a generic message.
 * Falls back to the cheapest affordable reward when everything is already
 * within reach, and to the cheapest reward overall as a last resort.
 */
export function getNearestGoal(
  rewards: Reward[],
  balance: number,
): Reward | null {
  const active = rewards.filter((r) => r.isActive !== false && r.stock > 0);
  if (!active.length) return null;

  const sorted = [...active].sort((a, b) => a.coinPrice - b.coinPrice);
  return sorted.find((r) => r.coinPrice > balance) ?? sorted[0];
}
