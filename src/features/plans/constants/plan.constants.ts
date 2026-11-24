import type { Weekday } from "../types";

export const getWeekdayLabels = (
  t: (key: string) => string,
): Record<Weekday, string> => ({
  monday: t("plans.weekday.monday"),
  tuesday: t("plans.weekday.tuesday"),
  wednesday: t("plans.weekday.wednesday"),
  thursday: t("plans.weekday.thursday"),
  friday: t("plans.weekday.friday"),
  saturday: t("plans.weekday.saturday"),
  sunday: t("plans.weekday.sunday"),
});

// Select qiymati sifatida ishlatiladi: shablonga alohida o'qituvchi
// biriktirilmagan, guruhning o'z o'qituvchisi dars beradi.
export const GROUP_TEACHER_VALUE = "group-teacher";

export const scheduleTemplateKeys = {
  allTemplates: (params?: Record<string, unknown>) => [
    "all-schedule-templates",
    params ?? {},
  ],
  calendar: (params?: Record<string, unknown>) => [
    "schedule-calendar",
    params ?? {},
  ],
} as const;

/** `generate-sessions` — bir so'rovdagi eng katta oraliq (kun). */
export const GENERATE_SESSIONS_MAX_DAYS = 92;
