import { useMemo } from "react";
import { buildStudentLevels, getLevelProgress } from "../lib/level";
import { useDashboard } from "./useDashboard";

// Daraja chegaralari dashboard javobidagi `rewards` dan olinadi (so'rov
// TanStack Query'da keshlanadi, shuning uchun sidebar/profil qayta yuklamaydi).
// `progress: null` — do'konda faol sovg'a yo'q yoki ma'lumot hali kelmagan.
export const useStudentLevel = (balance: number) => {
  const { data, isLoading } = useDashboard();
  const rewards = data?.rewards;

  const progress = useMemo(() => {
    const levels = buildStudentLevels(rewards);
    return levels ? getLevelProgress(balance, levels) : null;
  }, [rewards, balance]);

  return { progress, isLoading };
};
