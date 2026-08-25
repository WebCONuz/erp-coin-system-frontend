import type { Weekday } from "../types";

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Dushanba",
  tuesday: "Seshanba",
  wednesday: "Chorshanba",
  thursday: "Payshanba",
  friday: "Juma",
  saturday: "Shanba",
  sunday: "Yakshanba",
};

// Har bir shablonga barqaror, alohida rang berish uchun (qizil/sariq/yashil
// istisno/qulflangan holatlariga band qilingani uchun ular bu ro'yxatda yo'q).
export const TEMPLATE_CHIP_COLORS = [
  "text-blue-700 bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400",
  "text-purple-700 bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400",
  "text-pink-700 bg-pink-100 dark:bg-pink-950/50 dark:text-pink-400",
  "text-cyan-700 bg-cyan-100 dark:bg-cyan-950/50 dark:text-cyan-400",
  "text-indigo-700 bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400",
  "text-fuchsia-700 bg-fuchsia-100 dark:bg-fuchsia-950/50 dark:text-fuchsia-400",
  "text-sky-700 bg-sky-100 dark:bg-sky-950/50 dark:text-sky-400",
  "text-teal-700 bg-teal-100 dark:bg-teal-950/50 dark:text-teal-400",
  "text-violet-700 bg-violet-100 dark:bg-violet-950/50 dark:text-violet-400",
  "text-lime-700 bg-lime-100 dark:bg-lime-950/50 dark:text-lime-400",
] as const;

// Select qiymati sifatida ishlatiladi: shablonga alohida o'qituvchi
// biriktirilmagan, guruhning o'z o'qituvchisi dars beradi.
export const GROUP_TEACHER_VALUE = "group-teacher";

export const scheduleTemplateKeys = {
  allTemplates: (params?: Record<string, any>) => [
    "all-schedule-templates",
    params ?? {},
  ],
  calendar: (params?: Record<string, any>) => [
    "schedule-calendar",
    params ?? {},
  ],
} as const;
