/**
 * Admin paneli shadcn tokenlaridan (dark mode bilan), o'qituvchi paneli esa
 * o'zining "paper/ink" palitrasidan foydalanadi — tekshirish jadvallari
 * ikkala joyda ham ishlatilgani uchun ranglar shu yerda ajratilgan.
 */
export type EvaluationTone = "admin" | "teacher";

export const EVALUATION_TONES: Record<
  EvaluationTone,
  {
    panel: string;
    title: string;
    table: string;
    thead: string;
    th: string;
    row: string;
    text: string;
    muted: string;
  }
> = {
  admin: {
    panel: "rounded-2xl bg-background p-6 shadow-sm space-y-4 min-w-0",
    title: "text-lg font-semibold",
    // `relative` — Checkbox'ning yashirin inputi jadval ichida qolishi uchun.
    table:
      "relative w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10",
    thead: "bg-muted/50",
    th: "px-4 py-2.5 font-medium",
    row: "border-t border-gray-200 dark:border-white/10",
    text: "",
    muted: "text-muted-foreground",
  },
  teacher: {
    panel: "rounded-2xl border border-ink/10 bg-white p-5 space-y-4 min-w-0",
    title: "font-display text-sm font-semibold text-ink",
    table: "relative w-full overflow-x-auto rounded-xl border border-ink/10",
    thead: "bg-paper-soft",
    th: "px-4 py-2.5 font-medium text-ink",
    row: "border-t border-ink/8",
    text: "text-ink",
    muted: "text-ink-soft",
  },
};
