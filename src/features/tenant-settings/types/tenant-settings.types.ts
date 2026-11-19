// ─── GET/PATCH /api/tenant-settings ──────────────────────────────────────────
export interface TenantSettings {
  id: string;
  /** Teacher bir martada bitta o'quvchiga bera oladigan maksimal coin. `null` — limit yo'q. */
  teacherCoinLimit: number | null;
  /** IANA nomi, masalan `Asia/Tashkent`. "Bugun", "dars boshlandimi" shu bo'yicha hisoblanadi. */
  timezone: string;
}

export interface TenantSettingsResponse {
  status: string;
  data: TenantSettings;
}

export interface UpdateTenantSettingsDto {
  teacherCoinLimit?: number | null;
  timezone?: string;
}

export interface UpdateTenantSettingsResponse {
  status: string;
  message: string;
  data: TenantSettings;
}
