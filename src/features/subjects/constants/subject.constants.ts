export const subjectKeys = {
  allSubjects: (params?: Record<string, unknown>) => [
    "all-subjects",
    params ?? {},
  ],
} as const;
