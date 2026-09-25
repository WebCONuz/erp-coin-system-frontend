import type { DashboardRewards } from "../types";

export interface StudentLevel {
  index: number;
  daraja: number;
  /** i18n key: `garden.levels.<nameKey>` */
  nameKey: string;
  min: number;
}

// "Bog'" bosqichlari. Chegaralar do'kondagi sovg'alar narxidan hisoblanadi
// (GET /students/me/dashboard → rewards): 1-daraja 0 dan boshlanadi,
// 2-daraja — eng arzon sovg'a, 4-daraja — eng qimmat sovg'a, 3-daraja — o'rtasi.
const LEVEL_NAME_KEYS = ["seed", "sprout", "bush", "tree"] as const;

/** Do'konda faol sovg'a bo'lmasa `null` qaytaradi. */
export function buildStudentLevels(
  rewards?: DashboardRewards | null,
): StudentLevel[] | null {
  if (
    !rewards ||
    rewards.activeCount === 0 ||
    rewards.minPrice === null ||
    rewards.maxPrice === null
  ) {
    return null;
  }

  const { minPrice, maxPrice } = rewards;
  const thresholds = [
    0,
    minPrice,
    Math.round((minPrice + maxPrice) / 2),
    maxPrice,
  ];

  return thresholds.map((min, index) => ({
    index,
    daraja: index + 1,
    nameKey: LEVEL_NAME_KEYS[index],
    min,
  }));
}

export interface LevelProgress {
  levels: StudentLevel[];
  level: StudentLevel;
  nextLevel: StudentLevel | null;
  /** 0-100, progress within the current level's band */
  bandProgress: number;
  /** 0-100, progress across the whole path (for the garden path fill) */
  pathProgress: number;
  coinsToNext: number | null;
}

export function getLevelProgress(
  balance: number,
  levels: StudentLevel[],
): LevelProgress {
  const safeBalance = Math.max(0, balance);
  let levelIdx = 0;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (safeBalance >= levels[i].min) {
      levelIdx = i;
      break;
    }
  }

  const level = levels[levelIdx];
  const nextLevel = levels[levelIdx + 1] ?? null;

  // minPrice === maxPrice bo'lsa chegaralar ustma-ust tushadi — nolga bo'lishdan saqlaymiz.
  const bandProgress = nextLevel
    ? Math.min(
        100,
        ((safeBalance - level.min) / Math.max(1, nextLevel.min - level.min)) *
          100,
      )
    : 100;

  const pathProgress =
    ((levelIdx + bandProgress / 100) / (levels.length - 1)) * 100;

  return {
    levels,
    level,
    nextLevel,
    bandProgress,
    pathProgress: Math.min(100, pathProgress),
    coinsToNext: nextLevel ? Math.max(0, nextLevel.min - safeBalance) : null,
  };
}
