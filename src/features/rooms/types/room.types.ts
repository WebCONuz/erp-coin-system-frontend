// ─── List item (GET /api/rooms) ──────────────────────────────────────────────
export interface Room {
  id: string;
  name: string;
  capacity: number;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface RoomsResponse {
  data: Room[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateRoomDto {
  name: string;
  capacity: number;
  description?: string;
}

export interface UpdateRoomDto {
  name?: string;
  capacity?: number;
  description?: string;
}
