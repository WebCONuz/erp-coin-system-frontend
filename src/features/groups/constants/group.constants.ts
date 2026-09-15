export const groupKeys = {
  allGroups: (params?: Record<string, any>) => ["all-groups", params ?? {}],
  oneGroupById: (id: string) => ["one-group-by-id", id],
  groupStats: (id: string) => ["group-stats", id],
} as const;
