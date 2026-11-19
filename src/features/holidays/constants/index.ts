export const holidayKeys = {
  allHolidays: (params?: Record<string, unknown>) => [
    "all-holidays",
    params ?? {},
  ],
} as const;
