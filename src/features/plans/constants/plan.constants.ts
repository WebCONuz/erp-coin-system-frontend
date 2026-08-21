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
