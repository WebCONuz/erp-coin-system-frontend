export const roomKeys = {
  allRooms: (params?: Record<string, unknown>) => ["all-rooms", params ?? {}],
} as const;
