// ─── List item (GET /api/rooms) ──────────────────────────────────────────────
export interface Room {
  id: string;
  name: string;
  capacity: number;
  description?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tenantId: string;
}

// Rooms list response is flat (data + pagination fields), unlike other
// endpoints which nest pagination under `meta`.
export interface RoomsResponse {
  data: Room[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
