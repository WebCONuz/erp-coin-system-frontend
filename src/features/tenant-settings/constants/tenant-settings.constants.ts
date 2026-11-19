export const tenantSettingsKeys = {
  // Sozlamalar tenantga bog'liq — super_admin tenant almashtirganda kesh aralashmasin.
  settings: (tenantId?: string) => ["tenant-settings", tenantId ?? ""],
} as const;

export const DEFAULT_TIMEZONE = "Asia/Tashkent";

/** `teacherCoinLimit` va qo'lda coin `amount` uchun backend chegarasi. */
export const COIN_AMOUNT_MIN = 1;
export const COIN_AMOUNT_MAX = 100000;
