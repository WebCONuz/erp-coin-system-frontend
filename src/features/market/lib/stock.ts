import { UNLIMITED_STOCK } from "../constants";
import type { Reward } from "../types";

export const isUnlimitedStock = (reward: Pick<Reward, "stock">) =>
  reward.stock === UNLIMITED_STOCK;

// Sotib olish mumkinmi: cheksiz yoki kamida bitta dona qolgan.
export const isInStock = (reward: Pick<Reward, "stock">) =>
  isUnlimitedStock(reward) || reward.stock > 0;

// Omborda jismonan turgan son = sotuvda + band (hali topshirilmagan).
// Cheksiz sovg'ada ma'nosiz — null.
export const getWarehouseCount = (
  reward: Pick<Reward, "stock" | "reservedCount">,
) =>
  isUnlimitedStock(reward) ? null : reward.stock + (reward.reservedCount ?? 0);
