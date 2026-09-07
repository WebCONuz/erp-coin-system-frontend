export interface TeacherScheduleTemplate {
  id: string;
  weekday: string;
  startTime: string;
  endTime: string;
  room?: { id: string; name: string };
}

export interface TeacherScheduleException {
  isCancelled?: boolean;
  startTime?: string;
  endTime?: string;
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
}

export interface TeacherCalendarEntry {
  template: TeacherScheduleTemplate;
  exception: TeacherScheduleException | null;
  session: TeacherScheduleSession | null;
}

export type TeacherCalendarResponse = Record<string, TeacherCalendarEntry[]>;
