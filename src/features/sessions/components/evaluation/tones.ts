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
    panel: "min-w-0 space-y-4 rounded-2xl border bg-card p-4 sm:p-5",
    title: "font-heading text-base font-semibold",
    // `relative` — Checkbox'ning yashirin inputi jadval ichida qolishi uchun.
    table: "relative w-full overflow-x-auto rounded-xl border",
    thead: "bg-muted/60 text-[13px] text-muted-foreground",
    th: "px-4 py-2.5 font-medium",
    row: "border-t",
    text: "",
    muted: "text-muted-foreground",
  },
  teacher: {
    panel: "rounded-2xl border border-border bg-card p-5 space-y-4 min-w-0",
    title: "font-heading text-sm font-semibold text-foreground",
    table: "relative w-full overflow-x-auto rounded-xl border border-border",
    thead: "bg-muted/55",
    th: "px-4 py-2.5 font-medium text-foreground",
    row: "border-t border-border",
    text: "text-foreground",
    muted: "text-muted-foreground",
  },
};
