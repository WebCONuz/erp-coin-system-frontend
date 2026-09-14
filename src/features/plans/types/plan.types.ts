export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

// ─── Schedule templates (GET/POST /api/schedule-templates) ──────────────────
export interface ScheduleTemplate {
  id: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tenantId: string;
  groupId: string;
  roomId: string;
  teacherId: string | null;
  subjectId: string | null;
  createdById: string;
  group: {
    id: string;
    name: string;
    teacher: { id: string; fullName: string };
  };
  room: { id: string; name: string };
  teacher: { id: string; fullName: string } | null;
  subject: { id: string; name: string } | null;
  _count?: { exceptions: number };
}

export interface ScheduleTemplatesResponse {
  data: ScheduleTemplate[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateScheduleTemplateDto {
  weekday: Weekday;
  startTime: string;
  endTime: string;
  groupId: string;
  roomId: string;
  teacherId?: string;
  subjectId?: string;
}

export interface UpdateScheduleTemplateDto {
  weekday?: Weekday;
  startTime?: string;
  endTime?: string;
  roomId?: string;
  teacherId?: string | null;
  subjectId?: string | null;
}

// ─── Calendar (GET /api/schedule-templates/calendar) ─────────────────────────
export interface ScheduleException {
  id: string;
  exceptionDate: string;
  isCancelled: boolean;
  startTime?: string | null;
  endTime?: string | null;
  note?: string | null;
}

export interface CalendarSession {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  sessionType: "lesson" | "exam" | "competition" | "extra";
  topic?: string | null;
  subject?: { id: string; name: string } | null;
}

export interface CalendarDayEntry {
  template: {
    id: string;
    weekday: Weekday;
    startTime: string;
    endTime: string;
    room: { id: string; name: string };
    subject?: { id: string; name: string } | null;
    teacher?: { id: string; fullName: string } | null;
  };
  exception: ScheduleException | null;
  session: CalendarSession;
}

export type CalendarResponse = Record<string, CalendarDayEntry[]>;

// ─── Generate sessions (POST /api/schedule-templates/generate-sessions) ─────
export interface GenerateSessionsDto {
  groupId: string;
  fromDate: string;
  toDate: string;
}

export interface GenerateSessionsResponse {
  created: number;
  skipped: number;
  cancelled: number;
}

// ─── Exceptions (POST/PATCH/DELETE) ──────────────────────────────────────────
export interface CreateExceptionDto {
  exceptionDate: string;
  isCancelled: boolean;
  note?: string;
  startTime?: string;
  endTime?: string;
}

export interface UpdateExceptionDto {
  isCancelled?: boolean;
  note?: string;
  startTime?: string;
  endTime?: string;
}
