export interface MyAttendanceRecord {
  id: string;
  isPresent: boolean;
  homeworkDone: boolean;
  recordedAt: string;
  session: {
    id: string;
    sessionDate: string;
    sessionType: string;
    topic?: string | null;
    group: { id: string; name: string };
    subject?: { id: string; name: string } | null;
  };
}

export interface MyAttendanceResponse {
  data: MyAttendanceRecord[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface MyAttendanceParams {
  groupId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
