// ─── List item (GET /api/subjects) ───────────────────────────────────────────
export interface Subject {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface SubjectsResponse {
  data: Subject[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateSubjectDto {
  name: string;
  description?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  description?: string;
}
