import type { SessionSync } from "@/features/plans/types";

// ─── GET /api/holidays?from=&to= ─────────────────────────────────────────────
export interface Holiday {
  id: string;
  /** ISO, masalan `2026-12-31T00:00:00.000Z` */
  date: string;
  name: string;
  createdAt: string;
}

export interface HolidaysResponse {
  data: Holiday[];
}

// ─── POST /api/holidays ──────────────────────────────────────────────────────
export interface CreateHolidayDto {
  /** `YYYY-MM-DD` */
  date: string;
  name: string;
}

export interface CreateHolidayResponse extends Holiday {
  /** `removed` — shu sanadan o'chirilgan jadval darslari soni. */
  sessionSync: SessionSync;
  /** Shu sanada qo'lda yaratilgan darslar — avtomatik o'chirilmaydi, admin ko'rib chiqishi kerak. */
  manualSessionsOnDate: number;
}

// ─── DELETE /api/holidays/:id ────────────────────────────────────────────────
export interface DeleteHolidayResponse {
  message: string;
  /** `created` — qaytarilgan darslar soni. */
  sessionSync: SessionSync;
}
