export type SessionType = "lesson" | "exam" | "trial";

export interface SessionGroupRef {
  id?: string;
  name: string;
}

export interface SessionRoomRef {
  id?: string;
  name: string;
}

export interface SessionTeacherRef {
  id?: string;
  fullName: string;
}

export interface SessionItem {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: SessionType;
  topic?: string | null;
  isLocked: boolean;
  lockedAt?: string | null;
  group: SessionGroupRef;
  room: SessionRoomRef;
  teacher: SessionTeacherRef;
  groupId?: string;
  roomId?: string;
  teacherId?: string;
}

export interface SessionsResponse {
  data: SessionItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateSessionDto {
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionType: SessionType;
  groupId: string;
  roomId: string;
  teacherId: string;
  topic?: string;
}

export interface UpdateSessionDto {
  topic?: string;
  startTime?: string;
  endTime?: string;
  roomId?: string;
  teacherId?: string;
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export interface AttendanceRecordInput {
  studentId: string;
  isPresent: boolean;
  homeworkDone: boolean;
}

export interface SaveAttendanceDto {
  records: AttendanceRecordInput[];
}

export interface SaveAttendanceResponse {
  success: boolean;
  message: string;
  processedRecordsCount: number;
}

export interface AttendanceRecord {
  id: string;
  isPresent: boolean;
  homeworkDone: boolean;
  student: {
    id: string;
    fullName: string;
    phone: string;
  };
}

// ─── Lock / unlock ────────────────────────────────────────────────────────────
export interface LockSessionResponse {
  id: string;
  isLocked: boolean;
  lockedAt: string;
}

export interface UnlockSessionResponse {
  id: string;
  isLocked: boolean;
}
