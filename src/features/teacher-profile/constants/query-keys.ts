export const teacherSelfKeys = {
  dashboard: () => ["my-teacher-dashboard"],
  myGroups: () => ["my-taught-groups"],
  myCalendar: (params?: Record<string, unknown>) => [
    "my-teacher-calendar",
    params ?? {},
  ],
  profile: () => ["my-teacher-profile"],
} as const;
