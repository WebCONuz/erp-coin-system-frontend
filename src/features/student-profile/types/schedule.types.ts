export interface MyScheduleTemplate {
  id: string;
  weekday: string;
  startTime: string;
  endTime: string;
  room?: { id: string; name: string };
}

export interface MyScheduleException {
  isCancelled?: boolean;
  startTime?: string;
  endTime?: string;
  note?: string | null;
}

export interface MyScheduleSession {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  sessionType: string;
  topic?: string | null;
}

export interface MyCalendarEntry {
  template: MyScheduleTemplate;
  exception: MyScheduleException | null;
  session: MyScheduleSession | null;
  group: { id: string; name: string };
}

export type MyCalendarResponse = Record<string, MyCalendarEntry[]>;
