export interface TeacherScheduleTemplate {
  id: string;
  weekday: string;
  startTime: string;
  endTime: string;
  room?: { id: string; name: string };
  subject?: { id: string; name: string };
  teacher?: { id: string; fullName: string };
  validFrom?: string | null;
  validTo?: string | null;
}

export interface TeacherScheduleException {
  isCancelled?: boolean;
  startTime?: string | null;
  endTime?: string | null;
  /** Shu kunga boshqa xona. `null` — shablondagisi. */
  room?: { id: string; name: string } | null;
  /** Shu kunga o'rinbosar o'qituvchi. `null` — shablondagisi. */
  teacher?: { id: string; fullName: string } | null;
  note?: string | null;
}

export interface TeacherScheduleSession {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  sessionType: string;
  topic?: string | null;
  templateId?: string | null;
}

export interface TeacherCalendarEntry {
  /** Dam olish kuni bo'lsa `{ id, name }` — bu kunda dars yo'q. */
  holiday?: { id: string; name: string } | null;
  template: TeacherScheduleTemplate;
  exception: TeacherScheduleException | null;
  session: TeacherScheduleSession | null;
}

export type TeacherCalendarResponse = Record<string, TeacherCalendarEntry[]>;
