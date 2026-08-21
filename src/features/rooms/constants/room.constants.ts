export const roomKeys = {
  allRooms: (params?: Record<string, any>) => ["all-rooms", params ?? {}],
} as const;
