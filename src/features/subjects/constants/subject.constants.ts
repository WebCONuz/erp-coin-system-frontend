export const subjectKeys = {
  allSubjects: (params?: Record<string, any>) => [
    "all-subjects",
    params ?? {},
  ],
} as const;
