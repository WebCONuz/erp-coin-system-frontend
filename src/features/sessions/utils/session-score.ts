/** 92.5, 100 → "92.5 / 100"; ball yo'q bo'lsa "—". */
export const formatSessionScore = (
  score?: number | null,
  maxScore?: number | null,
) => {
  if (score === null || score === undefined) return "—";
  return maxScore ? `${score} / ${maxScore}` : String(score);
};
