export const groupKeys = {
  allGroups: (params?: Record<string, any>) => ["all-groups", params ?? {}],
  oneGroupById: (id: string) => ["one-group-by-id", id],
  groupStats: (id: string) => ["group-stats", id],
} as const;

/** `POST /groups/:id/students/bulk` — bir so'rovda 1–300 ta, takrorsiz. */
export const BULK_ADD_STUDENTS_MAX = 300;
