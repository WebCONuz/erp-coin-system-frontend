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

// ─── Session sync (shablon/istisno/dam olish kuni o'zgarganda) ──────────────
export type SyncConflictKind = "group" | "room" | "teacher";

/** Yangi jadvalga ko'chirib bo'lmagan (to'qnashgan) dars. */
export interface SessionSyncConflict {
  date: string;
  startTime: string;
  endTime: string;
  kind: SyncConflictKind;
  groupName?: string;
}

/**
 * Kelajakdagi generatsiya qilingan sessiyalar avtomatik moslashtirilgani
 * haqida hisobot. Tekshirilgan/qulflangan va qo'lda yaratilgan sessiyalarga tegilmaydi.
 */
export interface SessionSync {
  updated: number;
  removed: number;
  created: number;
  conflicts: SessionSyncConflict[];
}

export type WithSessionSync<T> = T & { sessionSync?: SessionSync };

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
  /** Shablon shu sanadan amal qiladi (ISO). `null` — cheklov yo'q. */
  validFrom: string | null;
  /** Shablon shu sanagacha (shu kun ham) amal qiladi (ISO). `null` — cheklov yo'q. */
  validTo: string | null;
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
  /** `YYYY-MM-DD` */
  validFrom?: string;
  /** `YYYY-MM-DD` */
  validTo?: string;
}

export interface UpdateScheduleTemplateDto {
  weekday?: Weekday;
  startTime?: string;
  endTime?: string;
  roomId?: string;
  teacherId?: string | null;
  subjectId?: string | null;
  /** `YYYY-MM-DD`; `null` — cheklov olib tashlanadi. */
  validFrom?: string | null;
  validTo?: string | null;
}

// ─── Calendar (GET /api/schedule-templates/calendar) ─────────────────────────
export interface ScheduleException {
  id: string;
  exceptionDate?: string;
  isCancelled: boolean;
  startTime?: string | null;
  endTime?: string | null;
  /** Shu kunga boshqa xona. `null` — shablondagisi. */
  room?: { id: string; name: string } | null;
  /** Shu kunga o'rinbosar o'qituvchi. `null` — shablondagisi. */
  teacher?: { id: string; fullName: string } | null;
  note?: string | null;
}

export interface CalendarSession {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  isChecked: boolean;
  sessionType: "lesson" | "exam" | "competition" | "extra";
  topic?: string | null;
  subject?: { id: string; name: string } | null;
  /** Shablondan yaratilgan bo'lsa — shablon ID'si; qo'lda yaratilgan bo'lsa `null`. */
  templateId?: string | null;
}

export interface CalendarHoliday {
  id: string;
  name: string;
}

export interface CalendarDayEntry {
  /** Dam olish kuni bo'lsa — shu kunda dars yo'q. */
  holiday?: CalendarHoliday | null;
  template: {
    id: string;
    weekday: Weekday;
    startTime: string;
    endTime: string;
    validFrom?: string | null;
    validTo?: string | null;
    room: { id: string; name: string };
    subject?: { id: string; name: string } | null;
    teacher?: { id: string; fullName: string } | null;
  };
  exception: ScheduleException | null;
  session: CalendarSession | null;
}

export type CalendarResponse = Record<string, CalendarDayEntry[]>;

// ─── Generate sessions (POST /api/schedule-templates/generate-sessions) ─────
export interface GenerateSessionsDto {
  groupId: string;
  fromDate: string;
  toDate: string;
}

export interface GenerateSessionsResponse {
  message?: string;
  created: number;
  /** Mavjud sessiya tufayli o'tkazib yuborilgan darslar soni. */
  skipped: number;
  cancelled: number;
  /** Dam olish kuniga to'g'ri kelib yaratilmagan darslar soni. */
  holidays?: number;
  /** Xona/o'qituvchi to'qnashuvi tufayli yaratilmagan darslar. */
  conflicts?: SessionSyncConflict[];
}

// ─── Exceptions (POST/PATCH/DELETE) ──────────────────────────────────────────
// `isCancelled: false` — vaqt (startTime + endTime birga), roomId yoki
// teacherId dan kamida bittasi berilishi shart.
export interface CreateExceptionDto {
  exceptionDate: string;
  isCancelled: boolean;
  note?: string;
  startTime?: string;
  endTime?: string;
  /** O'rinbosar o'qituvchi (teacher/admin roli). */
  teacherId?: string;
  /** Shu kungi boshqa xona. */
  roomId?: string;
}

export interface UpdateExceptionDto {
  isCancelled?: boolean;
  note?: string;
  startTime?: string | null;
  endTime?: string | null;
  /** `null` — shablondagisiga qaytarish. */
  teacherId?: string | null;
  roomId?: string | null;
}
