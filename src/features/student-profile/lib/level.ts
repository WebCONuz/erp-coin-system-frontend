export interface StudentLevel {
  index: number;
  daraja: number;
  name: string;
  min: number;
}

// Coin thresholds for each "garden" stage. Purely a client-side visual
// mapping over the real wallet balance — there is no level field in the API.
export const STUDENT_LEVELS: StudentLevel[] = [
  { index: 0, daraja: 1, name: "Urug' bosqichi", min: 0 },
  { index: 1, daraja: 2, name: "Nihol bosqichi", min: 100 },
  { index: 2, daraja: 3, name: "Buta bosqichi", min: 250 },
  { index: 3, daraja: 4, name: "Daraxt bosqichi", min: 500 },
];

export interface LevelProgress {
  level: StudentLevel;
  nextLevel: StudentLevel | null;
  /** 0-100, progress within the current level's band */
  bandProgress: number;
  /** 0-100, progress across the whole path (for the garden path fill) */
  pathProgress: number;
  coinsToNext: number | null;
}

export function getLevelProgress(balance: number): LevelProgress {
  const safeBalance = Math.max(0, balance);
  let levelIdx = 0;
  for (let i = STUDENT_LEVELS.length - 1; i >= 0; i--) {
    if (safeBalance >= STUDENT_LEVELS[i].min) {
      levelIdx = i;
      break;
    }
  }

  const level = STUDENT_LEVELS[levelIdx];
  const nextLevel = STUDENT_LEVELS[levelIdx + 1] ?? null;

  const bandProgress = nextLevel
    ? Math.min(
        100,
        ((safeBalance - level.min) / (nextLevel.min - level.min)) * 100,
      )
    : 100;

  const pathProgress =
    ((levelIdx + bandProgress / 100) / (STUDENT_LEVELS.length - 1)) * 100;

  return {
    level,
    nextLevel,
    bandProgress,
    pathProgress: Math.min(100, pathProgress),
    coinsToNext: nextLevel ? Math.max(0, nextLevel.min - safeBalance) : null,
  };
}
